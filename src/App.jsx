// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Components
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import OrderHistory from './components/OrderHistory.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function App() {
    const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9));
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        fetchCart();
    }, [userId]);

    const fetchCart = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/cart/${userId}`);
            const data = await response.json();
            if (data.success) {
                setCart(data.cart);
                setCartItemCount(data.cart.totalItems || 0);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (productId) => {
        try {
            const response = await fetch('http://localhost:3001/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId, quantity: 1 })
            });
            const data = await response.json();
            if (data.success) {
                setCart(data.cart);
                setCartItemCount(data.cart.totalItems);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <div className="nav-brand">E-Commerce Store</div>
                    <div className="nav-links">
                        <Link to="/">Products</Link>
                        <Link to="/cart">
                            Cart ({cartItemCount})
                        </Link>
                        <Link to="/orders">Orders</Link>
                        <Link to="/admin">Admin</Link>
                    </div>
                    <div className="user-info">
                        User: {userId.substring(0, 8)}...
                    </div>
                </nav>

                <div className="container">
                    <Routes>
                        <Route path="/" element={
                            <ProductList 
                                addToCart={addToCart}
                                userId={userId}
                            />
                        } />
                        <Route path="/cart" element={
                            <Cart 
                                cart={cart}
                                userId={userId}
                                fetchCart={fetchCart}
                            />
                        } />
                        <Route path="/checkout" element={
                            <Checkout 
                                userId={userId}
                                cart={cart}
                            />
                        } />
                        <Route path="/orders" element={
                            <OrderHistory userId={userId} />
                        } />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;