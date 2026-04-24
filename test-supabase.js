const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✓ Presente' : '✗ Faltando');

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Tenta obter a sessão atual (não precisa de tabelas)
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    // Se conseguir se conectar e fazer uma request, já é sucesso
    // (mesmo que não haja sessão ativa)
    if (sessionError && sessionError.message !== 'Auth session missing!') {
      console.error('Erro ao conectar:', sessionError.message);
      process.exit(1);
    }

    console.log('✓ Conexão bem-sucedida!');
    console.log('Status:', session?.user ? 'Usuário autenticado' : 'Conexão anônima');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao conectar:', err.message);
    process.exit(1);
  }
}

testConnection();
