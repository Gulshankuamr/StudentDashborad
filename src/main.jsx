import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// StrictMode removed to prevent double render in dev
ReactDOM.createRoot(document.getElementById('root')).render(<App />);