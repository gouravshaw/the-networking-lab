import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const STORAGE_KEY = 'networking-lab-data';

const defaultState = {
      contacts: [],
      intros: { short: '', elevator: '', technical: '' },
      sessions: { count: 0, lastCompleted: null, history: [] },
      preferences: { category: null, reason: null, difficulty: null },
};

function loadState() {
      try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                  return { ...defaultState, ...JSON.parse(saved) };
            }
      } catch (e) {
            console.warn('Failed to load saved data:', e);
      }
      return defaultState;
}

function saveState(state) {
      try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
            console.warn('Failed to save data:', e);
      }
}

export function UserProvider({ children }) {
      const [state, setState] = useState(loadState);

      useEffect(() => {
            saveState(state);
      }, [state]);

      const addContact = (contact) => {
            const newContact = {
                  ...contact,
                  id: Date.now().toString(),
                  createdAt: new Date().toISOString(),
            };
            setState(prev => ({
                  ...prev,
                  contacts: [newContact, ...prev.contacts],
            }));
            return newContact;
      };

      const updateContact = (id, updates) => {
            setState(prev => ({
                  ...prev,
                  contacts: prev.contacts.map(c => c.id === id ? { ...c, ...updates } : c),
            }));
      };

      const deleteContact = (id) => {
            setState(prev => ({
                  ...prev,
                  contacts: prev.contacts.filter(c => c.id !== id),
            }));
      };

      const saveIntros = (intros) => {
            setState(prev => ({ ...prev, intros: { ...prev.intros, ...intros } }));
      };

      const setPreferences = (prefs) => {
            setState(prev => ({ ...prev, preferences: { ...prev.preferences, ...prefs } }));
      };

      const resetPreferences = () => {
            setState(prev => ({
                  ...prev,
                  preferences: { category: null, reason: null, difficulty: null },
            }));
      };

      const completeSession = (sessionData) => {
            setState(prev => ({
                  ...prev,
                  sessions: {
                        count: prev.sessions.count + 1,
                        lastCompleted: new Date().toISOString(),
                        history: [
                              { ...sessionData, completedAt: new Date().toISOString() },
                              ...prev.sessions.history,
                        ],
                  },
            }));
      };

      const prefs = state.preferences || defaultState.preferences;
      const hasCompletedSetup = !!(prefs.category && prefs.reason && prefs.difficulty);

      const value = {
            ...state,
            preferences: prefs,
            hasCompletedSetup,
            addContact,
            updateContact,
            deleteContact,
            saveIntros,
            setPreferences,
            resetPreferences,
            completeSession,
      };

      return (
            <UserContext.Provider value={value}>
                  {children}
            </UserContext.Provider>
      );
}

export function useUser() {
      const context = useContext(UserContext);
      if (!context) {
            throw new Error('useUser must be used within a UserProvider');
      }
      return context;
}

export default UserContext;
