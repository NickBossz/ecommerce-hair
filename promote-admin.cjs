require('dotenv').config({ path: './backend/.env' });
const { Client } = require('pg');

const promoteToAdmin = async () => {
  const client = new Client({
    connectionString: process.env.SUPABASE_URL?.replace('https://', 'postgresql://postgres:') + ':5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado!\n');

    const adminEmail = 'admin@gmail.com';

    console.log(`🔍 Buscando usuário: ${adminEmail}`);

    // Buscar usuário
    const userQuery = await client.query(
      'SELECT id, email, role FROM user_profiles WHERE email = $1',
      [adminEmail]
    );

    if (userQuery.rows.length === 0) {
      console.log('❌ Usuário não encontrado!');
      console.log('\n💡 O usuário precisa fazer signup primeiro em:');
      console.log('   http://localhost:5173/login (aba Cadastrar)');
      console.log('\n   Depois execute este script novamente.');
      return;
    }

    const user = userQuery.rows[0];
    console.log('✅ Usuário encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role atual: ${user.role}\n`);

    if (user.role === 'admin') {
      console.log('ℹ️  Usuário já é admin!');
      return;
    }

    // Promover para admin
    console.log('⬆️  Promovendo para admin...');
    await client.query(
      'UPDATE user_profiles SET role = $1 WHERE email = $2',
      ['admin', adminEmail]
    );

    console.log('✅ Usuário promovido para admin com sucesso!\n');
    console.log('🎉 Agora você pode acessar:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Painel Admin: http://localhost:5174\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexão encerrada.');
  }
};

promoteToAdmin();
