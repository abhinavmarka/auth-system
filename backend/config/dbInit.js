import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function initializeDatabase() {
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  const targetDbName = process.env.DB_NAME || 'auth_system_db';

  console.log(`Connecting to PostgreSQL at ${dbHost}:${dbPort} as user '${dbUser}'...`);

  // Step 1: Connect to default 'postgres' database to check/create the target database
  const defaultClient = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres', // connect to default maintenance database
  });

  try {
    await defaultClient.connect();
    console.log('Connected to default database successfully.');

    // Check if database exists
    const checkDbResult = await defaultClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [targetDbName]
    );

    if (checkDbResult.rows.length === 0) {
      console.log(`Database '${targetDbName}' does not exist. Creating...`);
      // CREATE DATABASE cannot run inside a transaction, must run standalone
      await defaultClient.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`Database '${targetDbName}' created successfully.`);
    } else {
      console.log(`Database '${targetDbName}' already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error.message);
    process.exit(1);
  } finally {
    await defaultClient.end();
  }

  // Step 2: Connect to the target database and initialize schema
  console.log(`Connecting to target database '${targetDbName}' to initialize tables...`);
  const targetClient = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: targetDbName,
  });

  try {
    await targetClient.connect();
    console.log('Connected to target database.');

    // Enable uuid-ossp extension (or gen_random_uuid works in PG 13+ without extension, but good practice to enable)
    await targetClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('UUID extension checked/enabled.');

    // Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `;
    await targetClient.query(createTableQuery);
    console.log("Table 'users' verified/created.");

    // Create index on email for faster query lookups
    await targetClient.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    console.log("Index 'idx_users_email' verified/created.");

    // Step 3: Seed default admin user
    const adminEmail = 'admin@authsystem.com';
    const adminCheck = await targetClient.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

    if (adminCheck.rows.length === 0) {
      console.log('Seeding default administrator...');
      const adminPassword = 'AdminSecure2026!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await targetClient.query(
        `INSERT INTO users (name, email, password_hash, role) 
         VALUES ($1, $2, $3, $4)`,
        ['System Administrator', adminEmail, hashedPassword, 'admin']
      );
      console.log(`Default administrator seeded successfully!`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    } else {
      console.log('Administrator account already exists in database.');
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Schema initialization error:', error);
    process.exit(1);
  } finally {
    await targetClient.end();
  }
}

// Run if called directly
initializeDatabase();
export default initializeDatabase;
