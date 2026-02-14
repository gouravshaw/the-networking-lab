import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { followUpTemplates } from '../data/sessionContent';
import { buildPersonalisedCards, getResetMessage } from '../data/promptEngine';
import CopyButton from '../components/CopyButton';
import {
      ArrowLeft,
      ArrowRight,
      Check,
      ChevronLeft,
      ChevronRight,
      UserPlus,
} from 'lucide-react';

const STEPS = ['Before', 'During', 'After'];

export default function Session() {
      const navigate = useNavigate();
      const { addContact, completeSession, intros, preferences } = useUser();
      const [currentStep, setCurrentStep] = useState(0);

      // Step 1
      const [goal, setGoal] = useState('');
      const [confidence, setConfidence] = useState(3);

      // Step 2 — personalised prompts
      const promptCards = useMemo(() => buildPersonalisedCards(preferences), [preferences]);
      const [cardIndex, setCardIndex] = useState(0);

      // Step 3
      const [contactName, setContactName] = useState('');
      const [contactWhere, setContactWhere] = useState('');
      const [contactNotes, setContactNotes] = useState('');
      const [reflection, setReflection] = useState('');
      const [completed, setCompleted] = useState(false);

      const savedIntro = intros?.short || intros?.elevator || '';
      const showIntroFirst = preferences?.difficulty === 'talking-about-myself';
      const followUpCount = preferences?.difficulty === 'follow-up' ? 3 : 2;
      const resetMessage = getResetMessage(preferences?.difficulty);

      const handleNext = () => {
            if (currentStep < 2) setCurrentStep(prev => prev + 1);
      };

      const handleBack = () => {
            if (currentStep > 0) setCurrentStep(prev => prev - 1);
      };

      const handleComplete = () => {
            if (contactName.trim()) {
                  addContact({
                        name: contactName.trim(),
                        where: contactWhere.trim(),
                        notes: contactNotes.trim(),
                        role: '',
                        company: '',
                        followUpDate: '',
                  });
            }

            completeSession({
                  goal,
                  confidence,
                  reflection,
                  contactSaved: !!contactName.trim(),
            });

            setCompleted(true);
      };

      // ── COMPLETED ──
      if (completed) {
            return (
                  <div className="page page--no-nav page--centered" id="session-complete">
                        <div className="text-center animate-scale-in" style={{ maxWidth: 320 }}>
                              <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    background: 'var(--color-success-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-4)',
                              }}>
                                    <Check size={24} color="var(--color-success)" />
                              </div>
                              <h1 className="text-xl mb-6">Session Complete.</h1>
                              <button
                                    className="btn btn-primary btn-full"
                                    onClick={() => navigate('/')}
                                    id="session-done-btn"
                              >
                                    Done
                              </button>
                        </div>
                  </div>
            );
      }

      return (
            <div className="page page--no-nav" id="session-page">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4" style={{ paddingTop: 'var(--space-2)' }}>
                        <button className="page-header__back" onClick={() => navigate('/')}>
                              <ArrowLeft size={18} />
                              Exit
                        </button>
                        <span className="text-sm text-secondary" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                              {STEPS[currentStep]}
                        </span>
                        <div style={{ width: 60 }} />
                  </div>

                  {/* Step dots */}
                  <div className="step-indicator mb-6">
                        {STEPS.map((label, i) => (
                              <div
                                    key={label}
                                    className={`step-dot${i === currentStep ? ' step-dot--active' : ''}${i < currentStep ? ' step-dot--done' : ''}`}
                              />
                        ))}
                  </div>

                  {/* Content */}
                  <div className="animate-fade-in" key={currentStep}>
                        {currentStep === 0 && (
                              <ResetStep
                                    goal={goal}
                                    setGoal={setGoal}
                                    confidence={confidence}
                                    setConfidence={setConfidence}
                                    resetMessage={resetMessage}
                              />
                        )}
                        {currentStep === 1 && (
                              <PromptsStep
                                    cards={promptCards}
                                    cardIndex={cardIndex}
                                    setCardIndex={setCardIndex}
                                    savedIntro={savedIntro}
                                    showIntroFirst={showIntroFirst}
                              />
                        )}
                        {currentStep === 2 && (
                              <WrapUpStep
                                    contactName={contactName}
                                    setContactName={setContactName}
                                    contactWhere={contactWhere}
                                    setContactWhere={setContactWhere}
                                    contactNotes={contactNotes}
                                    setContactNotes={setContactNotes}
                                    reflection={reflection}
                                    setReflection={setReflection}
                                    followUpCount={followUpCount}
                              />
                        )}
                  </div>

                  {/* Nav buttons */}
                  <div className="flex gap-3 mt-8" style={{ paddingBottom: 'var(--space-4)' }}>
                        {currentStep > 0 && (
                              <button className="btn btn-secondary" onClick={handleBack} style={{ flex: '0 0 auto' }}>
                                    <ArrowLeft size={18} />
                                    Back
                              </button>
                        )}
                        {currentStep < 2 ? (
                              <button className="btn btn-primary btn-full" onClick={handleNext} id="session-next-btn">
                                    Continue
                                    <ArrowRight size={18} />
                              </button>
                        ) : (
                              <button className="btn btn-primary btn-full" onClick={handleComplete} id="session-complete-btn">
                                    <Check size={18} />
                                    Complete Session
                              </button>
                        )}
                  </div>
            </div>
      );
}

// ── STEP 1: BEFORE (Reset) ──
function ResetStep({ goal, setGoal, confidence, setConfidence, resetMessage }) {
      const confidenceLabels = ['😰', '😐', '🙂', '😊', '🔥'];

      return (
            <div>
                  <div className="card mb-6 animate-slide-up" style={{
                        textAlign: 'center',
                        padding: 'var(--space-8) var(--space-6)',
                        background: 'var(--color-surface-elevated)',
                  }}>
                        <p style={{
                              fontSize: 'var(--font-size-xl)',
                              fontWeight: 'var(--font-weight-medium)',
                              letterSpacing: '-0.3px',
                        }}>
                              {resetMessage}
                        </p>
                  </div>

                  <div className="form-group animate-slide-up stagger-2">
                        <label className="form-label">What's your goal for this interaction?</label>
                        <input
                              className="form-input"
                              value={goal}
                              onChange={e => setGoal(e.target.value)}
                              placeholder="e.g. Learn about someone's career path"
                              id="session-goal-input"
                        />
                  </div>

                  <div className="animate-slide-up stagger-3 mt-4">
                        <label className="form-label">How are you feeling? <span className="text-tertiary">(optional)</span></label>
                        <div className="confidence-slider">
                              {confidenceLabels.map((emoji, i) => (
                                    <button
                                          key={i}
                                          className={`confidence-slider__dot${confidence === i + 1 ? ' confidence-slider__dot--active' : ''}`}
                                          onClick={() => setConfidence(i + 1)}
                                          aria-label={`Confidence level ${i + 1}`}
                                    >
                                          {emoji}
                                    </button>
                              ))}
                        </div>
                  </div>
            </div>
      );
}

// ── STEP 2: DURING (Live Prompts) ──
function PromptsStep({ cards, cardIndex, setCardIndex, savedIntro, showIntroFirst }) {
      const card = cards[cardIndex];

      const goNext = () => {
            if (cardIndex < cards.length - 1) setCardIndex(prev => prev + 1);
      };

      const goPrev = () => {
            if (cardIndex > 0) setCardIndex(prev => prev - 1);
      };

      return (
            <div>
                  {/* Intro reference — always show first card if showIntroFirst, otherwise only on first card */}
                  {savedIntro && (showIntroFirst || cardIndex === 0) && (
                        <div className="card mb-4 animate-slide-up" style={{
                              background: 'var(--color-primary-light)',
                              padding: 'var(--space-3) var(--space-4)',
                        }}>
                              <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-secondary" style={{ fontWeight: 'var(--font-weight-semibold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                          Your Intro
                                    </span>
                                    <CopyButton text={savedIntro} />
                              </div>
                              <p className="text-sm">"{savedIntro}"</p>
                        </div>
                  )}

                  {/* Prompt card */}
                  <div className="card animate-scale-in" key={cardIndex} style={{
                        minHeight: 160,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 'var(--space-6)',
                  }}>
                        <div className="flex justify-between items-center mb-4">
                              <span className="chip">{card.type}</span>
                              <CopyButton text={card.text} />
                        </div>
                        <p style={{
                              fontSize: 'var(--font-size-lg)',
                              fontWeight: 'var(--font-weight-medium)',
                              lineHeight: 'var(--line-height-relaxed)',
                              marginBottom: 'var(--space-3)',
                        }}>
                              "{card.text}"
                        </p>
                        <span className="text-xs text-tertiary">{card.label}</span>
                  </div>

                  {/* Prev / Next */}
                  <div className="flex items-center justify-between mt-4">
                        <button
                              className="btn btn-secondary"
                              onClick={goPrev}
                              disabled={cardIndex === 0}
                              style={{ opacity: cardIndex === 0 ? 0.4 : 1, padding: 'var(--space-2) var(--space-3)' }}
                        >
                              <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm text-secondary">
                              {cardIndex + 1} / {cards.length}
                        </span>
                        <button
                              className="btn btn-secondary"
                              onClick={goNext}
                              disabled={cardIndex === cards.length - 1}
                              style={{ opacity: cardIndex === cards.length - 1 ? 0.4 : 1, padding: 'var(--space-2) var(--space-3)' }}
                        >
                              <ChevronRight size={18} />
                        </button>
                  </div>
            </div>
      );
}

// ── STEP 3: AFTER (Wrap Up) ──
function WrapUpStep({
      contactName, setContactName,
      contactWhere, setContactWhere,
      contactNotes, setContactNotes,
      reflection, setReflection,
      followUpCount,
}) {
      return (
            <div>
                  {/* Contact */}
                  <div className="card mb-5 animate-slide-up">
                        <div className="flex items-center gap-2 mb-3">
                              <UserPlus size={16} />
                              <span style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                                    Save Contact
                              </span>
                        </div>
                        <div className="form-group">
                              <input className="form-input" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Name" id="session-contact-name" />
                        </div>
                        <div className="form-group">
                              <input className="form-input" value={contactWhere} onChange={e => setContactWhere(e.target.value)} placeholder="Where did you meet?" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                              <textarea className="form-input" value={contactNotes} onChange={e => setContactNotes(e.target.value)} placeholder="Quick notes..." rows={2} />
                        </div>
                  </div>

                  {/* Follow-up templates */}
                  <div className="mb-5 animate-slide-up stagger-2">
                        <span className="text-sm mb-3" style={{ fontWeight: 'var(--font-weight-semibold)', display: 'block' }}>
                              Follow-up Templates
                        </span>
                        {followUpTemplates.slice(0, followUpCount).map(t => (
                              <div key={t.id} className="card mb-3" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                                    <div className="flex justify-between items-center mb-2">
                                          <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>{t.title}</span>
                                          <CopyButton text={t.template} />
                                    </div>
                                    <p className="text-sm text-secondary">{t.template}</p>
                              </div>
                        ))}
                  </div>

                  {/* Reflection */}
                  <div className="form-group animate-slide-up stagger-3">
                        <label className="form-label">What went well?</label>
                        <textarea className="form-input" value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Quick reflection..." rows={2} id="session-reflection" />
                  </div>
            </div>
      );
}
