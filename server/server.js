const express = require('express');         // מייבא את express
const bodyParser = require('body-parser'); // מאפשר לקרוא body מהבקשה
const cors = require('cors');              // מאפשר חיבור בין פרונט לשרת
const authRoutes = require('./routes/auth'); // נייבא את ההתחברות (ניצור עוד רגע)

const app = express();
app.use(cors());
app.use(bodyParser.json()); // כל בקשה שנשלחת ב-JSON תתפרש אוטומטית

// כל בקשה שמתחילה ב-/auth תעבור ל-authRoutes
app.use('/auth', authRoutes);

// הפעלת השרת
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});
