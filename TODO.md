# Supermarket CRUD Project Roadmap

## 🛒 Project Overview
A full-stack supermarket application where guests can browse, users can shop, and admins can manage inventory.

## 🛠 Tech Stack ✅
- **Backend:** Python + Flask (Factory Pattern)
- **Database:** SQLite + SQLAlchemy + Flask-Migrate
- **Auth:** JWT (Flask-JWT-Extended) + Passlib/Bcrypt
- **Frontend:** React (Vite) + Tailwind CSS + Axios
- **Icons:** Lucide-React

## 🗄 Database Schema ✅
Implemented with SQLAlchemy models and migrations.

---

## 🚀 Development Phases

### Phase 1: Backend (Flask) ✅
- [x] **1. Setup**: Flask factory, CORS, Config, Extensions.
- [x] **2. Models**: Define all SQLAlchemy classes & relationships.
- [x] **3. Auth**: Register/Login endpoints with JWT.
- [x] **4. Seed**: Script to create Admin user and initial Departments.
- [x] **5. Admin CRUD**: Protected routes for Products/Departments.
- [x] **6. Public API**: List Departments, List Products by Dept.
- [x] **7. Cart**: Add/Remove/Update items (DB-stored per user).
- [x] **8. Checkout**: Logic to convert Cart -> Purchase + Snapshot prices.
- [x] **9. History**: Fetch past purchases for the logged-in user.

### Phase 2: Frontend (React) ✅
- [x] **1. Init**: Vite + Tailwind + React Router setup.
- [x] **2. UI Shell**: Navbar (Login/Logout/Cart toggle) & Layout.
- [x] **3. Auth Flow**: Login/Register forms + localStorage Token handling.
- [x] **4. Storefront**: Department list & Product cards.
- [x] **5. Shopping Cart**: UI and quantity management.
- [x] **6. Checkout**: Summary page & "Confirm Purchase" action.
- [x] **7. Profile**: Purchase history list with expandable details.
- [x] **8. Admin Panel**: Tables to Create/Edit/Delete products.

---

## 📝 Ground Rules ✅
1. **One feature at a time.** Completed.
2. **Snapshot logic.** Implemented in Backend.
3. **Validation.** Implemented in Backend and Frontend.
