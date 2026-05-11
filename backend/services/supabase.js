const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// 後端建議優先使用 SERVICE_ROLE_KEY 以繞過 RLS 限制
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables! Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
