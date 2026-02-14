import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Wrench, Users, Compass, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/toolbox', icon: Wrench, label: 'Tools' },
      { path: '/contacts', icon: Users, label: 'Contacts' },
      { path: '/intro-builder', icon: Compass, label: 'My Intro' },
];

const hiddenPaths = ['/session'];

export default function TopNav() {
      const location = useLocation();
      const { theme, toggleTheme } = useTheme();

      if (hiddenPaths.some(p => location.pathname.startsWith(p))) {
            return null;
      }

      const ThemeIcon = theme === 'dark' ? Sun : Moon;

      return (
            <nav className="top-nav" id="top-navigation">
                  <div className="top-nav__left">
                        <span className="top-nav__brand">The Networking Lab</span>
                  </div>
                  <div className="top-nav__center">
                        {navItems.map(({ path, icon: Icon, label }) => (
                              <NavLink
                                    key={path}
                                    to={path}
                                    className={({ isActive }) =>
                                          `top-nav__item${isActive ? ' top-nav__item--active' : ''}`
                                    }
                                    end={path === '/'}
                              >
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span>{label}</span>
                              </NavLink>
                        ))}
                  </div>
                  <div className="top-nav__right">
                        <button
                              className="top-nav__theme-btn"
                              onClick={toggleTheme}
                              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                              id="theme-toggle-btn"
                        >
                              <ThemeIcon size={18} strokeWidth={1.8} />
                        </button>
                  </div>
            </nav>
      );
}
