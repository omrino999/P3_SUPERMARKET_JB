from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
from app.models import CartItem, Product
from app.extensions import db

bp = Blueprint('cart', __name__, url_prefix='/cart')

@bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    # Use joinedload to fetch products in ONE query (fixes N+1 problem)
    items = CartItem.query.filter_by(user_id=user_id).options(joinedload(CartItem.product)).all()
    
    return jsonify([{
        "id": item.id,
        "product_id": item.product_id,
        "product_name": item.product.name,
        "price": item.product.price,
        "image_url": item.product.image_url,
        "quantity": item.quantity,
        "subtotal": item.product.price * item.quantity
    } for item in items])

@bp.route('', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify(message="product_id is required"), 400
    
    product = Product.query.get_or_404(product_id)
    
    item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(item)
    
    db.session.commit()
    return jsonify(message="Item added to cart"), 201

@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_cart_item(id):
    user_id = get_jwt_identity()
    item = CartItem.query.get_or_404(id)
    
    if str(item.user_id) != str(user_id):
        return jsonify(message="Unauthorized"), 403
    
    data = request.get_json()
    quantity = data.get('quantity')
    
    if quantity is not None:
        if quantity <= 0:
            db.session.delete(item)
        else:
            item.quantity = quantity
        db.session.commit()
        
    return jsonify(message="Cart updated")

@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(id):
    user_id = get_jwt_identity()
    item = CartItem.query.get_or_404(id)
    
    if str(item.user_id) != str(user_id):
        return jsonify(message="Unauthorized"), 403
        
    db.session.delete(item)
    db.session.commit()
    return '', 204

@bp.route('', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return '', 204
