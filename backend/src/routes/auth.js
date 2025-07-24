const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const UserItem = require('../models/UserItem');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Kullanıcı adı ve şifre gereklidir.'
      });
    }

    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.'
      });
    }

    res.json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: user._id,
        username: user.username,
        energy: user.energy
      },
      userId: user._id.toString()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası oluştu.'
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Kullanıcı adı ve şifre gereklidir.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Şifre en az 6 karakter olmalıdır.'
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Bu kullanıcı adı zaten kullanılıyor.'
      });
    }

    const newUser = new User({
      username,
      password, 
      energy: 100,
      lastEnergyUpdate: new Date()
    });

    await newUser.save();

    const items = await Item.find();
    const userItems = items.map(item => ({
      userId: newUser._id,
      itemId: item._id,
      level: 1,
      progress: 0
    }));

    await UserItem.insertMany(userItems);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      user: {
        id: newUser._id,
        username: newUser.username,
        energy: newUser.energy
      },
      userId: newUser._id.toString()
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası oluştu.'
    });
  }
});

router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Çıkış başarılı'
  });
});

module.exports = router; 