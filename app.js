const express = require("express");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const bannerRoutes = require("./routes/banner.routes");
const promotionRoutes = require("./routes/promotion.routes");
const categoryRoutes = require("./routes/category.routes");
const cartRoutes = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishList.routes");
const editorialRoutes = require('./routes/editorial.routes');
const contactRoutes = require("./routes/contact.routes")
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "http://localhost:3000", // Next.js local dev server
  // 'https://your-frontend-domain.com' // Production URL (baad ke liye)
];


app.use(
  cors({
    origin: function (origin, callback) {
    
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use('/api/editorial', editorialRoutes);
app.use("/api/contact",contactRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

module.exports = app;
