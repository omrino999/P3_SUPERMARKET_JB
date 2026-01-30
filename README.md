# 🛒 Omri's Market - Full Stack CRUD Application

A modern full-stack supermarket web application built with Flask and React. Users can browse products, manage shopping carts, and complete purchases. Administrators can manage inventory through a dedicated admin panel.

**Created by Omri Shitrit for John Bryce Academy**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Default Credentials](#-default-credentials)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)

---

## ✨ Features

### Guest Users
- Browse all products and departments
- Search products by name
- Filter products by department
- View product details and prices

### Registered Users
- Create account and login
- Add products to shopping cart
- Manage cart (update quantities, remove items)
- Complete checkout with unique order code
- View purchase history with full details
- Dark/Light theme toggle

### Admin Users
- Full CRUD operations for Products
- Full CRUD operations for Departments
- Protected admin panel access

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.x | Programming Language |
| Flask | Web Framework |
| SQLAlchemy | ORM |
| Flask-JWT-Extended | Authentication |
| Flask-CORS | Cross-Origin Requests |
| SQLite | Database |
| Passlib + Bcrypt | Password Hashing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| React Router | Navigation |
| Axios | HTTP Client |
| Lucide React | Icons |

---

## 📁 Project Structure

```
omri-project3/
├── backend/
│   ├── app/
│   │   ├── __init__.py      # App factory
│   │   ├── extensions.py    # Flask extensions
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── utils.py         # Helper functions
│   │   └── routes/
│   │       ├── main.py      # Public routes
│   │       ├── auth.py      # Authentication
│   │       ├── admin.py     # Admin CRUD
│   │       ├── cart.py      # Cart operations
│   │       └── orders.py    # Checkout & history
│   ├── config.py            # Configuration
│   ├── run.py               # Entry point
│   ├── seed.py              # Database seeder
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── Dockerfile           # Frontend container
│   └── vite.config.js
│
├── docker-compose.yml       # Run all services
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Create and activate virtual environment:**
   ```bash
   cd omri-project3
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Create environment file (required for config & secrets):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed. For local dev the defaults are fine; see [Environment variables](#environment-variables) below.

4. **Initialize database and seed data (REQUIRED):**
   ```bash
   python seed.py
   ```
   > ⚠️ **Important:** This creates the database tables, admin user, departments, and sample products with placeholder image URLs (Unsplash). You must run this before starting the server!
   >
   > **Admin login:** `admin@test.com` / `admin123`

5. **Run the server:**
   ```bash
   python run.py
   ```
   Backend will be available at `http://127.0.0.1:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### Docker Setup (Alternative)

Run the entire application with one command:

```bash
docker-compose up --build
```

This will start:
- Backend at `http://localhost:5000`
- Frontend at `http://localhost:5173`

---

## 📡 API Endpoints

### Public Routes
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
| POST | `/auth/login` | Login (returns JWT) |
| GET | `/auth/me` | Get current user info |

### Cart (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add item to cart |
| PUT | `/cart/<id>` | Update item quantity |
| DELETE | `/cart/<id>` | Remove item |
| DELETE | `/cart` | Clear entire cart |

### Orders (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/checkout` | Complete purchase |
| GET | `/orders` | Get purchase history |
| GET | `/orders/<code>` | Get order details |

### Admin (Requires Admin Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/departments` | Create department |
| PUT | `/admin/departments/<id>` | Update department |
| DELETE | `/admin/departments/<id>` | Delete department |
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/<id>` | Update product |
| DELETE | `/admin/products/<id>` | Delete product |

---

## 🔐 Default Credentials

### Admin Account
```
Email: admin@test.com
Password: admin123
```

---

## 🔧 Environment Variables

The backend uses a `.env` file (never committed; see `.env.example`). Copy `.env.example` to `.env` and adjust if needed.

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Flask signing key (sessions, flash messages). Must be secret in production. |
| `JWT_SECRET_KEY` | Key used to sign/verify login tokens. If leaked, someone could forge JWTs. |
| `DATABASE_URL` | Database connection (e.g. `sqlite:///supermarket.db`). For production, use a strong DB password here. |
| `FLASK_APP`, `FLASK_DEBUG` | How Flask runs; `FLASK_HOST` optional (e.g. `0.0.0.0` for Docker). |

Use different values per environment (dev vs production) and keep `.env` out of version control.

---

## 🗄 Database Schema

### User
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| email | String | Unique email |
| password_hash | String | Hashed password |
| is_admin | Boolean | Admin flag |

### Department
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| name | String | Department name |

### Product
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| name | String | Product name |
| price | Float | Current price |
| image_url | String | Product image |
| department_id | Integer | FK to Department |

### CartItem
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| user_id | Integer | FK to User |
| product_id | Integer | FK to Product |
| quantity | Integer | Item quantity |

### Purchase
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| user_id | Integer | FK to User |
| unique_code | String | Order code (UUID) |
| total_price | Float | Order total |
| created_at | DateTime | Purchase time |

### PurchaseItem
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary Key |
| purchase_id | Integer | FK to Purchase |
| product_id | Integer | FK to Product |
| quantity | Integer | Quantity purchased |
| price_at_purchase | Float | Price snapshot |

---

## 📝 License

This project was created for educational purposes as part of a Full Stack Development course at John Bryce Academy.

---

## 👤 Author

Omri Shitrit | omri.shitrit@yahoo.com
