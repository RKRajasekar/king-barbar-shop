require('dotenv').config();
const { execSync } = require('child_process');
const { Client } = require('pg');
const EmbeddedPostgresModule = require('embedded-postgres');
const EmbeddedPostgres = EmbeddedPostgresModule.default || EmbeddedPostgresModule;
const path = require('path');
const fs = require('fs');

let pgInstance = null;

async function testConnection(url) {
  const client = new Client({ connectionString: url, connectionTimeoutMillis: 2000 });
  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return true;
  } catch (err) {
    return false;
  }
}

async function startEmbeddedPostgres() {
  console.log('⚡ Launching Embedded PostgreSQL engine on Windows...');
  const dataDir = path.join(__dirname, '.pg_data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  pgInstance = new EmbeddedPostgres({
    databaseDir: dataDir,
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    persistent: true,
  });

  try {
    await pgInstance.initialise();
  } catch (e) {
    // Already initialised
  }

  await pgInstance.start();
  console.log('✅ Embedded PostgreSQL is running on port 5432!');

  try {
    await pgInstance.createDatabase('king_barbar_shop');
    console.log('✅ Created database "king_barbar_shop"');
  } catch (e) {
    // Database may already exist
  }
}

async function setupDatabase() {
  console.log('🔍 Checking PostgreSQL Database Connection...');
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/king_barbar_shop';

  const isConnected = await testConnection(databaseUrl);

  if (!isConnected) {
    await startEmbeddedPostgres();
  } else {
    console.log('✅ Connected to existing PostgreSQL server!');
  }

  // Run Prisma generate
  console.log('🔄 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });

  // Push schema
  console.log('🔄 Pushing Schema to PostgreSQL Database...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', cwd: __dirname });

  // Run seed
  console.log('🌱 Seeding initial records...');
  execSync('node prisma/seed.js', { stdio: 'inherit', cwd: __dirname });

  console.log('✨ KING BARBAR SHOP database setup completed successfully!');
}

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Setup finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Database setup error:', err);
      process.exit(1);
    });
}

module.exports = { setupDatabase, startEmbeddedPostgres, testConnection };
