import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
      ArrowRight,
      Wrench,
      Users,
      Compass,
      Sparkles,
} from 'lucide-react';

const quickTools = [
      { label: 'My Intro', icon: Compass, path: '/intro-builder' },
      { label: 'Tools', icon: Wrench, path: '/toolbox' },
      { label: 'Contacts', icon: Users, path: '/contacts' },
];

export default function Home() {
      const navigate = useNavigate();
      const { resetPreferences } = useUser();

      return (
            <div className="page" id="home-page">
                  {/* Main CTA */}
                  <div className="animate-slide-up" style={{ paddingTop: 'var(--space-4)' }}>
                        <h1 className="text-2xl mb-2">Ready to network?</h1>
                        <p className="text-secondary mb-6" style={{ fontSize: 'var(--font-size-sm)' }}>
                              Prepare, connect, follow up — in one session.
                        </p>
                        <button
                              className="btn btn-primary btn-full btn-lg animate-slide-up stagger-2"
                              onClick={() => navigate('/session')}
                              style={{
                                    padding: 'var(--space-4) var(--space-6)',
                                    fontSize: 'var(--font-size-md)',
                                    borderRadius: 'var(--radius-xl)',
                              }}
                              id="start-session-btn"
                        >
                              <Sparkles size={20} />
                              Start Networking Session
                              <ArrowRight size={18} />
                        </button>
                  </div>

                  {/* Quick Access */}
                  <div className="animate-slide-up stagger-3 mt-10">
                        <div style={{
                              display: 'flex',
                              gap: 'var(--space-3)',
                        }}>
                              {quickTools.map(({ label, icon: Icon, path }, i) => (
                                    <button
                                          key={label}
                                          className={`card card--interactive animate-slide-up stagger-${i + 4}`}
                                          onClick={() => navigate(path)}
                                          style={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-4) var(--space-3)',
                                          }}
                                          id={`quick-tool-${label.toLowerCase().replace(/\s/g, '-')}`}
                                    >
                                          <Icon size={20} color="var(--color-text-secondary)" />
                                          <span style={{
                                                fontWeight: 'var(--font-weight-medium)',
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-secondary)',
                                          }}>
                                                {label}
                                          </span>
                                    </button>
                              ))}
                        </div>
                  </div>

                  {/* Update Focus */}
                  <div className="mt-12 text-center animate-fade-in stagger-5">
                        <button
                              className="btn btn-ghost btn-sm text-tertiary"
                              onClick={resetPreferences}
                              style={{ fontSize: 'var(--font-size-xs)' }}
                              id="update-focus-btn"
                        >
                              Update my focus
                        </button>
                  </div>
            </div>
      );
}
