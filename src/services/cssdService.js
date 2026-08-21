import { BaseService } from './baseService';
import { supabase } from '../lib/supabase';
import { workflowEngine } from './workflowEngine';

class CssdService extends BaseService {
  constructor() {
    super('cssd_packs');
  }

  // Get packs with assigned theatre and surgery
  async getPacksDetailed({ status, packType, search } = {}) {
    try {
      let query = supabase.from('cssd_packs').select(`
        *,
        assigned_theatre:operating_theatres (id, suite_code, name),
        assigned_surgery:surgeries (id, surgery_code, procedure_name)
      `).order('updated_at', { ascending: false });

      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      }
      if (packType && packType !== 'ALL') {
        query = query.eq('pack_type', packType);
      }
      if (search) {
        query = query.or(`pack_code.ilike.%${search}%,pack_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.warn('[CssdService] getPacksDetailed error:', err);
      return { data: [], error: err };
    }
  }

  // Dispatch pack to an operating theatre
  async dispatchPack(packId, theatreId, surgeryId = null, performedBy = null) {
    try {
      // 1. Update pack record
      const { data: updatedPack, error: packErr } = await supabase
        .from('cssd_packs')
        .update({
          status: 'DISPATCHED',
          assigned_theatre_id: theatreId,
          assigned_surgery_id: surgeryId,
          current_location: 'In Transit → OT',
          updated_at: new Date().toISOString()
        })
        .eq('id', packId)
        .select()
        .single();

      if (packErr) throw packErr;

      // 2. Log CSSD event
      await supabase.from('cssd_pack_events').insert([{
        pack_id: packId,
        event_type: 'DISPATCHED',
        from_status: 'STERILE',
        to_status: 'DISPATCHED',
        theatre_id: theatreId,
        surgery_id: surgeryId,
        performed_by: performedBy
      }]).catch(() => {});

      // 3. Check if this resolves a blocked theatre & set status to READY
      if (theatreId) {
        await supabase
          .from('operating_theatres')
          .update({
            status: 'READY',
            block_reason: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', theatreId);

        // Update any blocked surgery for this OT
        await supabase
          .from('surgeries')
          .update({
            status: 'INSTRUMENT_READY',
            block_reason: null,
            updated_at: new Date().toISOString()
          })
          .eq('theatre_id', theatreId);
      }

      // 4. Trigger Central Workflow Engine Event: Dispatches Pack & sets Instrument Ready, sends Doctor Notification, updates Admin & Analytics
      await workflowEngine.onPackDispatched(packId, theatreId, surgeryId, performedBy);

      return { data: updatedPack, error: null };
    } catch (err) {
      console.error('[CssdService] dispatchPack error:', err);
      // Fallback: trigger workflow engine even on mock network
      await workflowEngine.onPackDispatched(packId, theatreId, surgeryId, performedBy);
      return { data: null, error: err };
    }
  }
}

export const cssdService = new CssdService();
