import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import CopyButton from '../components/CopyButton';
import { Edit3, Save, Sparkles } from 'lucide-react';

const introTypes = [
      { key: 'short', label: '10-Second', description: 'Quick, memorable intro' },
      { key: 'elevator', label: '30-Second', description: 'Elevator-style pitch' },
      { key: 'technical', label: 'Project', description: 'Technical or project focus' },
];

const fieldsByType = {
      short: [
            { key: 'whoIAm', label: 'Who I am', placeholder: "e.g. I'm a software engineer at Google" },
            { key: 'whatIDo', label: 'What I do', placeholder: 'e.g. I build tools that help developers ship faster' },
      ],
      elevator: [
            { key: 'whoIAm', label: 'Who I am', placeholder: "e.g. I'm a product manager at a fintech startup" },
            { key: 'whatIDo', label: 'What I do / have done', placeholder: 'e.g. I led the launch of our mobile payments platform' },
            { key: 'whatImExploring', label: "What I'm exploring", placeholder: 'e.g. how AI can improve fraud detection in real-time payments' },
      ],
      technical: [
            { key: 'whoIAm', label: 'Who I am', placeholder: "e.g. I'm a data scientist specialising in NLP" },
            { key: 'whatIDo', label: 'My current project', placeholder: 'e.g. building a sentiment analysis tool for customer feedback' },
            { key: 'whatImExploring', label: 'Technical challenge', placeholder: 'e.g. handling multilingual text with limited labelled data' },
            { key: 'impact', label: 'Impact / goal', placeholder: 'e.g. reducing manual review time by 60%' },
      ],
};

function generateIntro(type, values) {
      const parts = Object.values(values).filter(v => v && v.trim());
      if (parts.length === 0) return '';
      return parts.join('. ') + '.';
}

export default function IntroBuilder() {
      const { intros, saveIntros } = useUser();
      const [activeTab, setActiveTab] = useState('short');
      const [editing, setEditing] = useState(false);
      const [values, setValues] = useState(() => {
            // Try to parse saved intros into field values
            return {
                  short: { whoIAm: '', whatIDo: '' },
                  elevator: { whoIAm: '', whatIDo: '', whatImExploring: '' },
                  technical: { whoIAm: '', whatIDo: '', whatImExploring: '', impact: '' },
            };
      });

      const fields = fieldsByType[activeTab];
      const currentValues = values[activeTab];
      const generatedIntro = useMemo(
            () => generateIntro(activeTab, currentValues),
            [activeTab, currentValues]
      );

      const handleFieldChange = (key, value) => {
            setValues(prev => ({
                  ...prev,
                  [activeTab]: { ...prev[activeTab], [key]: value },
            }));
      };

      const handleSave = () => {
            saveIntros({
                  [activeTab]: generatedIntro,
            });
            setEditing(false);
      };

      const savedIntro = intros[activeTab];
      const displayIntro = generatedIntro || savedIntro;

      return (
            <div className="page" id="intro-builder-page">
                  <div style={{ paddingTop: 'var(--space-4)' }}>
                        <h1 className="text-2xl mb-2 animate-slide-up">My Introduction</h1>
                        <p className="text-secondary mb-6 animate-slide-up stagger-1">
                              Build clear, confident intros for any situation.
                        </p>
                  </div>

                  {/* Tabs */}
                  <div className="tabs animate-slide-up stagger-2">
                        {introTypes.map(({ key, label }) => (
                              <button
                                    key={key}
                                    className={`tab${activeTab === key ? ' tab--active' : ''}`}
                                    onClick={() => setActiveTab(key)}
                              >
                                    {label}
                              </button>
                        ))}
                  </div>

                  {/* Type Description */}
                  <div className="text-sm text-secondary mb-5">
                        {introTypes.find(t => t.key === activeTab)?.description}
                  </div>

                  {/* Fields */}
                  <div className="animate-fade-in" key={activeTab}>
                        {fields.map((field, i) => (
                              <div key={field.key} className={`form-group animate-slide-up stagger-${i + 1}`}>
                                    <label className="form-label">{field.label}</label>
                                    <input
                                          className="form-input"
                                          value={currentValues[field.key] || ''}
                                          onChange={e => handleFieldChange(field.key, e.target.value)}
                                          placeholder={field.placeholder}
                                    />
                              </div>
                        ))}
                  </div>

                  {/* Generated Output */}
                  {displayIntro && (
                        <div className="card card--elevated animate-scale-in mt-6" style={{
                              background: 'linear-gradient(135deg, var(--color-sage-50), var(--color-warm-50))',
                              borderColor: 'var(--color-sage-200)',
                        }}>
                              <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                          <Sparkles size={16} color="var(--color-primary)" />
                                          <span className="text-sm" style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-sage-600)' }}>
                                                Your {introTypes.find(t => t.key === activeTab)?.label} Intro
                                          </span>
                                    </div>
                                    <CopyButton text={displayIntro} />
                              </div>
                              <p style={{
                                    fontSize: 'var(--font-size-md)',
                                    lineHeight: 'var(--line-height-relaxed)',
                                    color: 'var(--color-sage-800)',
                                    fontWeight: 'var(--font-weight-medium)',
                              }}>
                                    "{displayIntro}"
                              </p>
                        </div>
                  )}

                  {/* Save Button */}
                  {generatedIntro && (
                        <button
                              className="btn btn-primary btn-full mt-5"
                              onClick={handleSave}
                              id="save-intro-btn"
                        >
                              <Save size={18} />
                              Save Introduction
                        </button>
                  )}

                  {/* Tips */}
                  <div className="card card--accent mt-6 animate-slide-up stagger-5" style={{ background: 'var(--color-warm-50)' }}>
                        <div className="text-sm text-secondary mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                              💡 Tips for a great intro
                        </div>
                        <ul className="text-sm" style={{ lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-secondary)' }}>
                              <li style={{ marginBottom: 'var(--space-1)' }}>• Keep it natural — don't memorise, just know the structure</li>
                              <li style={{ marginBottom: 'var(--space-1)' }}>• End with something you're curious about — it invites conversation</li>
                              <li>• Practice saying it out loud a few times before an event</li>
                        </ul>
                  </div>
            </div>
      );
}
