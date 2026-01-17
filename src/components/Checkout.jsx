// frontend/src/components/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Checkout({ userId, cart }) {
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!shippingAddress.trim()) {
            alert('Please enter shipping address');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiUrl}/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    shippingAddress,
                    paymentMethod
                })
            });
            const data = await response.json();
            
            if (data.success) {
                setOrderDetails(data.order);
                setOrderComplete(true);
            } else {
                alert(data.error || 'Checkout failed');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete && orderDetails) {
        return (
            <div className="order-complete">
                <h2>🎉 Order Successful!</h2>
                <div className="order-details">
                    <p><strong>Order Number:</strong> #{orderDetails.orderNumber}</p>
                    <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                    <p><strong>Total Amount:</strong> ${orderDetails.totalAmount.toFixed(2)}</p>
                    {orderDetails.discountCode && (
                        <p><strong>Discount Applied:</strong> {orderDetails.discountCode}</p>
                    )}
                    <p><strong>Shipping Address:</strong> {orderDetails.shippingAddress}</p>
                    <p><strong>Status:</strong> {orderDetails.status}</p>
                    
                    {orderDetails.discountCodeGenerated && (
                        <div className="discount-generated">
                            <h3>🎁 Congratulations!</h3>
                            <p>You've received a 10% discount code for your next purchase:</p>
                            <div className="discount-code">
                                {orderDetails.discountCodeGenerated}
                            </div>
                            <p>This code can be used once for your next order.</p>
                        </div>
                    )}
                </div>
                <div className="order-actions">
                    <button onClick={() => navigate('/orders')}>
                        View Order History
                    </button>
                    <button onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            
            <div className="checkout-summary">
                <h3>Order Summary</h3>
                <div className="summary-items">
                    {cart.items.map(item => (
                        <div key={item.productId} className="summary-item">
                            <span>{item.name} x {item.quantity}</span>
                            <span>${item.itemTotal.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="summary-total">
                    <span>Total:</span>
                    <span>${cart.total?.toFixed(2) || '0.00'}</span>
                </div>
            </div>

            <div className="checkout-form">
                <div className="form-group">
                    <label htmlFor="shippingAddress">Shipping Address</label>
                    <textarea
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter your complete shipping address"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                </div>

                <button 
                    className="place-order-btn"
                    onClick={handleCheckout}
                    disabled={loading || cart.items.length === 0}
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>

                <button 
                    className="back-to-cart"
                    onClick={() => navigate('/cart')}
                >
                    Back to Cart
                </button>
            </div>
        </div>
    );
}

export default Checkout;