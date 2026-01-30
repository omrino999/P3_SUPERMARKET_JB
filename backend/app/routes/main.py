from flask import Blueprint, jsonify, request
from app.models import Department, Product

bp = Blueprint('main', __name__)

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Supermarket API is running"
    }), 200

@bp.route('/departments', methods=['GET'])
def get_departments():
    depts = Department.query.all()
    return jsonify([{"id": d.id, "name": d.name} for d in depts])

@bp.route('/products', methods=['GET'])
def get_products():
    dept_id = request.args.get('department_id', type=int)
    if dept_id:
        products = Product.query.filter_by(department_id=dept_id).all()
    else:
        products = Product.query.all()
    
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "image_url": p.image_url,
        "department_id": p.department_id
    } for p in products])

@bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    p = Product.query.get_or_404(id)
    return jsonify({
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "image_url": p.image_url,
        "department_id": p.department_id
    })
