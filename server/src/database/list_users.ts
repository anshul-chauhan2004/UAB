import pool from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function listUsers() {
    try {
        console.log('Server PORT from env:', process.env.PORT);
        const [users] = await pool.query<any>('SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC');
        console.table(users);
        process.exit(0);
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
}

listUsers();
