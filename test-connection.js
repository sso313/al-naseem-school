
import { supabase } from './supabase.js';

async function testConnection() {
  const { data, error } = await supabase
    .from('classes')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Connection test failed:', error.message);
    return;
  }

  console.log('Supabase connection successful.');
}

testConnection();
