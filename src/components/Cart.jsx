// frontend/src/components/Cart.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Cart({ cart, userId, fetchCart }) {
    const [discountCode, setDiscountCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const response = await fetch(`${config.apiUrl}/cart/${userId}/item`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: newQuantity })
            });
            const data = await response.json();
            if (data.success) {
                fetchCart();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const applyDiscount = async () => {
        if (!discountCode.trim()) {
            setMessage('Please enter a discount code');
            return;
        }

        try {
            const response = await fetch(`${config.apiUrl}/cart/${userId}/apply-discount`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode })
            });
            const data = await response.json();
            if (data.success) {
                setMessage('Discount applied successfully!');
                fetchCart();
                setDiscountCode('');
            } else {
                setMessage(data.error || 'Failed to apply discount');
            }
        } catch (error) {
            setMessage('Error applying discount');
            console.error('Error applying discount:', error);
        }
    };

    const removeDiscount = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/cart/${userId}/discount`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setMessage('Discount removed');
                fetchCart();
            }
        } catch (error) {
            console.error('Error removing discount:', error);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your Cart is Empty</h2>
                <p>Add some products to get started!</p>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            
            <div className="cart-items">
                {cart.items.map(item => (
                    <div key={item.productId} className="cart-item">
                        <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>Price: ${item.price.toFixed(2)}</p>
                        </div>
                        <div className="item-quantity">
                            <button 
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <div className="item-total">
                            ${item.itemTotal.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                
                {cart.discountCode && (
                    <>
                        <div className="summary-row discount">
                            <span>Discount ({cart.discountCode}):</span>
                            <span>-${cart.discountAmount?.toFixed(2) || '0.00'}</span>
                        </div>
                        <button 
                            className="remove-discount-btn"
                            onClick={removeDiscount}
                        >
                            Remove Discount
                        </button>
                    </>
                )}

                <div className="summary-row total">
                    <span>Total:</span>
                    <span>${cart.total?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="discount-section">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter discount code"
                        disabled={!!cart.discountCode}
                    />
                    <button 
                        onClick={applyDiscount}
                        disabled={!!cart.discountCode}
                    >
                        Apply Discount
                    </button>
                </div>

                {message && <div className="message">{message}</div>}

                <button 
                    className="checkout-btn"
                    onClick={() => navigate('/checkout')}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}

export default Cart;