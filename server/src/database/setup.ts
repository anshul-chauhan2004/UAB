import fs from 'fs';
import path from 'path';
import pool from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
    try {
        console.log('📦 Setting up database...');

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await pool.query(statement);
        }

        console.log('✅ Database schema created successfully');

        // Insert sample data for testing (optional)
        await insertSampleData();

        console.log('✅ Database setup complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

async function insertSampleData() {
    console.log('📝 Inserting sample data...');

    // Note: In production, you would register users through the API
    // This is just for testing purposes
    console.log('ℹ️  Sample data insertion skipped. Use the registration API to create users.');
}

setupDatabase();
