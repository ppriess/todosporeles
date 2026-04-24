const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  try {
    // Lê o arquivo JSON
    const rawData = fs.readFileSync('./data/base_dados_animal_sc_final.json', 'utf8');
    const ngos = JSON.parse(rawData);

    console.log(`📁 Arquivo carregado: ${ngos.length} registros encontrados\n`);

    // Verifica estrutura do primeiro registro
    if (ngos.length > 0) {
      console.log('Estrutura do primeiro registro:');
      console.log(JSON.stringify(ngos[0], null, 2));
      console.log('\n');
    }

    // Tenta inserir os dados
    console.log('Tentando inserir dados na tabela "ngos"...\n');
    const { data, error } = await supabase
      .from('ngos')
      .insert(ngos);

    if (error) {
      console.error('❌ Erro ao inserir:', error.message);
      console.error('Código:', error.code);

      // Tenta descobrir que tabelas existem
      console.log('\n📋 Tentando listar tabelas disponíveis...');
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (!tablesError && tables) {
        console.log('Tabelas disponíveis:');
        tables.forEach(t => console.log(`  - ${t.table_name}`));
      }

      process.exit(1);
    }

    console.log('✅ Dados inseridos com sucesso!');
    console.log(`📊 ${data?.length || ngos.length} registros inseridos`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

importData();
