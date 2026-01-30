# Backend - Flask REST API

A RESTful API for the Omri's Market supermarket application built with Flask.

## Tech Stack

- **Flask** - Web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - JWT authentication
- **SQLite** - Database
- **Passlib + Bcrypt** - Password hashing

## Project Structure

```
backend/
├── app/
│   ├── __init__.py       # App factory
│   ├── extensions.py     # Flask extensions (db, jwt)
│   ├── models.py         # Database models
│   ├── utils.py          # Helper functions
│   └── routes/
│       ├── main.py       # Public routes (products, departments)
│       ├── auth.py       # Authentication (login, register)
│       ├── admin.py      # Admin CRUD operations
│       ├── cart.py       # Shopping cart
│       └── orders.py     # Checkout & order history
├── config.py             # Configuration
├── run.py                # Entry point
├── seed.py               # Database seeder
└── requirements.txt      # Dependencies
```

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database with admin user and sample data
python seed.py

# Run the server
python run.py
```

Server runs at `http://127.0.0.1:5000`

## Default Admin Credentials

```
Email: admin@test.com
Password: admin123
```

## API Endpoints

### Public (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/departments` | List all departments |
| GET | `/products` | List all products |
| GET | `/products?department_id=1` | Filter by department |
| GET | `/products/<id>` | Get single product |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT token) |
| GET | `/auth/me` | Get current user info |

### Cart (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add item to cart |
| PUT | `/cart/<id>` | Update item quantity |
| DELETE | `/cart/<id>` | Remove item from cart |
| DELETE | `/cart` | Clear entire cart |

### Orders (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/checkout` | Complete purchase |
| GET | `/orders` | Get purchase history |
| GET | `/orders/<code>` | Get order by unique code |

### Admin (Requires Admin JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/departments` | Create department |
| PUT | `/admin/departments/<id>` | Update department |
| DELETE | `/admin/departments/<id>` | Delete department |
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/<id>` | Update product |
| DELETE | `/admin/products/<id>` | Delete product |

## Database Models

### User
- `id`, `email`, `password_hash`, `is_admin`

### Department
- `id`, `name`

### Product
- `id`, `name`, `price`, `image_url`, `department_id`

### CartItem
- `id`, `user_id`, `product_id`, `quantity`

### Purchase
- `id`, `user_id`, `unique_code`, `total_price`, `created_at`

### PurchaseItem
- `id`, `purchase_id`, `product_id`, `quantity`, `price_at_purchase`

## Environment Variables (Optional)

Create a `.env` file (defaults work out of the box):

```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///supermarket.db
JWT_SECRET_KEY=your-jwt-key
```

---

**Author:** Omri Shitrit | John Bryce Academy
