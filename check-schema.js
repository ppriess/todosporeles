const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    // Lê o arquivo JSON
    const rawData = fs.readFileSync('./data/base_dados_animal_sc_final.json', 'utf8');
    const ngos = JSON.parse(rawData);

    console.log('🔍 Procurando tabelas no Supabase...\n');

    // Tenta várias queries para descobrir tabelas
    const tableNames = [
      'ngos', 'ongs', 'organizations', 'animal_orgs',
      'ngo', 'ong', 'organization', 'animal_org',
      'entities', 'entity', 'providers', 'provider',
      'establishments', 'establishment'
    ];

    let foundTables = [];

    for (const tableName of tableNames) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error) {
        foundTables.push(tableName);
        console.log(`✅ Tabela encontrada: "${tableName}"`);
      }
    }

    if (foundTables.length === 0) {
      console.log('❌ Nenhuma tabela compatível encontrada.');
      console.log('\nTentando acessar metadados do banco...\n');

      // Tenta acessar a view pg_tables
      const { data: tables, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');

      if (!error && tables && tables.length > 0) {
        console.log('Tabelas no schema public:');
        tables.forEach(t => console.log(`  - ${t.tablename}`));
      } else {
        console.log('Não foi possível listar tabelas via pg_tables');
      }
      process.exit(1);
    }

    console.log(`\n📊 Analisando estrutura das tabelas encontradas...\n`);

    // Para cada tabela encontrada, verifica os campos
    for (const tableName of foundTables) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Tabela: "${tableName}"`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      // Pega um registro para ver a estrutura
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error && data && data.length > 0) {
        console.log('Campos encontrados na tabela:');
        const fields = Object.keys(data[0]);
        fields.forEach(field => {
          console.log(`  - ${field}`);
        });

        // Compara com os campos do JSON
        console.log('\nComparação com dados do JSON:');
        const jsonFields = Object.keys(ngos[0]);
        const tableFields = Object.keys(data[0]);

        // Campos do JSON que existem na tabela
        const matching = jsonFields.filter(f => tableFields.includes(f));
        const missing = jsonFields.filter(f => !tableFields.includes(f));
        const extra = tableFields.filter(f => !jsonFields.includes(f));

        if (matching.length > 0) {
          console.log(`  ✅ Campos compatíveis (${matching.length}):`);
          matching.forEach(f => console.log(`     - ${f}`));
        }

        if (missing.length > 0) {
          console.log(`  ⚠️  Campos do JSON não existem na tabela (${missing.length}):`);
          missing.forEach(f => console.log(`     - ${f}`));
        }

        if (extra.length > 0) {
          console.log(`  ℹ️  Campos extras na tabela (${extra.length}):`);
          extra.forEach(f => console.log(`     - ${f}`));
        }

        // Verifica se pode fazer insert
        console.log(`\n✅ Compatibilidade: ${matching.length}/${jsonFields.length} campos do JSON`);
        const compatibility = Math.round((matching.length / jsonFields.length) * 100);
        console.log(`📈 Taxa de compatibilidade: ${compatibility}%`);

      } else {
        console.log('❌ Não foi possível acessar os dados da tabela');
      }
    }

    process.exit(0);

  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

checkSchema();
