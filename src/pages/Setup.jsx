import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowRight, Check } from 'lucide-react';

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

export default function Setup() {
      const navigate = useNavigate();
      const { setPreferences } = useUser();
      const [step, setStep] = useState(0);
      const [answers, setAnswers] = useState({});

      const current = QUESTIONS[step];
      const selected = answers[current.key] || null;
      const isLast = step === QUESTIONS.length - 1;
      const allAnswered = QUESTIONS.every(q => answers[q.key]);

      const handleSelect = (value) => {
            setAnswers(prev => ({ ...prev, [current.key]: value }));
      };

      const handleContinue = () => {
            if (!selected) return;

            if (isLast) {
                  setPreferences(answers);
                  navigate('/', { replace: true });
            } else {
                  setStep(prev => prev + 1);
            }
      };

      return (
            <div className="page page--no-nav page--centered" id="setup-page">
                  <div style={{ maxWidth: 440, width: '100%' }}>
                        {/* Progress */}
                        <div className="step-indicator mb-8">
                              {QUESTIONS.map((_, i) => (
                                    <div
                                          key={i}
                                          className={`step-dot${i === step ? ' step-dot--active' : ''}${i < step ? ' step-dot--done' : ''}`}
                                    />
                              ))}
                        </div>

                        {/* Question */}
                        <div className="animate-fade-in" key={step}>
                              <h1 className="text-xl mb-6" style={{ textAlign: 'center' }}>
                                    {current.question}
                              </h1>

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

                        {/* Continue */}
                        <button
                              className="btn btn-primary btn-full mt-8"
                              onClick={handleContinue}
                              disabled={!selected}
                              style={{ opacity: selected ? 1 : 0.5 }}
                              id="setup-continue-btn"
                        >
                              {isLast ? 'Get Started' : 'Continue'}
                              <ArrowRight size={18} />
                        </button>

                        {/* Step back */}
                        {step > 0 && (
                              <button
                                    className="btn btn-secondary btn-full mt-3"
                                    onClick={() => setStep(prev => prev - 1)}
                              >
                                    Back
                              </button>
                        )}
                  </div>
            </div>
      );
}
