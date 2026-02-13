import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy' }) {
      const [copied, setCopied] = useState(false);

      const handleCopy = useCallback(async () => {
            try {
                  await navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                  // Fallback for older browsers
                  const textarea = document.createElement('textarea');
                  textarea.value = text;
                  textarea.style.position = 'fixed';
                  textarea.style.opacity = '0';
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textarea);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
            }
      }, [text]);

      return (
            <button
                  className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
                  onClick={handleCopy}
                  type="button"
            >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : label}
            </button>
      );
}
