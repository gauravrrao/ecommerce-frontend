import React, { useState, useEffect } from 'react';
import config from '../config';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [newNthOrder, setNewNthOrder] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch(`${config.apiUrl}/admin/stats`),
                fetch(`${config.apiUrl}/admin/orders`)
            ]);
            
            const statsData = await statsRes.json();
            const ordersData = await ordersRes.json();
            
            if (statsData.success) setStats(statsData.stats);
            if (ordersData.success) setOrders(ordersData.orders);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateDiscountCode = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/admin/generate-discount`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await response.json();
            if (data.success) {
                alert(`Discount code generated: ${data.code}`);
                fetchAdminData();
            }
        } catch (error) {
            console.error('Error generating discount code:', error);
        }
    };

    const updateNthOrder = async () => {
        const n = parseInt(newNthOrder);
        if (isNaN(n) || n < 1) {
            alert('Please enter a valid positive number');
            return;
        }

        try {
            const response = await fetch(`${config.apiUrl}/admin/nth-order`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ n })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                setNewNthOrder('');
                fetchAdminData();
            }
        } catch (error) {
            console.error('Error updating nth order:', error);
        }
    };

    if (loading) return <div className="loading">Loading admin data...</div>;

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            
            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats.totalOrders}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Items Purchased</h3>
                        <p className="stat-value">{stats.totalItemsPurchased}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">${stats.totalPurchaseAmount.toFixed(2)}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Discount</h3>
                        <p className="stat-value">${stats.totalDiscountAmount.toFixed(2)}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Discount Codes</h3>
                        <p className="stat-value">{stats.discountCodesGenerated}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Nth Order Setting</h3>
                        <p className="stat-value">Every {stats.nthOrderSetting}th order</p>
                    </div>
                </div>
            )}

            <div className="admin-controls">
                <div className="control-group">
                    <h3>Discount Code Management</h3>
                    <button 
                        className="generate-discount-btn"
                        onClick={generateDiscountCode}
                    >
                        Generate Discount Code
                    </button>
                    
                    {stats?.activeDiscountCodes && stats.activeDiscountCodes.length > 0 && (
                        <div className="active-discounts">
                            <h4>Active Discount Codes:</h4>
                            <ul>
                                {stats.activeDiscountCodes.map(discount => (
                                    <li key={discount.code}>
                                        <strong>{discount.code}</strong> - {discount.discountPercent}% off
                                        <br />
                                        <small>Generated: {new Date(discount.generatedAt).toLocaleDateString()}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="control-group">
                    <h3>Update Nth Order Setting</h3>
                    <div className="nth-order-control">
                        <input
                            type="number"
                            value={newNthOrder}
                            onChange={(e) => setNewNthOrder(e.target.value)}
                            placeholder={`Current: ${stats?.nthOrderSetting || 5}`}
                            min="1"
                        />
                        <button onClick={updateNthOrder}>Update</button>
                    </div>
                    <p className="help-text">
                        Currently, every {stats?.nthOrderSetting || 5}th order receives a 10% discount code
                    </p>
                </div>
            </div>

            <div className="recent-orders">
                <h3>Recent Orders</h3>
                {orders.length === 0 ? (
                    <p>No orders yet</p>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>User ID</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Discount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(-10).reverse().map(order => (
                                <tr key={order.orderId}>
                                    <td>#{order.orderNumber}</td>
                                    <td className="user-id">{order.userId.substring(0, 8)}...</td>
                                    <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        {order.discountCode ? (
                                            <span className="discount-badge">
                                                {order.discountCode}
                                            </span>
                                        ) : 'None'}
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;