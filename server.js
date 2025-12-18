require('dotenv').config();
const express = require("express");
const connectedToDb = require('./DATABASE/DB');
const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-routes')
const adminRoutes = require('./routes/admin-routes')
const uploadImageRoutes = require('./routes/image-routes');

connectedToDb();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());                 // ✅ FIXED
app.use(express.urlencoded({ extended: true })); // optional

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/image',uploadImageRoutes);

app.listen(PORT, () => {
    console.log("Server is listening to port:", PORT);
});
