import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';

class NotificationService extends BaseService {
  constructor() {
    super('notifications');
  }

  // Get unread count for user
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { count: count || 0, error: null };
    } catch (err) {
      console.warn('[NotificationService] getUnreadCount error:', err);
      return { count: 0, error: err };
    }
  }

  // Mark single as read
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[NotificationService] markAsRead error:', err);
      return { data: null, error: err };
    }
  }

  // Mark all as read for user
  async markAllAsRead(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[NotificationService] markAllAsRead error:', err);
      return { data: null, error: err };
    }
  }
}

export const notificationService = new NotificationService();
