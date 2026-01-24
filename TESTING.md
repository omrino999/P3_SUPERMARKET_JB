# Testing Checklist - Supermarket CRUD Project

## Pre-Testing Setup
- [ ] Backend running on `http://127.0.0.1:5000`
- [ ] Frontend running on `http://localhost:5173` (or 5174)
- [ ] Database seeded with admin user and sample data

---

## 1. Guest User Flow (No Login Required)

### Browsing
- [ ] Can view home page with hero section
- [ ] Can see all departments listed
- [ ] Can click department to filter products
- [ ] Can use "Show All" to reset filter
- [ ] Can use search bar to find products
- [ ] "Start Shopping" button scrolls to products section

### Cart Restriction
- [ ] Clicking "+" on product shows login prompt (alert)
- [ ] Cannot access `/cart` route (redirects to login)
- [ ] Cannot access `/checkout` route (redirects to login)
- [ ] Cannot access `/profile` route (redirects to login)
- [ ] Cannot access `/admin` route (redirects to login)

---

## 2. User Registration & Authentication

### Registration (`/register`)
- [ ] Form displays correctly with all fields
- [ ] Cannot submit with empty fields
- [ ] Cannot submit with mismatched passwords
- [ ] Cannot register with existing email (shows error)
- [ ] Successful registration redirects to login page

### Login (`/login`)
- [ ] Form displays correctly
- [ ] Cannot submit with empty fields
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to home page
- [ ] Navbar updates to show user options (Account, Logout, Cart)
- [ ] Token stored in localStorage

### Logout
- [ ] Clicking logout clears session
- [ ] Navbar reverts to guest state (Login, Join)
- [ ] Token removed from localStorage
- [ ] Protected routes become inaccessible

---

## 3. Shopping Cart (Logged-in User)

### Adding Items
- [ ] Clicking "+" adds item to cart
- [ ] Cart count in navbar updates immediately
- [ ] Adding same item again increases quantity
- [ ] Cart hover preview shows added items

### Cart Page (`/cart`)
- [ ] All cart items display correctly
- [ ] Item image, name, price, quantity shown
- [ ] Can increase quantity with "+"
- [ ] Can decrease quantity with "-" (minimum 1)
- [ ] Can remove item with trash icon
- [ ] Subtotals calculate correctly
- [ ] Total updates when quantities change
- [ ] Cart count in navbar updates on changes

### Cart Persistence
- [ ] Cart items persist after page refresh
- [ ] Cart items persist after logout/login

---

## 4. Checkout Flow

### Checkout Page (`/checkout`)
- [ ] Redirects to cart if cart is empty
- [ ] Shows all items with quantities and prices
- [ ] Shows delivery details section
- [ ] Shows payment method section
- [ ] Total matches cart total

### Purchase Completion
- [ ] "Confirm & Place Order" creates purchase
- [ ] Success screen shows order confirmation
- [ ] Unique order code displayed
- [ ] Total paid amount shown
- [ ] Cart is emptied after purchase
- [ ] Cart count resets to 0
- [ ] "View History" link works
- [ ] "Continue Shopping" link works

---

## 5. Purchase History (`/profile`)

- [ ] Page loads for logged-in users
- [ ] Shows user's email
- [ ] Lists all past purchases
- [ ] Each order shows: date, order code, total
- [ ] Clicking order expands to show items
- [ ] Items show: quantity, name, price at purchase
- [ ] Empty state shown if no purchases

---

## 6. Admin Panel (`/admin`)

### Access Control
- [ ] Regular users cannot access (redirects away)
- [ ] Admin users can access
- [ ] "Admin Panel" button visible in navbar for admins

### Products Tab
- [ ] All products listed in table
- [ ] Shows: name, price, department
- [ ] "Add New" opens modal
- [ ] Can create new product (name, price, department, image URL)
- [ ] Edit icon opens modal with existing data
- [ ] Can update product details
- [ ] Delete icon removes product (with confirmation)

### Departments Tab
- [ ] All departments listed
- [ ] "Add New" opens modal
- [ ] Can create new department
- [ ] Can edit department name
- [ ] Can delete department (if no products linked?)

### Tab Switching
- [ ] Switching between tabs works without crash
- [ ] Data loads correctly for each tab

---

## 7. UI/UX Checks

### Dark Mode
- [ ] Toggle button switches themes
- [ ] All pages render correctly in dark mode
- [ ] Text is readable on all pages
- [ ] Forms have proper contrast
- [ ] Theme persists after page refresh

### Responsive Design
- [ ] Home page works on mobile
- [ ] Navbar collapses appropriately
- [ ] Product grid adjusts to screen size
- [ ] Cart page readable on mobile
- [ ] Admin panel usable on tablet+

### Loading States
- [ ] Products show skeleton/loading state
- [ ] Cart shows loading while fetching
- [ ] Buttons show loading state during actions

### Error Handling
- [ ] API errors show user-friendly messages
- [ ] Network errors handled gracefully
- [ ] 404 page shown for invalid routes

---

## 8. Edge Cases

- [ ] Very long product names display correctly (truncated)
- [ ] Products with no image show placeholder
- [ ] Empty search results show appropriate message
- [ ] Cart with 10+ items displays correctly
- [ ] Order with many items shows in history correctly

---

## 9. Console & Network

- [ ] No JavaScript errors in browser console
- [ ] No failed network requests (red in Network tab)
- [ ] No backend errors in terminal
- [ ] API responses are correct format

---

## Test Credentials

**Admin User:**
- Email: `admin@test.com`
- Password: `admin123`

**Test User:** (create one during testing)
- Email: `test@test.com`
- Password: `test123`

---

## Notes & Issues Found

| Issue | Page | Severity | Status |
|-------|------|----------|--------|
| Example: Cart hover clips on mobile | Navbar | Low | Pending |
| | | | |

