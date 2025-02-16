const { createClient: createSupabaseClient } = require('@supabase/supabase-js');

const supabase = createSupabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

module.exports = supabase;
