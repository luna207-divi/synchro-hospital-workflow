import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';

class BillingService extends BaseService {
  constructor() {
    super('billing_accounts');
  }

  async getAccountWithDetails(patientId) {
    try {
      const { data, error } = await supabase
        .from('billing_accounts')
        .select(`
          *,
          patient:patients (*),
          invoices:invoices (*),
          payments:payments (*)
        `)
        .eq('patient_id', patientId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[BillingService] getAccountWithDetails error:', err);
      return { data: [], error: err };
    }
  }
}

export const billingService = new BillingService();
