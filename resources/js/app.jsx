import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/AuthContext';
import { MenuProvider } from './core/MenuContext';
import { SidebarProvider } from './core/SidebarContext';
import { AlertProvider, useAlert } from './core/AlertContext';
import AppRoutes from './routes/AppRoutes';
import '../css/app.css';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <MenuProvider>
                        <SidebarProvider>
                            <AlertProvider>
                                <AppRoutes />
                            </AlertProvider>
                        </SidebarProvider>
                    </MenuProvider>
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}

// Expose confirm and alert functions globally for easy access
// Wait for next tick to ensure providers are mounted
setTimeout(() => {
    window.__APP__ = {
        confirm: (options) => {
            return new Promise((resolve) => {
                // Dispatch custom event to trigger confirm modal
                const event = new CustomEvent('app:confirm', {
                    detail: { options, resolve }
                });
                window.dispatchEvent(event);
            });
        },
        alert: (message, type = 'info', duration = 5000) => {
            const event = new CustomEvent('app:alert', {
                detail: { message, type, duration }
            });
            window.dispatchEvent(event);
        }
    };
}, 0);
