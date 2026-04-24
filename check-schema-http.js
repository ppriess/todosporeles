const fetch = require('node-fetch').default || require('node-fetch');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function checkSchema() {
  try {
    // Lê o arquivo JSON
    const rawData = fs.readFileSync('./data/base_dados_animal_sc_final.json', 'utf8');
    const ngos = JSON.parse(rawData);

    console.log('🔍 Consultando API REST do Supabase...\n');

    // Tenta fazer uma chamada direto no endpoint de introspection
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
    const text = await response.text();

    console.log('Resposta da API:');
    console.log(text);

  } catch (err) {
    console.error('Erro:', err.message);
  }
}

checkSchema();
