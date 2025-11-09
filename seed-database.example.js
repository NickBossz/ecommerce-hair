import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do banco
// INSTRUÇÕES:
// 1. Copie este arquivo: cp seed-database.example.js seed-database.js
// 2. Obtenha a senha em: Supabase Dashboard → Settings → Database → Connection string
// 3. Substitua 'your-database-password-here' pela senha real
// 4. Execute: npm run db:seed

const config = {
  host: 'db.hyivpxxuoschkezzglty.supabase.co',
  port: 5432,
  user: 'postgres.hyivpxxuoschkezzglty',
  password: 'your-database-password-here', // ← SUBSTITUA AQUI
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  family: 4
};

async function seedDatabase() {
  const client = new pg.Client(config);

  try {
    console.log('🔌 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado!\n');

    console.log('📄 Lendo arquivo seed-data.sql...');
    const seedPath = path.join(__dirname, 'seed-data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    console.log('✅ Arquivo carregado!\n');

    console.log('🌱 Executando seed no banco de dados...\n');
    await client.query(seedSQL);

    console.log('\n🎉 Seed executado com sucesso!');

    // Verificar dados inseridos
    console.log('\n📊 Verificando dados...\n');

    const categoriesResult = await client.query('SELECT COUNT(*) as count FROM categories');
    console.log(`   📁 Categorias: ${categoriesResult.rows[0].count}`);

    const productsResult = await client.query('SELECT COUNT(*) as count FROM products');
    console.log(`   📦 Produtos: ${productsResult.rows[0].count}`);

    const imagesResult = await client.query('SELECT COUNT(*) as count FROM product_images');
    console.log(`   🖼️  Imagens: ${imagesResult.rows[0].count}`);

    const featuredResult = await client.query('SELECT COUNT(*) as count FROM products WHERE is_featured = true');
    console.log(`   ⭐ Produtos em destaque: ${featuredResult.rows[0].count}`);

    // Listar produtos criados
    console.log('\n📋 Produtos criados:\n');
    const productsList = await client.query(`
      SELECT
        p.name,
        c.name as category,
        p.price,
        p.stock_quantity,
        p.is_featured
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY c.name, p.name
    `);

    productsList.rows.forEach(row => {
      const featured = row.is_featured ? '⭐' : '  ';
      console.log(`   ${featured} ${row.name}`);
      console.log(`      Categoria: ${row.category} | R$ ${row.price} | Estoque: ${row.stock_quantity}`);
    });

  } catch (error) {
    console.error('\n❌ Erro ao executar seed:', error.message);
    if (error.detail) console.error('   Detalhes:', error.detail);
    if (error.hint) console.error('   Dica:', error.hint);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada.');
  }
}

// Executar
console.log('🌱 SEED DATABASE - E-COMMERCE FABHAIR\n');
console.log('Este script irá inserir dados de exemplo no banco de dados.');
console.log('Produtos e categorias já existentes não serão duplicados.\n');

seedDatabase();
