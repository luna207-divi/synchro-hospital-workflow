/* ============================================================
   SYNCHRO — Notification Adapters (Multi-Channel Architecture)
   
   Provides specialized adapters for every communication channel:
     1. InAppAdapter (Working Live In-App Toasts & Bell Panel)
     2. BrowserPushAdapter (Working Native Web Notifications API + PHI Privacy Masking)
     3. SMSAdapter (Integration Ready — Twilio / AWS SNS payload format)
     4. EmailAdapter (Integration Ready — SendGrid / AWS SES HTML email payload format)
     5. PagerAdapter (Integration Ready — TAP / SNPP Hospital Pager payload format)
     6. EnterpriseMessagingAdapter (Integration Ready — MS Teams / Slack Webhook format)
   ============================================================ */

// Sanitizes PHI (Protected Health Information) for external/OS banners
export const sanitizeForExternalBanner = (notification) => {
  const { title, message, relatedOT, relatedPatient } = notification;

  // Mask patient name if present (e.g., replace full names with MRN / anonymized initials)
  let safeMessage = message || '';
  if (relatedPatient && typeof relatedPatient === 'string') {
    safeMessage = safeMessage.replace(new RegExp(relatedPatient, 'gi'), 'Patient [Protected]');
  }

  return {
    title: title || 'Synchro Hospital Alert',
    body: safeMessage,
    tag: notification.id || `synchro-${Date.now()}`,
    icon: '/favicon.ico',
    data: {
      actionUrl: notification.actionUrl || notification.actionRoute || '/dashboard',
      relatedOT: relatedOT || null,
      priority: notification.priority || 'MEDIUM'
    }
  };
};

/**
 * Base Notification Adapter Interface
 */
class BaseAdapter {
  constructor(name, type) {
    this.name = name;
    this.type = type; // 'IN_APP' | 'BROWSER_PUSH' | 'SMS' | 'EMAIL' | 'PAGER' | 'ENTERPRISE_TEAMS'
    this.isEnabled = true;
  }

  async send(notification, recipient) {
    throw new Error(`Adapter ${this.name} must implement send()`);
  }
}

/**
 * 1. Live In-App Adapter (Renders floating toasts & updates bell panel)
 */
export class InAppAdapter extends BaseAdapter {
  constructor() {
    super('In-App Notification Adapter', 'IN_APP');
    this.listeners = new Set();
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
    return () => {};
  }

  async send(notification, recipient) {
    const payload = {
      ...notification,
      channel: 'IN_APP',
      deliveredAt: new Date().toISOString()
    };

    this.listeners.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error('[InAppAdapter] Listener error:', err);
      }
    });

    return { success: true, channel: 'IN_APP' };
  }
}

/**
 * 2. Live Browser Push Adapter (Native Web Notification API with PHI Privacy Masking)
 */
export class BrowserPushAdapter extends BaseAdapter {
  constructor() {
    super('Browser Push Adapter', 'BROWSER_PUSH');
  }

  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    try {
      const permission = await window.Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('[BrowserPushAdapter] Permission request error:', err);
      return 'denied';
    }
  }

  get permissionState() {
    if (!this.isSupported()) return 'unsupported';
    return window.Notification.permission;
  }

  async send(notification, recipient) {
    if (!this.isSupported() || window.Notification.permission !== 'granted') {
      return { success: false, channel: 'BROWSER_PUSH', reason: 'Permission not granted' };
    }

    try {
      // Apply PHI privacy masking for OS desktop popups
      const banner = sanitizeForExternalBanner(notification);

      const nativeNotif = new window.Notification(banner.title, {
        body: banner.body,
        icon: banner.icon,
        tag: banner.tag,
        data: banner.data,
        silent: notification.priority === 'LOW'
      });

      nativeNotif.onclick = (e) => {
        e.preventDefault();
        window.focus();
        if (banner.data?.actionUrl && typeof window !== 'undefined') {
          window.location.hash = banner.data.actionUrl;
        }
        nativeNotif.close();
      };

      return { success: true, channel: 'BROWSER_PUSH' };
    } catch (err) {
      console.warn('[BrowserPushAdapter] Dispatch error:', err);
      return { success: false, channel: 'BROWSER_PUSH', error: err.message };
    }
  }
}

/**
 * 3. Integration-Ready SMS Adapter (Twilio / AWS SNS payload format)
 */
export class SMSAdapter extends BaseAdapter {
  constructor() {
    super('SMS Gateway Adapter (Twilio / SNS)', 'SMS');
  }

  async send(notification, recipient) {
    const payload = {
      to: recipient?.phone || '+1-555-0199',
      body: `[SYNCHRO ${notification.priority}] ${notification.title}: ${notification.message}. Action: ${notification.actionLabel || 'View in Synchro'}`,
      senderId: 'SYNCHRO-ALERT',
      timestamp: new Date().toISOString()
    };

    console.log('[SMSAdapter Placeholder] Integration payload generated:', payload);
    return {
      success: true,
      channel: 'SMS',
      simulatedPayload: payload,
      note: 'Integration ready — format compatible with Twilio / AWS SNS API'
    };
  }
}

/**
 * 4. Integration-Ready Email Adapter (SendGrid / AWS SES HTML format)
 */
export class EmailAdapter extends BaseAdapter {
  constructor() {
    super('Email Adapter (SendGrid / SES)', 'EMAIL');
  }

  async send(notification, recipient) {
    const payload = {
      to: recipient?.email || 'staff@synchro-hospital.org',
      subject: `[${notification.priority}] ${notification.title}`,
      htmlTemplate: `
        <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #38bdf8;">Synchro Hospital Notification</h2>
          <h3>${notification.title}</h3>
          <p>${notification.message}</p>
          <p><strong>Department:</strong> ${notification.department || 'Clinical Operations'}</p>
          <p><strong>Priority:</strong> ${notification.priority}</p>
          <a href="${notification.actionUrl || '#'}" style="background: #0284c7; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px;">
            ${notification.actionLabel || 'Open Synchro Portal'}
          </a>
        </div>
      `,
      timestamp: new Date().toISOString()
    };

    console.log('[EmailAdapter Placeholder] Integration payload generated:', payload);
    return {
      success: true,
      channel: 'EMAIL',
      simulatedPayload: payload,
      note: 'Integration ready — format compatible with SendGrid / AWS SES API'
    };
  }
}

/**
 * 5. Integration-Ready Hospital Pager Adapter (TAP / SNPP Protocol)
 */
export class PagerAdapter extends BaseAdapter {
  constructor() {
    super('Hospital Pager Adapter (TAP / SNPP)', 'PAGER');
  }

  async send(notification, recipient) {
    const payload = {
      pagerNumber: recipient?.pagerCode || 'PAGER-9921',
      protocol: 'SNPP_V3',
      message: `PRIORITY-${notification.priority}: ${notification.title}. ${notification.message}`,
      timestamp: new Date().toISOString()
    };

    console.log('[PagerAdapter Placeholder] Integration payload generated:', payload);
    return {
      success: true,
      channel: 'PAGER',
      simulatedPayload: payload,
      note: 'Integration ready — SNPP protocol payload generated (no active pager gateway connected)'
    };
  }
}

/**
 * 6. Integration-Ready Enterprise Messaging Adapter (MS Teams / Slack Webhook)
 */
export class EnterpriseMessagingAdapter extends BaseAdapter {
  constructor() {
    super('Enterprise Messaging Adapter (MS Teams / Slack)', 'ENTERPRISE_TEAMS');
  }

  async send(notification, recipient) {
    const payload = {
      summary: notification.title,
      themeColor: notification.priority === 'CRITICAL' ? 'FF0000' : '0076D7',
      sections: [{
        activityTitle: notification.title,
        activitySubtitle: `Department: ${notification.department || 'Hospital Operations'}`,
        facts: [
          { name: 'Priority', value: notification.priority },
          { name: 'Related OT', value: notification.relatedOT || 'N/A' },
          { name: 'Timestamp', value: new Date().toLocaleTimeString() }
        ],
        text: notification.message
      }],
      potentialAction: [{
        '@type': 'OpenUri',
        name: notification.actionLabel || 'View in Synchro',
        targets: [{ os: 'default', uri: notification.actionUrl || 'https://synchro.hospital' }]
      }]
    };

    console.log('[EnterpriseMessagingAdapter Placeholder] Webhook payload generated:', payload);
    return {
      success: true,
      channel: 'ENTERPRISE_TEAMS',
      simulatedPayload: payload,
      note: 'Integration ready — MS Teams Adaptive Card webhook payload generated'
    };
  }
}

// Singletons instance map
export const adapters = {
  inApp: new InAppAdapter(),
  browserPush: new BrowserPushAdapter(),
  sms: new SMSAdapter(),
  email: new EmailAdapter(),
  pager: new PagerAdapter(),
  enterpriseTeams: new EnterpriseMessagingAdapter()
};
