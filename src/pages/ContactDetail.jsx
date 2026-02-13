import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react';

export default function ContactDetail() {
      const navigate = useNavigate();
      const { id } = useParams();
      const { contacts, addContact, updateContact, deleteContact } = useUser();
      const isNew = id === 'new';
      const existing = !isNew ? contacts.find(c => c.id === id) : null;

      const [form, setForm] = useState({
            name: '',
            role: '',
            company: '',
            where: '',
            notes: '',
            followUpDate: '',
      });
      const [showDelete, setShowDelete] = useState(false);

      useEffect(() => {
            if (existing) {
                  setForm({
                        name: existing.name || '',
                        role: existing.role || '',
                        company: existing.company || '',
                        where: existing.where || '',
                        notes: existing.notes || '',
                        followUpDate: existing.followUpDate || '',
                  });
            }
      }, [existing]);

      // If contact doesn't exist and not new, redirect
      if (!isNew && !existing) {
            navigate('/contacts');
            return null;
      }

      const handleChange = (key, value) => {
            setForm(prev => ({ ...prev, [key]: value }));
      };

      const handleSave = () => {
            if (!form.name.trim()) return;

            if (isNew) {
                  addContact(form);
            } else {
                  updateContact(id, form);
            }
            navigate('/contacts');
      };

      const handleDelete = () => {
            deleteContact(id);
            navigate('/contacts');
      };

      return (
            <div className="page" id="contact-detail-page">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6" style={{ paddingTop: 'var(--space-4)' }}>
                        <button className="page-header__back" onClick={() => navigate('/contacts')}>
                              <ArrowLeft size={18} />
                              Back
                        </button>
                        <h2 className="text-lg" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                              {isNew ? 'New Contact' : 'Edit Contact'}
                        </h2>
                        <div style={{ width: 60 }} />
                  </div>

                  {/* Avatar */}
                  <div className="text-center mb-6 animate-scale-in">
                        <div style={{
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              background: 'var(--color-primary-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              color: 'var(--color-primary)',
                              fontSize: 'var(--font-size-2xl)',
                              fontWeight: 'var(--font-weight-semibold)',
                        }}>
                              {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                        </div>
                  </div>

                  {/* Form */}
                  <div className="animate-slide-up stagger-1">
                        <div className="form-group">
                              <label className="form-label">Name *</label>
                              <input
                                    className="form-input"
                                    value={form.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    placeholder="Full name"
                                    id="contact-name-input"
                              />
                        </div>

                        <div className="form-group">
                              <label className="form-label">Role</label>
                              <input
                                    className="form-input"
                                    value={form.role}
                                    onChange={e => handleChange('role', e.target.value)}
                                    placeholder="e.g. Software Engineer"
                              />
                        </div>

                        <div className="form-group">
                              <label className="form-label">Company</label>
                              <input
                                    className="form-input"
                                    value={form.company}
                                    onChange={e => handleChange('company', e.target.value)}
                                    placeholder="e.g. Google"
                              />
                        </div>

                        <div className="form-group">
                              <label className="form-label">Where met</label>
                              <input
                                    className="form-input"
                                    value={form.where}
                                    onChange={e => handleChange('where', e.target.value)}
                                    placeholder="e.g. Tech Meetup London"
                              />
                        </div>

                        <div className="form-group">
                              <label className="form-label">Notes</label>
                              <textarea
                                    className="form-input"
                                    value={form.notes}
                                    onChange={e => handleChange('notes', e.target.value)}
                                    placeholder="What did you talk about? Any follow-up actions?"
                                    rows={4}
                              />
                        </div>

                        <div className="form-group">
                              <label className="form-label">Follow-up date</label>
                              <input
                                    className="form-input"
                                    type="date"
                                    value={form.followUpDate}
                                    onChange={e => handleChange('followUpDate', e.target.value)}
                              />
                        </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 animate-slide-up stagger-3">
                        <button
                              className="btn btn-primary btn-full btn-lg"
                              onClick={handleSave}
                              disabled={!form.name.trim()}
                              style={{
                                    opacity: form.name.trim() ? 1 : 0.5,
                                    cursor: form.name.trim() ? 'pointer' : 'not-allowed',
                              }}
                              id="save-contact-btn"
                        >
                              <Save size={18} />
                              {isNew ? 'Save Contact' : 'Update Contact'}
                        </button>

                        {!isNew && (
                              <>
                                    {!showDelete ? (
                                          <button
                                                className="btn btn-ghost btn-full mt-4"
                                                onClick={() => setShowDelete(true)}
                                                style={{ color: 'var(--color-error)' }}
                                          >
                                                <Trash2 size={16} />
                                                Delete Contact
                                          </button>
                                    ) : (
                                          <div className="card mt-4 animate-scale-in" style={{
                                                borderColor: 'var(--color-error)',
                                                background: 'var(--color-error-light)',
                                          }}>
                                                <div className="flex items-center gap-2 mb-3">
                                                      <AlertTriangle size={16} color="var(--color-error)" />
                                                      <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-error)' }}>
                                                            Delete this contact?
                                                      </span>
                                                </div>
                                                <p className="text-sm text-secondary mb-3">This action cannot be undone.</p>
                                                <div className="flex gap-3">
                                                      <button className="btn btn-secondary" onClick={() => setShowDelete(false)} style={{ flex: 1 }}>
                                                            Cancel
                                                      </button>
                                                      <button
                                                            className="btn btn-full"
                                                            onClick={handleDelete}
                                                            style={{ flex: 1, background: 'var(--color-error)', color: 'white' }}
                                                            id="confirm-delete-btn"
                                                      >
                                                            Delete
                                                      </button>
                                                </div>
                                          </div>
                                    )}
                              </>
                        )}
                  </div>
            </div>
      );
}
