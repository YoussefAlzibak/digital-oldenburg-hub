// Build v25 - explicit React import for build stability
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Application entry point
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
