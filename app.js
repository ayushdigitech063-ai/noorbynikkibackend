const express = require('express');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const bannerRoutes = require('./routes/banner.routes');
const promotionRoutes = require('./routes/promotion.routes')
const categoryRoutes = require("./routes/category.routes")
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/promotions',promotionRoutes)
app.use('/api/categories',categoryRoutes)


app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = app;