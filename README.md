
# E-commerce API

A RESTful API built with Node.js for an e-commerce platform, providing endpoints for product management, user authentication, and order processing.

## Features

- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing
- Category management
- User profile management

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Mongoose ODM
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/FahdAzmy/E-commerce-api.git
cd E-commerce-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## Error Handling

The API uses standard HTTP status codes for error handling:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Features

- JWT-based authentication
- Password hashing
- Protected routes
- Role-based access control

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Fahd Azmy - [GitHub](https://github.com/FahdAzmy)

Project Link: [https://github.com/FahdAzmy/E-commerce-api](https://github.com/FahdAzmy/E-commerce-api)
