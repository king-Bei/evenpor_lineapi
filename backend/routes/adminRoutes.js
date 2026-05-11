const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const supabase = require('../services/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

/**
 * 管理員登入 API
 * POST /api/admin/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. 查詢管理員
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // 2. 比對密碼 (這裡假設你資料庫存的是 bcrypt hash)
    // 如果你還沒裝 bcrypt，可以用簡單的比對，但建議用 bcrypt
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // 3. 產生 JWT Token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;
