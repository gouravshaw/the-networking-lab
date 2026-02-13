import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Plus, Search, MapPin, Calendar, ChevronRight, Users } from 'lucide-react';

function formatDate(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isFollowUpDue(followUpDate) {
      if (!followUpDate) return false;
      return new Date(followUpDate) <= new Date();
}

export default function Contacts() {
      const navigate = useNavigate();
      const { contacts } = useUser();
      const [searchQuery, setSearchQuery] = useState('');

      const filtered = useMemo(() => {
            if (!searchQuery.trim()) return contacts;
            const q = searchQuery.toLowerCase();
            return contacts.filter(c =>
                  c.name.toLowerCase().includes(q) ||
                  (c.company && c.company.toLowerCase().includes(q)) ||
                  (c.role && c.role.toLowerCase().includes(q)) ||
                  (c.where && c.where.toLowerCase().includes(q))
            );
      }, [contacts, searchQuery]);

      return (
            <div className="page" id="contacts-page">
                  <div style={{ paddingTop: 'var(--space-4)' }}>
                        <div className="flex items-center justify-between mb-4">
                              <h1 className="text-2xl animate-slide-up">Contacts</h1>
                              <button
                                    className="btn btn-primary btn-sm animate-slide-up stagger-1"
                                    onClick={() => navigate('/contacts/new')}
                                    id="add-contact-btn"
                              >
                                    <Plus size={16} />
                                    Add
                              </button>
                        </div>
                  </div>

                  {/* Search */}
                  {contacts.length > 0 && (
                        <div className="mb-5 animate-slide-up stagger-2" style={{ position: 'relative' }}>
                              <Search
                                    size={16}
                                    style={{
                                          position: 'absolute',
                                          left: 'var(--space-3)',
                                          top: '50%',
                                          transform: 'translateY(-50%)',
                                          color: 'var(--color-text-tertiary)',
                                    }}
                              />
                              <input
                                    className="form-input"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search contacts..."
                                    style={{ paddingLeft: 'var(--space-10)' }}
                                    id="contacts-search"
                              />
                        </div>
                  )}

                  {/* Contact List */}
                  {filtered.length > 0 ? (
                        <div className="flex flex-col gap-3">
                              {filtered.map((contact, i) => (
                                    <button
                                          key={contact.id}
                                          className={`card card--elevated card--interactive animate-slide-up stagger-${Math.min(i + 1, 8)}`}
                                          onClick={() => navigate(`/contacts/${contact.id}`)}
                                          style={{ textAlign: 'left', width: '100%' }}
                                    >
                                          <div className="flex items-center gap-3">
                                                <div style={{
                                                      width: 40,
                                                      height: 40,
                                                      borderRadius: 'var(--radius-md)',
                                                      background: 'var(--color-primary-light)',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      flexShrink: 0,
                                                      color: 'var(--color-primary)',
                                                      fontWeight: 'var(--font-weight-semibold)',
                                                      fontSize: 'var(--font-size-md)',
                                                }}>
                                                      {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                                      <div className="flex items-center gap-2">
                                                            <span style={{
                                                                  fontWeight: 'var(--font-weight-semibold)',
                                                                  fontSize: 'var(--font-size-md)',
                                                            }}>
                                                                  {contact.name}
                                                            </span>
                                                            {isFollowUpDue(contact.followUpDate) && (
                                                                  <span className="chip" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                                                        Follow up
                                                                  </span>
                                                            )}
                                                      </div>
                                                      <div className="text-sm text-secondary" style={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                      }}>
                                                            {[contact.role, contact.company].filter(Boolean).join(' at ') ||
                                                                  (contact.where && (
                                                                        <span className="flex items-center gap-1">
                                                                              <MapPin size={12} />
                                                                              {contact.where}
                                                                        </span>
                                                                  )) ||
                                                                  'No details yet'}
                                                      </div>
                                                </div>
                                                <ChevronRight size={16} color="var(--color-text-tertiary)" />
                                          </div>
                                    </button>
                              ))}
                        </div>
                  ) : contacts.length === 0 ? (
                        <div className="empty-state animate-fade-in">
                              <Users size={48} />
                              <h3 className="text-lg mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                    No contacts yet
                              </h3>
                              <p className="text-sm text-secondary mb-5">
                                    People you meet during networking sessions will appear here.
                              </p>
                              <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/contacts/new')}
                              >
                                    <Plus size={16} />
                                    Add your first contact
                              </button>
                        </div>
                  ) : (
                        <div className="empty-state animate-fade-in">
                              <Search size={36} />
                              <p className="text-sm text-secondary mt-3">
                                    No contacts matching "{searchQuery}"
                              </p>
                        </div>
                  )}
            </div>
      );
}
