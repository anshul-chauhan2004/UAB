import pool from '../config/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function resetPassword() {
    const email = 'teacher@gmail.com';
    const newPassword = '123456';

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await pool.query<any>(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [hashedPassword, email]
        );

        if (result.affectedRows > 0) {
            console.log(`✅ Password successfully reset for ${email}`);
        } else {
            console.log(`❌ User not found: ${email}`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
}

resetPassword();
