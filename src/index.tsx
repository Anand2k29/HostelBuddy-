import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// We removed the database init call to prevent errors
console.log('Application starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);