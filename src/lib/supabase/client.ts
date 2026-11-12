import { query } from '@/lib/db';

// Minimal shim mimicking supabase client API used in the app
export function createClient() {
  return {
    // Query builder
    from: (table: string) => ({
      select: async (cols = '*') => {
        const { rows } = await query(`SELECT ${cols} FROM ${table}`);
        return { data: rows };
      },
      insert: async (data: any) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await query(sql, values);
        return { data: rows };
      }
    }),
    rpc: async (func: string, params: any = {}) => {
      const keys = Object.keys(params);
      const values = Object.values(params);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const sql = keys.length ? `SELECT * FROM ${func}(${placeholders})` : `SELECT * FROM ${func}()`;
      const { rows } = await query(sql, values);
      return { data: rows };
    },
    auth: {
      getUser: async () => ({ data: { user: null } }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => {},
      signInWithPassword: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      exchangeCodeForSession: async () => {}
    }
  } as any;
}
