# MongoDB Atlas Setup & Migration Guide

## 📋 Overview

This guide explains how to set up MongoDB Atlas for the E-commerce FabHair project after migrating from Supabase.

## 🗄️ MongoDB Collections

### 1. **users**
User accounts and authentication data.

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcrypt hash),
  full_name: String (optional),
  phone: String (optional),
  avatar_url: String (optional),
  role: String ('customer' | 'admin' | 'superadmin'),
  created_at: Date,
  updated_at: Date,
  last_sign_in_at: Date (optional)
}
```

**Indexes:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

---

### 2. **categories**
Product categories with hierarchical support.

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique),
  description: String (optional),
  parent_id: ObjectId (optional, reference to categories),
  display_order: Number,
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

**Indexes:**
```javascript
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ parent_id: 1 })
db.categories.createIndex({ is_active: 1 })
```

---

### 3. **products**
Product catalog with pricing and inventory.

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique),
  description: String,
  short_description: String (optional),
  price: Number,
  compare_at_price: Number (optional),
  stock_quantity: Number,
  category_id: ObjectId (reference to categories),
  is_featured: Boolean,
  is_active: Boolean,
  created_by: ObjectId (reference to users),
  created_at: Date,
  updated_at: Date
}
```

**Indexes:**
```javascript
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ category_id: 1 })
db.products.createIndex({ is_featured: 1 })
db.products.createIndex({ is_active: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ name: "text", description: "text" }) // Full-text search
```

---

### 4. **product_images**
Images associated with products.

```javascript
{
  _id: ObjectId,
  product_id: ObjectId (reference to products),
  image_url: String,
  alt_text: String (optional),
  is_primary: Boolean,
  display_order: Number,
  created_at: Date
}
```

**Indexes:**
```javascript
db.product_images.createIndex({ product_id: 1 })
db.product_images.createIndex({ is_primary: 1 })
```

---

### 5. **wishlists**
User wishlist items.

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (reference to users),
  product_id: ObjectId (reference to products),
  added_at: Date,
  created_at: Date,
  updated_at: Date
}
```

**Indexes:**
```javascript
db.wishlists.createIndex({ user_id: 1 })
db.wishlists.createIndex({ product_id: 1 })
db.wishlists.createIndex({ user_id: 1, product_id: 1 }, { unique: true })
```

---

### 6. **site_settings**
Global site configuration key-value pairs.

```javascript
{
  key: String (unique),
  value: Mixed (any type),
  updated_at: Date
}
```

**Indexes:**
```javascript
db.site_settings.createIndex({ key: 1 }, { unique: true })
```

**Default Settings:**
```javascript
[
  { key: "site_name", value: "FabHair" },
  { key: "site_description", value: "Loja de produtos capilares" },
  { key: "contact_email", value: "contato@fabhair.com" },
  { key: "contact_phone", value: "(11) 99999-9999" },
  { key: "whatsapp", value: "5511999999999" },
  { key: "address_street", value: "" },
  { key: "address_neighborhood", value: "" },
  { key: "address_city", value: "" },
  { key: "address_state", value: "" },
  { key: "address_zipcode", value: "" },
  { key: "business_hours", value: "Seg-Sex: 9h-18h" },
  { key: "maps_link", value: "" },
  { key: "instagram", value: "" },
  { key: "facebook", value: "" },
  { key: "tiktok", value: "" },
  { key: "youtube", value: "" }
]
```

---

### 7. **orders** (Future)
Customer orders.

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (reference to users),
  order_number: String (unique),
  total_amount: Number,
  status: String ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'),
  payment_method: String (optional),
  payment_status: String ('unpaid' | 'paid' | 'failed'),
  shipping_address: String (optional),
  tracking_number: String (optional),
  notes: String (optional),
  created_at: Date,
  updated_at: Date
}
```

**Indexes:**
```javascript
db.orders.createIndex({ user_id: 1 })
db.orders.createIndex({ order_number: 1 }, { unique: true })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ created_at: -1 })
```

---

### 8. **order_items** (Future)
Items within orders.

```javascript
{
  _id: ObjectId,
  order_id: ObjectId (reference to orders),
  product_id: ObjectId (reference to products),
  quantity: Number,
  price_at_purchase: Number,
  subtotal: Number,
  created_at: Date
}
```

**Indexes:**
```javascript
db.order_items.createIndex({ order_id: 1 })
db.order_items.createIndex({ product_id: 1 })
```

---

## 🚀 Setup Instructions

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free Tier is sufficient for development)

### 2. Configure Network Access

1. Go to **Network Access** in MongoDB Atlas
2. Click **Add IP Address**
3. For development: Add `0.0.0.0/0` (allows all IPs - use carefully)
4. For production: Add only your server IPs

### 3. Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Create a user with a strong password
4. Grant **Read and write to any database** permission

### 4. Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Optionally replace `<dbname>` with `ecommerce`

Example:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### 5. Create Database and Collections

You can use **MongoDB Compass** (GUI) or **mongosh** (CLI):

```javascript
// Switch to ecommerce database
use ecommerce

// Create collections with validation (optional but recommended)
db.createCollection("users")
db.createCollection("categories")
db.createCollection("products")
db.createCollection("product_images")
db.createCollection("wishlists")
db.createCollection("site_settings")
db.createCollection("orders")
db.createCollection("order_items")
```

### 6. Create Indexes

Run these commands in MongoDB Compass or mongosh:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Categories
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ parent_id: 1 })
db.categories.createIndex({ is_active: 1 })

// Products
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ category_id: 1 })
db.products.createIndex({ is_featured: 1 })
db.products.createIndex({ is_active: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ name: "text", description: "text" })

// Product Images
db.product_images.createIndex({ product_id: 1 })
db.product_images.createIndex({ is_primary: 1 })

// Wishlists
db.wishlists.createIndex({ user_id: 1 })
db.wishlists.createIndex({ product_id: 1 })
db.wishlists.createIndex({ user_id: 1, product_id: 1 }, { unique: true })

// Site Settings
db.site_settings.createIndex({ key: 1 }, { unique: true })

// Orders
db.orders.createIndex({ user_id: 1 })
db.orders.createIndex({ order_number: 1 }, { unique: true })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ created_at: -1 })

// Order Items
db.order_items.createIndex({ order_id: 1 })
db.order_items.createIndex({ product_id: 1 })
```

### 7. Insert Default Data

```javascript
// Default categories
db.categories.insertMany([
  {
    name: "Shampoos",
    slug: "shampoos",
    description: "Shampoos profissionais para todos os tipos de cabelo",
    parent_id: null,
    display_order: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Condicionadores",
    slug: "condicionadores",
    description: "Condicionadores hidratantes",
    parent_id: null,
    display_order: 1,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Máscaras",
    slug: "mascaras",
    description: "Tratamentos intensivos",
    parent_id: null,
    display_order: 2,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Finalizadores",
    slug: "finalizadores",
    description: "Produtos para finalização",
    parent_id: null,
    display_order: 3,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
])

// Default site settings
db.site_settings.insertMany([
  { key: "site_name", value: "FabHair", updated_at: new Date() },
  { key: "site_description", value: "Loja de produtos capilares", updated_at: new Date() },
  { key: "contact_email", value: "contato@fabhair.com", updated_at: new Date() },
  { key: "contact_phone", value: "(11) 99999-9999", updated_at: new Date() },
  { key: "whatsapp", value: "5511999999999", updated_at: new Date() },
  { key: "address_street", value: "", updated_at: new Date() },
  { key: "address_neighborhood", value: "", updated_at: new Date() },
  { key: "address_city", value: "", updated_at: new Date() },
  { key: "address_state", value: "", updated_at: new Date() },
  { key: "address_zipcode", value: "", updated_at: new Date() },
  { key: "business_hours", value: "Seg-Sex: 9h-18h", updated_at: new Date() },
  { key: "maps_link", value: "", updated_at: new Date() },
  { key: "instagram", value: "", updated_at: new Date() },
  { key: "facebook", value: "", updated_at: new Date() },
  { key: "tiktok", value: "", updated_at: new Date() },
  { key: "youtube", value: "", updated_at: new Date() }
])
```

### 8. Configure Environment Variables

1. Copy `.env.example` to `.env` in the backend directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Update `.env` with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=ecommerce
   JWT_SECRET=generate-a-secure-random-string-here-minimum-32-characters
   ```

3. Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 9. Install Dependencies

```bash
cd backend
npm install
```

### 10. Test Backend

```bash
# Development (using Vercel Dev)
npm run dev

# The API will be available at http://localhost:3000
```

### 11. Deploy to Vercel

```bash
cd backend
vercel

# Configure environment variables in Vercel dashboard:
# - MONGODB_URI
# - MONGODB_DB
# - JWT_SECRET
# - FRONTEND_URL
# - ADMIN_URL
# - NODE_ENV=production
```

---

## 🔗 API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Products
- `GET /products` - List products (with filters)
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Categories
- `GET /categories` - List categories
- `GET /categories/:id` - Get single category
- `POST /categories` - Create category (admin)
- `PUT /categories/:id` - Update category (admin)
- `DELETE /categories/:id` - Delete category (admin)

### Wishlists
- `GET /wishlists` - Get user's wishlist
- `POST /wishlists` - Add to wishlist
- `DELETE /wishlists/:product_id` - Remove from wishlist

### Settings
- `GET /settings` - Get all settings
- `GET /settings/:key` - Get specific setting
- `PUT /settings` - Update settings (admin)

---

## 🔐 Security Notes

- Passwords are hashed using bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days (configurable)
- Admin endpoints require JWT with admin/superadmin role
- CORS is configured for frontend and admin panel origins
- All sensitive data is in environment variables

---

## 📝 Next Steps

1. ✅ Backend migration complete
2. ⏳ Update Frontend to use REST API instead of Supabase
3. ⏳ Update Admin Panel to use REST API instead of Supabase
4. ⏳ Test all functionality end-to-end
5. ⏳ Deploy to production

---

## 🆘 Troubleshooting

### Error: "MONGODB_URI is not defined"
- Make sure `.env` file exists in backend directory
- Check that `MONGODB_URI` is set correctly

### Error: "Authentication failed"
- Generate a strong JWT_SECRET and update `.env`
- Clear browser localStorage and login again

### Error: "Connection timeout"
- Check MongoDB Atlas Network Access settings
- Ensure your IP is whitelisted

### Error: "Cannot find module"
- Run `npm install` in backend directory
- Make sure all dependencies are installed
