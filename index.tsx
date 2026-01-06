import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SessionContextProvider } from './src/contexts/SessionContext';
import { ThemeProvider } from './src/contexts/ThemeContext'; // Import ThemeProvider
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionContextProvider>
        <ThemeProvider> {/* Wrap with ThemeProvider */}
          <App />
        </ThemeProvider>
      </SessionContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);