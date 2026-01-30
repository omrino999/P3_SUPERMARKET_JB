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

        # 3. Create Sample Products (real images via Unsplash)
        sample_products = [
            ('Milk', 4.99, 'Dairy', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'),
            ('Cheese', 7.50, 'Dairy', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop'),
            ('Yogurt', 3.20, 'Dairy', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop'),
            ('Beef Steak', 15.99, 'Meats', 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop'),
            ('Chicken Breast', 9.50, 'Meats', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop'),
            ('Apple', 0.99, 'Fruits & Vegs', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'),
            ('Banana', 0.50, 'Fruits & Vegs', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'),
            ('Tomato', 1.20, 'Fruits & Vegs', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop'),
            ('Bread', 2.99, 'Bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'),
            ('Croissant', 1.50, 'Bakery', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop'),
            ('Ice Cream', 5.99, 'Frozen Foods', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop'),
            ('Frozen Pizza', 6.50, 'Frozen Foods', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'),
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
