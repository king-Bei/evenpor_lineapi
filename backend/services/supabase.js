const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
// 後端建議優先使用 SERVICE_ROLE_KEY 以繞過 RLS 限制
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables! Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // 針對 Node.js 20 以下版本提供 WebSocket 支援
  auth: {
    persistSession: false
  }
});

// 如果報錯提示需要 transport，通常是在 realtime 設定中
const supabaseWithWs = createClient(supabaseUrl, supabaseKey, {
  accessToken: async () => supabaseKey,
  realtime: {
    transport: ws,
  },
});

module.exports = supabaseWithWs;
