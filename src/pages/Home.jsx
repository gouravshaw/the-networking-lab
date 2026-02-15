import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
      ArrowRight,
      Wrench,
      Users,
      Compass,
      Sparkles,
      Check,
      Target,
      MessageCircle,
      UserCheck,
} from 'lucide-react';

/* ── Setup Questions ── */
const QUESTIONS = [
      {
            key: 'category',
            question: 'Who are you?',
            options: [
                  { value: 'student', label: 'Student' },
                  { value: 'graduate', label: 'Recent graduate' },
                  { value: 'career-switcher', label: 'Career switcher' },
                  { value: 'professional', label: 'Working professional' },
                  { value: 'entrepreneur', label: 'Entrepreneur / freelancer' },
            ],
      },
      {
            key: 'reason',
            question: 'Why are you networking?',
            options: [
                  { value: 'job', label: 'Job / internship' },
                  { value: 'learning', label: 'Learning' },
                  { value: 'career-growth', label: 'Career growth' },
                  { value: 'mentor', label: 'Finding mentor' },
                  { value: 'confidence', label: 'Building confidence' },
            ],
      },
      {
            key: 'difficulty',
            question: 'What do you struggle with most?',
            options: [
                  { value: 'confidence', label: 'Confidence' },
                  { value: 'starting-conversations', label: 'Starting conversations' },
                  { value: 'talking-about-myself', label: 'Talking about myself' },
                  { value: 'keeping-going', label: 'Keeping conversations going' },
                  { value: 'follow-up', label: 'Follow-up' },
            ],
      },
];

/* ── Quick Tools ── */
const quickTools = [
      { label: 'My Intro', icon: Compass, path: '/intro-builder' },
      { label: 'Tools', icon: Wrench, path: '/toolbox' },
      { label: 'Contacts', icon: Users, path: '/contacts' },
];

/* ── How-It-Works Steps ── */
const steps = [
      { icon: Target, title: 'Prepare', desc: 'Set a goal and get in the right mindset' },
      { icon: MessageCircle, title: 'Engage', desc: 'Use tailored prompts during conversations' },
      { icon: UserCheck, title: 'Follow up', desc: 'Save contacts and send a message' },
];

export default function Home() {
      const navigate = useNavigate();
      const { hasCompletedSetup, setPreferences, resetPreferences } = useUser();

      /* ── If setup not done, show landing with inline setup ── */
      if (!hasCompletedSetup) {
            return <LandingView setPreferences={setPreferences} />;
      }

      /* ── Normal Home ── */
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
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
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

/* ══════════════════════════════════════════════════
   LANDING VIEW — shown to first-time users
   Hero + How-It-Works + Inline Setup
   ══════════════════════════════════════════════════ */
function LandingView({ setPreferences }) {
      const [step, setStep] = useState(0);
      const [answers, setAnswers] = useState({});
      const [showSetup, setShowSetup] = useState(false);

      const current = QUESTIONS[step];
      const selected = answers[current?.key] || null;
      const isLast = step === QUESTIONS.length - 1;

      const handleSelect = (value) => {
            setAnswers(prev => ({ ...prev, [current.key]: value }));
      };

      const handleContinue = () => {
            if (!selected) return;
            if (isLast) {
                  setPreferences(answers);
            } else {
                  setStep(prev => prev + 1);
            }
      };

      return (
            <div className="page" id="landing-page">
                  {/* ── Hero ── */}
                  <section className="animate-slide-up" style={{ paddingTop: 'var(--space-4)', textAlign: 'center' }}>
                        <h1 className="text-2xl mb-3" style={{ lineHeight: 1.2 }}>
                              Network with confidence.
                        </h1>
                        <p className="text-secondary mb-8" style={{ fontSize: 'var(--font-size-sm)', maxWidth: 360, margin: '0 auto' }}>
                              A simple tool to help you prepare, engage, and follow up — every time.
                        </p>

                        {!showSetup && (
                              <button
                                    className="btn btn-primary btn-lg animate-slide-up stagger-2"
                                    onClick={() => setShowSetup(true)}
                                    style={{
                                          padding: 'var(--space-4) var(--space-8)',
                                          fontSize: 'var(--font-size-md)',
                                          borderRadius: 'var(--radius-xl)',
                                    }}
                                    id="get-started-btn"
                              >
                                    <Sparkles size={20} />
                                    Get Started
                                    <ArrowRight size={18} />
                              </button>
                        )}
                  </section>

                  {/* ── How It Works ── */}
                  {!showSetup && (
                        <section className="mt-12 animate-slide-up stagger-3">
                              <h2 className="text-sm text-tertiary mb-4" style={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    textAlign: 'center',
                              }}>
                                    How it works
                              </h2>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {steps.map(({ icon: Icon, title, desc }, i) => (
                                          <div key={title} className={`card animate-slide-up stagger-${i + 4}`} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-4)',
                                                padding: 'var(--space-4)',
                                          }}>
                                                <div style={{
                                                      width: 40,
                                                      height: 40,
                                                      borderRadius: 'var(--radius-md)',
                                                      background: 'var(--color-primary-light)',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      flexShrink: 0,
                                                }}>
                                                      <Icon size={18} color="var(--color-primary)" />
                                                </div>
                                                <div>
                                                      <span style={{
                                                            fontWeight: 'var(--font-weight-semibold)',
                                                            fontSize: 'var(--font-size-sm)',
                                                            display: 'block',
                                                            marginBottom: 2,
                                                      }}>
                                                            {title}
                                                      </span>
                                                      <span className="text-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                                                            {desc}
                                                      </span>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </section>
                  )}

                  {/* ── Inline Setup (after clicking Get Started) ── */}
                  {showSetup && (
                        <section className="mt-8 animate-fade-in" id="setup-section">
                              <div style={{ maxWidth: 440, margin: '0 auto' }}>
                                    {/* Progress dots */}
                                    <div className="step-indicator mb-6">
                                          {QUESTIONS.map((_, i) => (
                                                <div
                                                      key={i}
                                                      className={`step-dot${i === step ? ' step-dot--active' : ''}${i < step ? ' step-dot--done' : ''}`}
                                                />
                                          ))}
                                    </div>

                                    {/* Question */}
                                    <div className="animate-fade-in" key={step}>
                                          <h2 className="text-lg mb-5" style={{ textAlign: 'center' }}>
                                                {current.question}
                                          </h2>

                                          <div className="setup-options">
                                                {current.options.map(opt => (
                                                      <button
                                                            key={opt.value}
                                                            className={`setup-option${selected === opt.value ? ' setup-option--active' : ''}`}
                                                            onClick={() => handleSelect(opt.value)}
                                                      >
                                                            {selected === opt.value && <Check size={16} />}
                                                            {opt.label}
                                                      </button>
                                                ))}
                                          </div>
                                    </div>

                                    {/* Continue / Get Started */}
                                    <button
                                          className="btn btn-primary btn-full mt-6"
                                          onClick={handleContinue}
                                          disabled={!selected}
                                          style={{ opacity: selected ? 1 : 0.5 }}
                                          id="setup-continue-btn"
                                    >
                                          {isLast ? 'Start Networking' : 'Continue'}
                                          <ArrowRight size={18} />
                                    </button>

                                    {step > 0 && (
                                          <button
                                                className="btn btn-secondary btn-full mt-3"
                                                onClick={() => setStep(prev => prev - 1)}
                                          >
                                                Back
                                          </button>
                                    )}
                              </div>
                        </section>
                  )}
            </div>
      );
}
