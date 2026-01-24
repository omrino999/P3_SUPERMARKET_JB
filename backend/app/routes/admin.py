from flask import Blueprint, request, jsonify
from app.models import Product, Department
from app.extensions import db
from app.utils import admin_required
from flask_jwt_extended import jwt_required

bp = Blueprint('admin', __name__, url_prefix='/admin')

# --- Department CRUD ---

@bp.route('/departments', methods=['POST'])
@admin_required()
def create_department():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify(message="Name is required"), 400
    
    if Department.query.filter_by(name=data['name']).first():
        return jsonify(message="Department already exists"), 400
        
    dept = Department(name=data['name'])
    db.session.add(dept)
    db.session.commit()
    return jsonify(id=dept.id, name=dept.name), 201

@bp.route('/departments/<int:id>', methods=['PUT'])
@admin_required()
def update_department(id):
    dept = Department.query.get_or_404(id)
    data = request.get_json()
    if data.get('name'):
        dept.name = data['name']
        db.session.commit()
    return jsonify(id=dept.id, name=dept.name)

@bp.route('/departments/<int:id>', methods=['DELETE'])
@admin_required()
def delete_department(id):
    dept = Department.query.get_or_404(id)
    # Check if department has products
    if dept.products:
        return jsonify(message="Cannot delete department with products"), 400
    db.session.delete(dept)
    db.session.commit()
    return '', 204

# --- Product CRUD ---

@bp.route('/products', methods=['POST'])
@admin_required()
def create_product():
    data = request.get_json()
    required = ['name', 'price', 'department_id']
    if not data or not all(k in data for k in required):
        return jsonify(message="Missing required fields"), 400
    
    product = Product(
        name=data['name'],
        price=data['price'],
        department_id=data['department_id'],
        image_url=data.get('image_url')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(id=product.id, name=product.name), 201

@bp.route('/products/<int:id>', methods=['PUT'])
@admin_required()
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data: product.name = data['name']
    if 'price' in data: product.price = data['price']
    if 'department_id' in data: product.department_id = data['department_id']
    if 'image_url' in data: product.image_url = data['image_url']
    
    db.session.commit()
    return jsonify(id=product.id, name=product.name)

@bp.route('/products/<int:id>', methods=['DELETE'])
@admin_required()
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return '', 204
