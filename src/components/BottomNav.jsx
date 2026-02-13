import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Users, Compass, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/toolbox', icon: MessageSquare, label: 'Toolbox' },
      { path: '/contacts', icon: Users, label: 'Contacts' },
      { path: '/intro-builder', icon: Compass, label: 'My Intro' },
];

// Pages where nav should be hidden
const hiddenPaths = ['/onboarding', '/session'];

export default function BottomNav() {
      const location = useLocation();
      const { theme, toggleTheme } = useTheme();

      if (hiddenPaths.some(p => location.pathname.startsWith(p))) {
            return null;
      }

      const ThemeIcon = theme === 'dark' ? Sun : Moon;

      return (
            <nav className="bottom-nav" id="bottom-navigation">
                  <div className="bottom-nav__brand">
                        <Sparkles size={22} />
                        <span>The Networking Lab</span>
                  </div>
                  {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                              key={path}
                              to={path}
                              className={({ isActive }) =>
                                    `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
                              }
                              end={path === '/'}
                        >
                              <Icon size={22} strokeWidth={1.8} />
                              <span>{label}</span>
                        </NavLink>
                  ))}
                  <button
                        className="bottom-nav__item bottom-nav__theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        id="theme-toggle-btn"
                  >
                        <ThemeIcon size={22} strokeWidth={1.8} />
                        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </button>
            </nav>
      );
}
