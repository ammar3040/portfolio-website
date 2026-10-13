'use client';

import React, { useState } from 'react';

const CONTACT_EMAIL = 'ammar15102004@gmail.com';

function DaisySVG() {
  const petals = [];
  for (let i = 0; i < 12; i++) {
    petals.push(
      <g key={i} transform={`translate(48 36) rotate(${i * 30})`}>
        <ellipse cx="0" cy="-19" rx="7.5" ry="15.5" fill="#faf5e6" stroke="#e2d5b0" strokeWidth="1" />
      </g>
    );
  }
  return (
    <svg className="cd-daisy" viewBox="0 0 96 152" width="76" height="152" aria-hidden="true">
      <g filter="url(#ft-paint)">
        <path d="M48 150 C 54 112 42 78 48 46" stroke="#b06a4d" strokeWidth="4.2" fill="none" strokeLinecap="round"/>
        <path d="M48 148 Q 30 132 24 106" stroke="#33361a" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        <path d="M48 148 Q 66 134 71 110" stroke="#3c4020" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        {petals}
        <circle cx="48" cy="36" r="9.5" fill="#e89a1c"/>
        <circle cx="45" cy="33" r="1.4" fill="#f6c740"/>
        <circle cx="51" cy="38" r="1.3" fill="#b9791a"/>
        <circle cx="50" cy="32" r="1.2" fill="#b9791a"/>
        <circle cx="44" cy="39" r="1.4" fill="#f6c740"/>
        <circle cx="48" cy="36" r="1.3" fill="#b9791a"/>
      </g>
    </svg>
  );
}

export default function ContactDrawer({ isOpen, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;

    setSubmitting(true);
    try {
      const emailSend = await fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          _subject: '🚀 New Client Lead — ' + data.name,
          _replyto: data.email,
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (!emailSend.ok) throw new Error('Send failed');
      setSubmitted(true);
    } catch (err) {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`contact-scrim ${isOpen ? 'open' : ''}`}
        id="contact-scrim"
        onClick={onClose}
      />
      <aside
        className={`contact-drawer ${isOpen ? 'open' : ''}`}
        id="contact-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cd-title"
      >
        <button className="cd-close" id="cd-close" aria-label="Close contact panel" onClick={onClose} />

        <div className="cd-body">
          <p className="cd-eyebrow">
            <span className="cd-dot" aria-hidden="true" />
            AVAILABLE FOR NEW PROJECTS &amp; RETAINERS
          </p>
          <h2 className="cd-title" id="cd-title">Build together?</h2>
          <p className="cd-intro">
            Tell me what you're building — a full-stack product, an API architecture, or a weekly retainer slot. I'll write back within 24 hours.
          </p>

          {!submitted ? (
            <form className="cd-form" id="cd-form" onSubmit={handleSubmit}>
              <input type="text" name="_honey" className="cd-honey" tabIndex="-1" autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
              <div className="cd-fields">
                <div className="cd-field">
                  <label className="cd-label" htmlFor="cd-name">YOUR NAME</label>
                  <input className="cd-input" id="cd-name" name="name" type="text" required placeholder="John Doe" autoComplete="name" />
                </div>
                <div className="cd-field">
                  <label className="cd-label" htmlFor="cd-email">EMAIL</label>
                  <input className="cd-input" id="cd-email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
                </div>
                <div className="cd-field">
                  <label className="cd-label" htmlFor="cd-msg">WHAT ARE WE MAKING?</label>
                  <textarea className="cd-input cd-textarea" id="cd-msg" name="message" rows="3" required placeholder="A few lines about your project, timeline, or requirements"></textarea>
                </div>
              </div>
              <button className="cd-send" type="submit" disabled={submitting}>
                <span className="cd-send-label">{submitting ? 'Sending…' : 'Send it over'}</span>
                <img src="/assets/imgEmail.svg" alt="" width="20" height="20" />
              </button>
              {error && (
                <p className="cd-error">
                  Hmm, that didn't send. Email me directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              )}
            </form>
          ) : (
            <div className="cd-done show">
              <DaisySVG />
              <h3 className="cd-done-title">Received!</h3>
              <p className="cd-done-copy">Your note is on its way. I'll write back within 24 hours.</p>
            </div>
          )}
        </div>

        <div className="cd-alt">
          <svg className="cd-wavy" viewBox="0 0 1440 198" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 4.15182L46.4 23.4471C91.2 42.7424 175.3 94.0468 266.5 74.7515C359.3 55.4562 446.5 33.4304 548.8 33.4304C651.1 33.4304 731.2 68.4695 822.4 94.1965C913.6 119.924 1006.4 65.6287 1097.6 65.6287C1188.8 65.6287 1280 119.924 1371.2 87.7648C1462.4 55.6059 1553.6 29.8789 1646.4 10.5836C1739.2 -8.71166 1828.8 -1.41153 1873.6 30.7473L1920 57.5792V197.105H1873.6C1828.8 197.105 1737.6 197.105 1646.4 197.105C1553.6 197.105 1462.4 197.105 1371.2 197.105C1280 197.105 1188.8 197.105 1097.6 197.105C1006.4 197.105 913.6 197.105 822.4 197.105C731.2 197.105 640 197.105 548.8 197.105C457.6 197.105 366.4 197.105 273.6 197.105C182.4 197.105 91.2 197.105 46.4 197.105H0V4.15182Z"/>
          </svg>
          <p className="cd-alt-label">PREFER DIRECT CONTACT?</p>
          <a className="cd-alt-mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <nav className="cd-alt-social" aria-label="Social links">
            <a href="https://www.linkedin.com/in/ammar-shaikh-747897250" target="_blank" rel="noopener">LinkedIn&nbsp;↗</a>
            <a href="https://github.com/ammar3040" target="_blank" rel="noopener">GitHub&nbsp;↗</a>
            <a href="https://wa.me/919898326125" target="_blank" rel="noopener">WhatsApp&nbsp;↗</a>
            <a href="https://www.instagram.com/ammar_3040/" target="_blank" rel="noopener">Instagram&nbsp;↗</a>
          </nav>
        </div>
      </aside>
    </>
  );
}
