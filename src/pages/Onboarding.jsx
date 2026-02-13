import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const steps = [
      {
            question: 'Who are you?',
            subtitle: 'This helps us tailor examples and tone to your situation.',
            options: [
                  { value: 'Student', emoji: '🎓', desc: 'Currently studying' },
                  { value: 'Recent graduate / early career', emoji: '🚀', desc: 'Just starting out professionally' },
                  { value: 'Career switcher', emoji: '🔄', desc: 'Transitioning to a new field' },
                  { value: 'Working professional', emoji: '💼', desc: 'Established in my career' },
                  { value: 'Entrepreneur / freelancer', emoji: '⚡', desc: 'Building my own path' },
            ],
      },
      {
            question: 'What is your main reason for networking?',
            subtitle: 'This sets the focus for your sessions.',
            options: [
                  { value: 'Job / internship', emoji: '🎯', desc: 'Finding opportunities' },
                  { value: 'Learning from people in my field', emoji: '📚', desc: 'Gaining knowledge and insights' },
                  { value: 'Career growth / visibility', emoji: '📈', desc: 'Advancing professionally' },
                  { value: 'Finding mentors', emoji: '🤝', desc: 'Getting guidance and support' },
                  { value: 'Building professional confidence', emoji: '💪', desc: 'Becoming more comfortable' },
            ],
      },
      {
            question: 'What do you find most difficult?',
            subtitle: 'We\'ll prioritise guidance for this area first.',
            options: [
                  { value: 'Finding the right event', emoji: '🔍', desc: 'Where do I even go?' },
                  { value: 'Lack of motivation to attend', emoji: '😮‍💨', desc: 'I know I should, but...' },
                  { value: 'Starting conversations', emoji: '💬', desc: 'The first words are hardest' },
                  { value: 'Talking about myself clearly', emoji: '🪞', desc: 'I freeze when asked "what do you do?"' },
                  { value: 'Keeping conversations going', emoji: '🔄', desc: 'I run out of things to say' },
                  { value: 'Lack of confidence', emoji: '😰', desc: 'I feel like I don\'t belong' },
                  { value: 'Maintaining my network', emoji: '📱', desc: 'Following up feels awkward' },
                  { value: 'Knowing when/how to follow up', emoji: '📩', desc: 'What do I say after?' },
            ],
      },
];

export default function Onboarding() {
      const navigate = useNavigate();
      const { setProfile } = useUser();
      const [currentStep, setCurrentStep] = useState(0);
      const [answers, setAnswers] = useState({
            category: null,
            reason: null,
            difficulty: null,
      });

      const step = steps[currentStep];
      const answerKeys = ['category', 'reason', 'difficulty'];
      const currentKey = answerKeys[currentStep];
      const selectedValue = answers[currentKey];

      const handleSelect = (value) => {
            setAnswers(prev => ({ ...prev, [currentKey]: value }));
      };

      const handleNext = () => {
            if (!selectedValue) return;

            if (currentStep < steps.length - 1) {
                  setCurrentStep(prev => prev + 1);
            } else {
                  // Complete onboarding
                  setProfile({
                        category: answers.category,
                        reason: answers.reason,
                        difficulty: answers.difficulty,
                  });
                  navigate('/');
            }
      };

      const handleBack = () => {
            if (currentStep > 0) {
                  setCurrentStep(prev => prev - 1);
            }
      };

      return (
            <div className="page page--no-nav" id="onboarding-page">
                  {/* Progress */}
                  <div style={{ padding: 'var(--space-4) 0' }}>
                        <div className="flex items-center justify-between mb-3">
                              <div style={{ width: 40 }}>
                                    {currentStep > 0 && (
                                          <button className="btn-ghost" onClick={handleBack} style={{ padding: 'var(--space-1)' }}>
                                                <ArrowLeft size={20} />
                                          </button>
                                    )}
                              </div>
                              <span className="text-sm text-secondary">
                                    Step {currentStep + 1} of {steps.length}
                              </span>
                              <div style={{ width: 40 }} />
                        </div>
                        <div className="progress-bar">
                              <div
                                    className="progress-bar__fill"
                                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                              />
                        </div>
                  </div>

                  {/* Question */}
                  <div className="animate-fade-in" key={currentStep} style={{ marginTop: 'var(--space-6)' }}>
                        <h1 className="text-2xl mb-2">{step.question}</h1>
                        <p className="text-secondary mb-6" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-relaxed)' }}>
                              {step.subtitle}
                        </p>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                              {step.options.map((option, i) => (
                                    <button
                                          key={option.value}
                                          className={`card card--interactive animate-slide-up stagger-${i + 1}${selectedValue === option.value ? ' card--selected' : ''
                                                }`}
                                          onClick={() => handleSelect(option.value)}
                                          style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-4)',
                                                textAlign: 'left',
                                                width: '100%',
                                          }}
                                          id={`onboarding-option-${i}`}
                                    >
                                          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{option.emoji}</span>
                                          <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '2px' }}>
                                                      {option.value}
                                                </div>
                                                <div className="text-sm text-secondary">{option.desc}</div>
                                          </div>
                                          {selectedValue === option.value && (
                                                <ChevronRight size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                          )}
                                    </button>
                              ))}
                        </div>
                  </div>

                  {/* Continue Button */}
                  <div style={{ marginTop: 'var(--space-8)' }}>
                        <button
                              className={`btn btn-primary btn-full btn-lg${!selectedValue ? ' btn-disabled' : ''}`}
                              onClick={handleNext}
                              disabled={!selectedValue}
                              style={{
                                    opacity: selectedValue ? 1 : 0.5,
                                    cursor: selectedValue ? 'pointer' : 'not-allowed',
                              }}
                              id="onboarding-continue-btn"
                        >
                              {currentStep === steps.length - 1 ? "Let's Begin" : 'Continue'}
                              <ChevronRight size={20} />
                        </button>
                  </div>
            </div>
      );
}
