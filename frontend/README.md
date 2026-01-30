# Frontend - React Application

A modern React frontend for the Omri's Market supermarket application.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation with cart preview
│   │   ├── Footer.jsx        # Site footer
│   │   └── ProtectedRoute.jsx # Auth route wrapper
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication state
│   │   ├── CartContext.jsx   # Cart state & count
│   │   └── ThemeContext.jsx  # Dark/light mode
│   ├── pages/
│   │   ├── Home.jsx          # Product listing & search
│   │   ├── Login.jsx         # User login
│   │   ├── Register.jsx      # User registration
│   │   ├── Cart.jsx          # Shopping cart
│   │   ├── Checkout.jsx      # Order completion
│   │   ├── Profile.jsx       # Purchase history
│   │   ├── AdminPanel.jsx    # Admin CRUD interface
│   │   └── NotFound.jsx      # 404 page
│   ├── services/
│   │   └── api.js            # Axios API configuration
│   ├── App.jsx               # Root component & routes
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles & Tailwind
├── package.json
├── vite.config.js
└── postcss.config.js
```

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

App runs at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Features

### Guest Users
- Browse products and departments
- Search products by name
- Filter by department (toggle buttons)
- View product details

### Registered Users
- Add products to cart
- Manage cart (update quantities, remove items)
- Checkout with unique order code
- View purchase history
- Dark/light theme toggle

### Admin Users
- Full CRUD for products
- Full CRUD for departments
- Protected admin panel

## Components

### Navbar
- Responsive navigation
- Cart icon with live item count
- Hover preview of cart contents
- Dark mode toggle
- Admin panel link (for admins)

### Context Providers
- **AuthContext** - JWT token management, user state
- **CartContext** - Cart count, refresh functionality
- **ThemeContext** - Dark/light mode persistence

## API Configuration

The frontend connects to the backend at `http://127.0.0.1:5000` by default.

To change this, edit `src/services/api.js`:

```javascript
const API = axios.create({
  baseURL: 'http://127.0.0.1:5000'
});
```

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready for static hosting.

---

**Author:** Omri Shitrit | John Bryce Academy
