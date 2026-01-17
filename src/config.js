// frontend/src/config.js
const config = {
    // Development
    development: {
        apiUrl: 'http://localhost:3001/api'
    },
    // Production - will be set by Netlify build environment
    production: {
        apiUrl: process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com/api'
    }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export configuration for current environment
export default config[env];