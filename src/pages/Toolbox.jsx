import React, { useState } from 'react';
import { toolboxCategories } from '../data/toolboxContent';
import CopyButton from '../components/CopyButton';
import {
      Users,
      Monitor,
      Linkedin,
      Reply,
      LogOut,
} from 'lucide-react';

const iconMap = {
      Users,
      Monitor,
      Linkedin,
      Reply,
      LogOut,
};

export default function Toolbox() {
      const [activeTab, setActiveTab] = useState('in-person');
      const activeCategory = toolboxCategories.find(c => c.id === activeTab);

      return (
            <div className="page" id="toolbox-page">
                  <div style={{ paddingTop: 'var(--space-4)' }}>
                        <h1 className="text-2xl mb-2 animate-slide-up">Tools</h1>
                        <p className="text-secondary mb-6 animate-slide-up stagger-1">
                              Ready-to-use lines for every situation.
                        </p>
                  </div>

                  {/* Category Tabs */}
                  <div className="tabs animate-slide-up stagger-2">
                        {toolboxCategories.map(({ id, label }) => (
                              <button
                                    key={id}
                                    className={`tab${activeTab === id ? ' tab--active' : ''}`}
                                    onClick={() => setActiveTab(id)}
                              >
                                    {label}
                              </button>
                        ))}
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-3 animate-fade-in" key={activeTab}>
                        {activeCategory?.items.map((item, i) => (
                              <div
                                    key={item.id}
                                    className={`card animate-slide-up stagger-${Math.min(i + 1, 8)}`}
                              >
                                    <div className="flex justify-between items-center gap-3">
                                          <div style={{ flex: 1 }}>
                                                <p style={{
                                                      fontWeight: 'var(--font-weight-medium)',
                                                      marginBottom: 'var(--space-1)',
                                                      lineHeight: 'var(--line-height-relaxed)',
                                                }}>
                                                      "{item.text}"
                                                </p>
                                                <span className="text-xs text-tertiary">{item.tip}</span>
                                          </div>
                                          <CopyButton text={item.text} />
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      );
}
