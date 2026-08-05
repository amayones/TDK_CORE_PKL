import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/AuthContext';
import { MenuProvider } from './core/MenuContext';
import { SidebarProvider } from './core/SidebarContext';
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
                            <AppRoutes />
                        </SidebarProvider>
                    </MenuProvider>
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}
