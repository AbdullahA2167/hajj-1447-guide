// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './store/appStore';
import { App } from './App';
import './index.css';
import bgImage from './assets/bg.jpg'; // <- import your PNG

// Attach it to window so CSS can use it via a custom property
document.documentElement.style.setProperty('--app-bg', `url(${bgImage})`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);