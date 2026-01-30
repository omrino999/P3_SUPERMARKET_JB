from app import create_app
from app.extensions import db
from app.models import User, Department, Product

def seed_data():
    app = create_app()
    with app.app_context():
        # Create all tables (if they don't exist)
        db.create_all()
        print("Database tables created/verified.")
        
        # 1. Create Admin
        admin = User.query.filter_by(email='admin@test.com').first()
        if not admin:
            admin = User(email='admin@test.com', is_admin=True)
            admin.set_password('admin123')
            db.session.add(admin)
            print("Admin user created: admin@test.com / admin123")
        else:
            print("Admin user already exists.")

        # 2. Create Departments
        dept_names = ['Dairy', 'Meats', 'Fruits & Vegs', 'Bakery', 'Frozen Foods']
        depts = {}
        for name in dept_names:
            dept = Department.query.filter_by(name=name).first()
            if not dept:
                dept = Department(name=name)
                db.session.add(dept)
                print(f"Department created: {name}")
            depts[name] = dept
        
        db.session.commit() # Commit to get IDs

        # 3. Create Sample Products
        sample_products = [
            ('Milk', 4.99, 'Dairy', 'https://placehold.co/400x400?text=Milk'),
            ('Cheese', 7.50, 'Dairy', 'https://placehold.co/400x400?text=Cheese'),
            ('Yogurt', 3.20, 'Dairy', 'https://placehold.co/400x400?text=Yogurt'),
            ('Beef Steak', 15.99, 'Meats', 'https://placehold.co/400x400?text=Beef+Steak'),
            ('Chicken Breast', 9.50, 'Meats', 'https://placehold.co/400x400?text=Chicken+Breast'),
            ('Apple', 0.99, 'Fruits & Vegs', 'https://placehold.co/400x400?text=Apple'),
            ('Banana', 0.50, 'Fruits & Vegs', 'https://placehold.co/400x400?text=Banana'),
            ('Tomato', 1.20, 'Fruits & Vegs', 'https://placehold.co/400x400?text=Tomato'),
            ('Bread', 2.99, 'Bakery', 'https://placehold.co/400x400?text=Bread'),
            ('Croissant', 1.50, 'Bakery', 'https://placehold.co/400x400?text=Croissant'),
        ]

        for name, price, dept_name, img in sample_products:
            prod = Product.query.filter_by(name=name).first()
            if not prod:
                prod = Product(
                    name=name, 
                    price=price, 
                    department_id=depts[dept_name].id,
                    image_url=img
                )
                db.session.add(prod)
                print(f"Product created: {name}")

        db.session.commit()
        print("Seeding completed successfully!")

if __name__ == '__main__':
    seed_data()
