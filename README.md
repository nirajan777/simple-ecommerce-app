# Simple E-Commerce App

A lightweight, full-stack e-commerce application for small businesses. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

✨ **Product Management**
- Add products with images, prices, and features
- Manage product inventory/stock
- Categorize products

🛒 **Shopping Cart**
- Add/remove products from cart
- Update quantities
- Real-time cart total calculation

📦 **Orders**
- Place orders with customer information
- Automatic stock management
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Order history

👨‍💼 **Admin Panel**
- Add new products with image upload
- Manage existing products
- View and manage all orders
- Update order status

💳 **Payment Options**
- Cash on Delivery
- Credit Card
- Online Banking

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB
- Multer (for image uploads)

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd simple-ecommerce-app
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Configure your MongoDB connection in `.env`
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
```

5. Start the server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

6. Open your browser and navigate to
```
http://localhost:5000
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Cart
- `GET /api/cart/:userId` - Get cart
- `POST /api/cart/:userId/add` - Add to cart
- `POST /api/cart/:userId/remove/:productId` - Remove from cart
- `PUT /api/cart/:userId/update/:productId` - Update quantity
- `POST /api/cart/:userId/clear` - Clear cart

## Usage

### For Customers
1. Browse products on the Shop page
2. Add products to cart with desired quantity
3. View cart and proceed to checkout
4. Enter shipping and payment information
5. Place order
6. Track order status in Orders page

### For Admin
1. Go to Admin Panel
2. Add New Products - upload image, set price, features, and stock
3. Manage Products - edit or delete existing products
4. Manage Orders - view all orders and update their status

## Project Structure

```
.
├── models/              # Database models
│   ├── Product.js
│   └── Order.js
├── routes/              # API routes
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── cartRoutes.js
├── public/              # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── uploads/             # Product images (auto-created)
├── server.js            # Express app configuration
├── package.json
└── .env.example
```

## Notes

- Cart is stored in-memory. For production, consider using sessions or database
- Image uploads are limited to 5MB
- Images are stored in the `uploads/` directory
- Order numbers are auto-generated with timestamp and UUID
- Stock is automatically deducted when order is placed
- Stock is restored if order is cancelled

## Future Enhancements

- User authentication and registration
- Persistent sessions for cart
- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Search and filtering
- Product variants (size, color, etc.)
- Wishlist functionality
- Admin dashboard analytics

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
