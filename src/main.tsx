// Safeguard against libraries trying to overwrite window.fetch
// which is a read-only getter in some environments.
// This MUST run before any other imports to catch early overwrites.
const originalFetch = window.fetch;
try {
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (!desc || desc.configurable) {
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => originalFetch,
      set: (v) => {
        console.warn('Attempted to overwrite window.fetch with:', v);
      }
    });
  }
} catch (e) {
  console.error('Failed to safeguard window.fetch:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
