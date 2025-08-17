const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // 🟢 טעינת משתני סביבה מה-.env

const app = express();

// 📦 מידלווארים
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ טעינת רואטרים
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// ✅ הפעלת השרת
const PORT = process.env.PORT || 3001; // 🟢 עכשיו נלקח מה-.env אם קיים
app.listen(PORT, () => {
  console.log('🔥 Server is running on port', PORT);
});
