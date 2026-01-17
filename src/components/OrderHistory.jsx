// frontend/src/components/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function OrderHistory({ userId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [userId]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/orders/${userId}`);
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    if (loading) return <div className="loading">Loading order history...</div>;

    if (orders.length === 0) {
        return (
            <div className="empty-orders">
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="order-history">
            <h2>Your Orders</h2>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.orderId} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>Order #{order.orderNumber}</h3>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="order-status">
                                <span className={`status-badge ${order.status}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="order-items">
                            <h4>Items:</h4>
                            <ul>
                                {order.items.map(item => (
                                    <li key={`${order.orderId}-${item.productId}`}>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-quantity">x {item.quantity}</span>
                                        <span className="item-price">${item.price.toFixed(2)} each</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="order-summary">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>${order.subtotal?.toFixed(2)}</span>
                            </div>
                            {order.discountCode && (
                                <div className="summary-row discount">
                                    <span>Discount ({order.discountCode}):</span>
                                    <span>-${order.discountAmount?.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="order-shipping">
                            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                        </div>

                        {order.discountCodeGenerated && (
                            <div className="order-discount-code">
                                <p><strong>Discount Code Received:</strong></p>
                                <div className="discount-code">
                                    {order.discountCodeGenerated}
                                </div>
                                <small>10% off on your next order</small>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderHistory;