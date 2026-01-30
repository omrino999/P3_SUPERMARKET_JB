from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
from app.models import CartItem, Purchase, PurchaseItem
from app.extensions import db

bp = Blueprint('orders', __name__, url_prefix='/orders')

@bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    # Eager load products to avoid N+1
    cart_items = CartItem.query.filter_by(user_id=user_id).options(joinedload(CartItem.product)).all()
    
    if not cart_items:
        return jsonify(message="Cart is empty"), 400
    
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    
    # Create Purchase
    purchase = Purchase(
        user_id=user_id,
        total_price=total_price
    )
    db.session.add(purchase)
    db.session.flush() # To get the purchase.id
    
    # Create PurchaseItems (Snapshots)
    for cart_item in cart_items:
        purchase_item = PurchaseItem(
            purchase_id=purchase.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price_at_purchase=cart_item.product.price
        )
        db.session.add(purchase_item)
        db.session.delete(cart_item) # Clear cart as we go
        
    db.session.commit()
    
    return jsonify({
        "message": "Checkout successful",
        "order_code": purchase.unique_code,
        "total_price": purchase.total_price
    }), 201

@bp.route('', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    # Eager load items to avoid N+1 when counting
    purchases = Purchase.query.filter_by(user_id=user_id).options(joinedload(Purchase.items)).order_by(Purchase.timestamp.desc()).all()
    
    return jsonify([{
        "id": p.id,
        "timestamp": p.timestamp.isoformat(),
        "unique_code": p.unique_code,
        "total_price": p.total_price,
        "item_count": len(p.items)
    } for p in purchases])

@bp.route('/<string:code>', methods=['GET'])
@jwt_required()
def get_order_details(code):
    user_id = get_jwt_identity()
    # Eager load items and their products
    purchase = Purchase.query.filter_by(unique_code=code).options(
        joinedload(Purchase.items).joinedload(PurchaseItem.product)
    ).first_or_404()
    
    if str(purchase.user_id) != str(user_id):
        return jsonify(message="Unauthorized"), 403
        
    return jsonify({
        "id": purchase.id,
        "timestamp": purchase.timestamp.isoformat(),
        "unique_code": purchase.unique_code,
        "total_price": purchase.total_price,
        "items": [{
            "product_name": item.product.name,
            "quantity": item.quantity,
            "price_at_purchase": item.price_at_purchase,
            "subtotal": item.price_at_purchase * item.quantity
        } for item in purchase.items]
    })
