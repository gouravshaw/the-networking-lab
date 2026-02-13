import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
      getSessionFocus,
      needsConfidencePrep,
      getToneForCategory,
} from '../utils/personalisationEngine';
import {
      mentalReframes,
      confidencePrepMessages,
      goalSuggestions,
      actionCommitments,
      conversationStarters,
      introTemplate,
      confidenceBoostersDuring,
      followUpTemplates,
      reflectionPrompts,
      positiveReinforcements,
} from '../data/sessionContent';
import CopyButton from '../components/CopyButton';
import {
      ArrowLeft,
      ArrowRight,
      Check,
      Sparkles,
      MessageCircle,
      Heart,
      UserPlus,
      ChevronRight,
      Target,
      Lightbulb,
} from 'lucide-react';

const STEP_LABELS = ['Before', 'During', 'After'];

export default function Session() {
      const navigate = useNavigate();
      const { profile, addContact, completeSession } = useUser();
      const [currentStep, setCurrentStep] = useState(0);

      // Before state
      const [goal, setGoal] = useState('');
      const [commitment, setCommitment] = useState('');

      // After state
      const [contactName, setContactName] = useState('');
      const [contactWhere, setContactWhere] = useState('');
      const [contactNotes, setContactNotes] = useState('');
      const [reflection, setReflection] = useState('');
      const [sessionCompleted, setSessionCompleted] = useState(false);

      const focus = useMemo(
            () => getSessionFocus(profile?.difficulty),
            [profile?.difficulty]
      );
      const showConfidencePrep = needsConfidencePrep(profile?.difficulty);
      const tone = getToneForCategory(profile?.category);

      // Pick random reframe
      const reframe = useMemo(
            () => mentalReframes[Math.floor(Math.random() * mentalReframes.length)],
            []
      );
      const reinforcement = useMemo(
            () => positiveReinforcements[Math.floor(Math.random() * positiveReinforcements.length)],
            []
      );
      const reflectionPrompt = useMemo(
            () => reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)],
            []
      );

      const handleNext = () => {
            if (currentStep < 2) setCurrentStep(prev => prev + 1);
      };

      const handleBack = () => {
            if (currentStep > 0) setCurrentStep(prev => prev - 1);
      };

      const handleComplete = () => {
            // Save contact if name provided
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
                  commitment,
                  reflection,
                  contactSaved: !!contactName.trim(),
            });

            setSessionCompleted(true);
      };

      if (sessionCompleted) {
            return (
                  <div className="page page--no-nav page--centered" id="session-complete">
                        <div className="text-center animate-scale-in" style={{ maxWidth: 320 }}>
                              <div style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    background: 'var(--color-success-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-6)',
                              }}>
                                    <Check size={32} color="var(--color-success)" />
                              </div>
                              <h1 className="text-2xl mb-3">Session Complete!</h1>
                              <p className="text-secondary mb-8" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                                    {reinforcement}
                              </p>
                              <button
                                    className="btn btn-primary btn-full btn-lg"
                                    onClick={() => navigate('/')}
                                    id="session-done-btn"
                              >
                                    Back to Home
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
                              {STEP_LABELS[currentStep]}
                        </span>
                        <div style={{ width: 60 }} />
                  </div>

                  {/* Step Indicator */}
                  <div className="step-indicator mb-6">
                        {STEP_LABELS.map((label, i) => (
                              <div
                                    key={label}
                                    className={`step-dot${i === currentStep ? ' step-dot--active' : ''}${i < currentStep ? ' step-dot--done' : ''
                                          }`}
                              />
                        ))}
                  </div>

                  {/* Step Content */}
                  <div className="animate-fade-in" key={currentStep}>
                        {currentStep === 0 && (
                              <BeforeStep
                                    reframe={reframe}
                                    showConfidencePrep={showConfidencePrep}
                                    goal={goal}
                                    setGoal={setGoal}
                                    commitment={commitment}
                                    setCommitment={setCommitment}
                                    tone={tone}
                              />
                        )}
                        {currentStep === 1 && (
                              <DuringStep
                                    difficulty={profile?.difficulty}
                                    focus={focus}
                              />
                        )}
                        {currentStep === 2 && (
                              <AfterStep
                                    contactName={contactName}
                                    setContactName={setContactName}
                                    contactWhere={contactWhere}
                                    setContactWhere={setContactWhere}
                                    contactNotes={contactNotes}
                                    setContactNotes={setContactNotes}
                                    reflection={reflection}
                                    setReflection={setReflection}
                                    reflectionPrompt={reflectionPrompt}
                              />
                        )}
                  </div>

                  {/* Navigation */}
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

// ── BEFORE STEP ──
function BeforeStep({ reframe, showConfidencePrep, goal, setGoal, commitment, setCommitment, tone }) {
      return (
            <div>
                  <h2 className="text-xl mb-2">Prepare your mindset</h2>
                  <p className="text-secondary mb-6">Take a moment before you begin.</p>

                  {/* Confidence prep (if needed) */}
                  {showConfidencePrep && (
                        <div className="mb-6">
                              {confidencePrepMessages.slice(0, 2).map((msg, i) => (
                                    <div key={msg.id} className={`card card--accent mb-3 animate-slide-up stagger-${i + 1}`}>
                                          <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>
                                                {msg.title}
                                          </div>
                                          <p className="text-sm text-secondary" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                                                {msg.text}
                                          </p>
                                    </div>
                              ))}
                        </div>
                  )}

                  {/* Mental Reframe */}
                  <div className="card mb-6 animate-slide-up stagger-2" style={{
                        background: 'linear-gradient(135deg, var(--color-sage-50), var(--color-warm-50))',
                        borderColor: 'var(--color-sage-200)',
                        textAlign: 'center',
                        padding: 'var(--space-6)',
                  }}>
                        <Sparkles size={24} color="var(--color-primary)" style={{ margin: '0 auto var(--space-3)' }} />
                        <p style={{
                              fontSize: 'var(--font-size-md)',
                              fontWeight: 'var(--font-weight-medium)',
                              lineHeight: 'var(--line-height-relaxed)',
                              color: 'var(--color-sage-700)',
                        }}>
                              "{reframe.text}"
                        </p>
                  </div>

                  {/* Goal */}
                  <div className="form-group animate-slide-up stagger-3">
                        <label className="form-label">
                              <Target size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                              What's your goal for this interaction?
                        </label>
                        <input
                              className="form-input"
                              value={goal}
                              onChange={e => setGoal(e.target.value)}
                              placeholder="e.g. Learn about someone's career path"
                              id="session-goal-input"
                        />
                        <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
                              {goalSuggestions.slice(0, 4).map(s => (
                                    <button
                                          key={s}
                                          className="chip"
                                          onClick={() => setGoal(s)}
                                          style={{ cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}
                                    >
                                          {s}
                                    </button>
                              ))}
                        </div>
                  </div>

                  {/* Action Commitment */}
                  <div className="form-group animate-slide-up stagger-4">
                        <label className="form-label">
                              <Lightbulb size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                              Pick one small commitment
                        </label>
                        <div className="flex flex-col gap-2">
                              {actionCommitments.slice(0, 4).map(c => (
                                    <button
                                          key={c}
                                          className={`card card--interactive${commitment === c ? ' card--selected' : ''}`}
                                          onClick={() => setCommitment(c)}
                                          style={{
                                                padding: 'var(--space-3) var(--space-4)',
                                                textAlign: 'left',
                                                fontSize: 'var(--font-size-sm)',
                                          }}
                                    >
                                          <div className="flex items-center gap-3">
                                                <div style={{
                                                      width: 20,
                                                      height: 20,
                                                      borderRadius: '50%',
                                                      border: commitment === c ? 'none' : '2px solid var(--color-warm-300)',
                                                      background: commitment === c ? 'var(--color-primary)' : 'transparent',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      flexShrink: 0,
                                                }}>
                                                      {commitment === c && <Check size={12} color="white" />}
                                                </div>
                                                {c}
                                          </div>
                                    </button>
                              ))}
                        </div>
                  </div>
            </div>
      );
}

// ── DURING STEP ──
function DuringStep({ difficulty, focus }) {
      const showStarters = [
            'Starting conversations',
            'Keeping conversations going',
      ].includes(difficulty);

      const showIntro = difficulty === 'Talking about myself clearly';
      const showConfidence = difficulty === 'Lack of confidence' || difficulty === 'Lack of motivation to attend';

      return (
            <div>
                  <h2 className="text-xl mb-2">In the moment</h2>
                  <p className="text-secondary mb-6">Tools to help you right now.</p>

                  {/* Conversation Starters */}
                  {(showStarters || (!showIntro && !showConfidence)) && (
                        <div className="mb-6">
                              <h3 className="text-md mb-3" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                    <MessageCircle size={16} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                                    Conversation Starters
                              </h3>
                              <div className="flex flex-col gap-3">
                                    {conversationStarters.general.map((s, i) => (
                                          <div key={s.id} className={`card animate-slide-up stagger-${i + 1}`}>
                                                <div className="flex justify-between items-center gap-3">
                                                      <div style={{ flex: 1 }}>
                                                            <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-1)' }}>
                                                                  "{s.text}"
                                                            </p>
                                                            <span className="text-xs text-tertiary">{s.context}</span>
                                                      </div>
                                                      <CopyButton text={s.text} />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  )}

                  {/* Follow-up questions for keeping conversations going */}
                  {difficulty === 'Keeping conversations going' && (
                        <div className="mb-6">
                              <h3 className="text-md mb-3" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                    🔄 Keep It Going
                              </h3>
                              <div className="flex flex-col gap-3">
                                    {conversationStarters.followUp.map((s, i) => (
                                          <div key={s.id} className={`card animate-slide-up stagger-${i + 1}`}>
                                                <div className="flex justify-between items-center gap-3">
                                                      <div style={{ flex: 1 }}>
                                                            <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-1)' }}>
                                                                  "{s.text}"
                                                            </p>
                                                            <span className="text-xs text-tertiary">{s.context}</span>
                                                      </div>
                                                      <CopyButton text={s.text} />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  )}

                  {/* Self-Introduction Template */}
                  {showIntro && (
                        <div className="mb-6">
                              <h3 className="text-md mb-3" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                    🪞 Your Introduction
                              </h3>
                              <div className="card card--accent">
                                    <p className="text-sm text-secondary mb-3">Use this structure to introduce yourself clearly:</p>
                                    {introTemplate.fields.map(field => (
                                          <div key={field.key} className="mb-3">
                                                <div className="text-xs text-tertiary mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                                                      {field.label}
                                                </div>
                                                <div className="text-sm" style={{ color: 'var(--color-sage-700)' }}>
                                                      {field.placeholder}
                                                </div>
                                          </div>
                                    ))}
                                    <div style={{
                                          padding: 'var(--space-3)',
                                          background: 'var(--color-sage-50)',
                                          borderRadius: 'var(--radius-md)',
                                          marginTop: 'var(--space-3)',
                                    }}>
                                          <p className="text-sm" style={{ fontStyle: 'italic', color: 'var(--color-sage-600)' }}>
                                                "I'm a final-year design student at UCL. I focus on UX research and interaction design.
                                                I'm looking into accessibility in fintech."
                                          </p>
                                          <div className="mt-2">
                                                <CopyButton text="I'm a final-year design student at UCL. I focus on UX research and interaction design. I'm looking into accessibility in fintech." />
                                          </div>
                                    </div>
                              </div>
                        </div>
                  )}

                  {/* Confidence Boosters */}
                  {showConfidence && (
                        <div className="mb-6">
                              <h3 className="text-md mb-3" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                    ✨ Confidence Boosters
                              </h3>
                              <div className="flex flex-col gap-3">
                                    {confidenceBoostersDuring.map((b, i) => (
                                          <div key={b.id} className={`card animate-slide-up stagger-${i + 1}`} style={{
                                                background: 'linear-gradient(135deg, var(--color-warm-50), var(--color-sage-50))',
                                          }}>
                                                <p style={{ fontWeight: 'var(--font-weight-medium)', lineHeight: 'var(--line-height-relaxed)' }}>
                                                      {b.text}
                                                </p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  )}

                  {/* Curiosity prompts for learning-focused users */}
                  {difficulty === 'Finding the right event' && (
                        <div className="mb-6">
                              <h3 className="text-md mb-3" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                    🔍 Curiosity Prompts
                              </h3>
                              <div className="flex flex-col gap-3">
                                    {conversationStarters.curiosity.map((s, i) => (
                                          <div key={s.id} className={`card animate-slide-up stagger-${i + 1}`}>
                                                <div className="flex justify-between items-center gap-3">
                                                      <div style={{ flex: 1 }}>
                                                            <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-1)' }}>
                                                                  "{s.text}"
                                                            </p>
                                                            <span className="text-xs text-tertiary">{s.context}</span>
                                                      </div>
                                                      <CopyButton text={s.text} />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  )}
            </div>
      );
}

// ── AFTER STEP ──
function AfterStep({
      contactName, setContactName,
      contactWhere, setContactWhere,
      contactNotes, setContactNotes,
      reflection, setReflection,
      reflectionPrompt,
}) {
      return (
            <div>
                  <h2 className="text-xl mb-2">Wrap up & reflect</h2>
                  <p className="text-secondary mb-6">Capture what matters while it's fresh.</p>

                  {/* Save Contact */}
                  <div className="card mb-5 animate-slide-up stagger-1">
                        <h3 className="text-md mb-3" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                              <UserPlus size={16} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                              Save a Contact
                        </h3>
                        <div className="form-group">
                              <input
                                    className="form-input"
                                    value={contactName}
                                    onChange={e => setContactName(e.target.value)}
                                    placeholder="Name"
                                    id="session-contact-name"
                              />
                        </div>
                        <div className="form-group">
                              <input
                                    className="form-input"
                                    value={contactWhere}
                                    onChange={e => setContactWhere(e.target.value)}
                                    placeholder="Where did you meet?"
                              />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                              <textarea
                                    className="form-input"
                                    value={contactNotes}
                                    onChange={e => setContactNotes(e.target.value)}
                                    placeholder="Quick notes about the conversation..."
                                    rows={2}
                              />
                        </div>
                  </div>

                  {/* Follow-up Template */}
                  <div className="mb-5 animate-slide-up stagger-2">
                        <h3 className="text-md mb-3" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                              📩 Suggested Follow-up
                        </h3>
                        <div className="flex flex-col gap-3">
                              {followUpTemplates.slice(0, 2).map(t => (
                                    <div key={t.id} className="card">
                                          <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm" style={{ fontWeight: 'var(--font-weight-semibold)' }}>{t.title}</span>
                                                <CopyButton text={t.template} />
                                          </div>
                                          <p className="text-sm text-secondary" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                                                {t.template}
                                          </p>
                                          <span className="chip mt-2" style={{ fontSize: '11px' }}>{t.context}</span>
                                    </div>
                              ))}
                        </div>
                  </div>

                  {/* Reflection */}
                  <div className="card card--accent animate-slide-up stagger-3">
                        <h3 className="text-md mb-2" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                              <Heart size={16} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                              {reflectionPrompt}
                        </h3>
                        <textarea
                              className="form-input"
                              value={reflection}
                              onChange={e => setReflection(e.target.value)}
                              placeholder="Take a moment to reflect..."
                              rows={3}
                              id="session-reflection"
                        />
                  </div>
            </div>
      );
}
