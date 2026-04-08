import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

// Ensure you have VITE_GOOGLE_CLIENT_ID in your .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder_id';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'placeholder_id' ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      ) : (
        <App />
      )}
    </BrowserRouter>
  </React.StrictMode>
);

