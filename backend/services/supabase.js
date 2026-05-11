const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
// 後端建議優先使用 SERVICE_ROLE_KEY 以繞過 RLS 限制
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables! Please check your .env file.');
}

// 針對 Node.js 20 以下版本，必須在 realtime 中明確提供 ws 作為 transport
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws,
  },
  auth: {
    persistSession: false // 後端通常不需要持久化 session
  }
});

module.exports = supabase;
