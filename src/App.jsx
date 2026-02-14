import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import Session from './pages/Session';
import Setup from './pages/Setup';
import IntroBuilder from './pages/IntroBuilder';
import Toolbox from './pages/Toolbox';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';

function AppRoutes() {
      const { hasCompletedSetup } = useUser();

      if (!hasCompletedSetup) {
            return (
                  <Routes>
                        <Route path="/setup" element={<Setup />} />
                        <Route path="*" element={<Navigate to="/setup" replace />} />
                  </Routes>
            );
      }

      return (
            <>
                  <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/session" element={<Session />} />
                        <Route path="/intro-builder" element={<IntroBuilder />} />
                        <Route path="/toolbox" element={<Toolbox />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/contacts/:id" element={<ContactDetail />} />
                        <Route path="/setup" element={<Navigate to="/" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <TopNav />
            </>
      );
}

export default function App() {
      return (
            <BrowserRouter>
                  <ThemeProvider>
                        <UserProvider>
                              <div className="app-layout">
                                    <AppRoutes />
                              </div>
                        </UserProvider>
                  </ThemeProvider>
            </BrowserRouter>
      );
}
