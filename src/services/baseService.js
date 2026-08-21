import { supabase } from '../lib/supabase';

/* ============================================================
   SYNCHRO — Base Service Layer
   Standardized database CRUD helper with error handling,
   filtering, pagination, and fallback handling.
   ============================================================ */

export class BaseService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Get all records with optional filters and sorting
  async getAll({ select = '*', filters = {}, orderBy = { column: 'created_at', ascending: false }, limit, offset } = {}) {
    try {
      let query = supabase.from(this.tableName).select(select);

      // Apply equality filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== 'ALL' && value !== 'All') {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Apply ordering
      if (orderBy && orderBy.column) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + limit - 1);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { data: data || [], count };
    } catch (err) {
      console.warn(`[BaseService:${this.tableName}] getAll error:`, err.message || err);
      return { data: [], error: err };
    }
  }

  // Get single record by ID
  async getById(id, select = '*') {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(select)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.warn(`[BaseService:${this.tableName}] getById error (${id}):`, err.message || err);
      return { data: null, error: err };
    }
  }

  // Create record
  async create(recordData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([recordData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error(`[BaseService:${this.tableName}] create error:`, err.message || err);
      return { data: null, error: err };
    }
  }

  // Update record by ID
  async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error(`[BaseService:${this.tableName}] update error (${id}):`, err.message || err);
      return { data: null, error: err };
    }
  }

  // Delete record by ID
  async delete(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error(`[BaseService:${this.tableName}] delete error (${id}):`, err.message || err);
      return { data: null, error: err };
    }
  }
}
