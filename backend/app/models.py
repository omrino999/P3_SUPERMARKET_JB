from datetime import datetime
import uuid
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    
    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade="all, delete-orphan")
    purchases = db.relationship('Purchase', backref='user', lazy=True)

    def set_password(self, password):
        from passlib.hash import pbkdf2_sha256
        self.password_hash = pbkdf2_sha256.hash(password)

    def check_password(self, password):
        from passlib.hash import pbkdf2_sha256
        try:
            return pbkdf2_sha256.verify(password, self.password_hash)
        except:
            return False

    def __repr__(self):
        return f'<User {self.email}>'

class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    
    products = db.relationship('Product', backref='department', lazy=True)

    def __repr__(self):
        return f'<Department {self.name}>'

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False, index=True)

    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    purchase_items = db.relationship('PurchaseItem', backref='product', lazy=True)

    def __repr__(self):
        return f'<Product {self.name}>'

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    quantity = db.Column(db.Integer, default=1, nullable=False)

    def __repr__(self):
        return f'<CartItem user:{self.user_id} prod:{self.product_id} qty:{self.quantity}>'

class Purchase(db.Model):
    __tablename__ = 'purchases'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    unique_code = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    total_price = db.Column(db.Float, nullable=False)

    items = db.relationship('PurchaseItem', backref='purchase', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Purchase {self.unique_code} total:{self.total_price}>'

class PurchaseItem(db.Model):
    __tablename__ = 'purchase_items'
    id = db.Column(db.Integer, primary_key=True)
    purchase_id = db.Column(db.Integer, db.ForeignKey('purchases.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_purchase = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<PurchaseItem purchase:{self.purchase_id} prod:{self.product_id}>'
