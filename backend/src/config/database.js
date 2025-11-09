import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

// Cliente Supabase com anon key (para operações normais)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Cliente Supabase com service key (para operações administrativas)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

// Testar conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);

    if (error) {
      console.error('Erro ao conectar com Supabase:', error.message);
      return false;
    }

    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error.message);
    return false;
  }
};
