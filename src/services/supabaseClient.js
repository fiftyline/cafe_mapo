import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 anon 키를 입력하세요.
const supabaseUrl = 'https://xwbizzclxfjbcbqhsxdt.supabase.co';
const supabaseAnonKey = 'sb_publishable_UvzgfsI1Tp_fNaG6U0Q41A_ET7_M1Hi';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;