import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import BottomNav from './components/BottomNav';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Session from './pages/Session';
import IntroBuilder from './pages/IntroBuilder';
import Toolbox from './pages/Toolbox';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';

function AppRoutes() {
      const { onboardingComplete } = useUser();

      return (
            <>
                  <Routes>
                        <Route
                              path="/onboarding"
                              element={
                                    onboardingComplete ? <Navigate to="/" replace /> : <Onboarding />
                              }
                        />
                        <Route
                              path="/"
                              element={
                                    !onboardingComplete ? <Navigate to="/onboarding" replace /> : <Home />
                              }
                        />
                        <Route
                              path="/session"
                              element={
                                    !onboardingComplete ? <Navigate to="/onboarding" replace /> : <Session />
                              }
                        />
                        <Route
                              path="/intro-builder"
                              element={
                                    !onboardingComplete ? <Navigate to="/onboarding" replace /> : <IntroBuilder />
                              }
                        />
                        <Route
                              path="/toolbox"
                              element={
                                    !onboardingComplete ? <Navigate to="/onboarding" replace /> : <Toolbox />
                              }
                        />
                        <Route
                              path="/contacts"
                              element={
                                    !onboardingComplete ? <Navigate to="/onboarding" replace /> : <Contacts />
                              }
                        />
                        <Route
                              path="/contacts/:id"
                              element={
                                    !onboardingComplete ? <Navigate to="/onboarding" replace /> : <ContactDetail />
                              }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <BottomNav />
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
