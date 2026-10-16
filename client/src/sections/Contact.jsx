import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import { sendContactMessage } from '../api.js';
import { profile } from '../data/portfolio.js';

const EMPTY = { name: '', email: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.';
  if (message.trim().length < 10) errors.message = 'Your message should be at least 10 characters.';
  else if (message.length > 2000) errors.message = 'Please keep your message under 2000 characters.';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle | sending | success | error

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus({ state: 'sending', message: '' });
    try {
      const data = await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        website: form.website,
      });
      setStatus({ state: 'success', message: data.message });
      setForm(EMPTY);
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      setStatus({ state: 'error', message: err.message });
    }
  };

  const sending = status.state === 'sending';

  const field = (name, label, props = {}) => {
    const Tag = props.rows ? 'textarea' : 'input';
    const id = `contact-${name}`;
    return (
      <div className={`field${errors[name] ? ' has-error' : ''}`}>
        <label htmlFor={id}>{label}</label>
        <Tag
          id={id}
          name={name}
          value={form[name]}
          onChange={onChange}
          disabled={sending}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${id}-error` : undefined}
          {...props}
        />
        {errors[name] && (
          <span id={`${id}-error`} className="field-error" role="alert">{errors[name]}</span>
        )}
      </div>
    );
  };

  return (
    <section id="contact" className="section alt">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Let's work together"
          subtitle="Have an opportunity, a project idea or just want to say hi? My inbox is always open."
        />

        <div className="contact-grid">
          <Reveal direction="left" className="contact-info">
            <h3>Get in touch</h3>
            <p className="muted">
              I&apos;m currently looking for internships and fresher roles as a MERN stack developer. I usually reply
              within 24 hours.
            </p>
            <ul className="contact-list">
              <li>
                <span className="contact-icon"><FiMail aria-hidden="true" /></span>
                <div>
                  <span className="muted small">Email</span>
                  <a href={`mailto:${profile.email}`} className="link">{profile.email}</a>
                </div>
              </li>
              <li>
                <span className="contact-icon"><FiMapPin aria-hidden="true" /></span>
                <div>
                  <span className="muted small">Location</span>
                  <span>{profile.location}</span>
                </div>
              </li>
            </ul>
            <SocialLinks />
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <form className="contact-form card" onSubmit={onSubmit} noValidate>
              {field('name', 'Name', { type: 'text', autoComplete: 'name', placeholder: 'Your name', maxLength: 80 })}
              {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com', maxLength: 120 })}
              {field('message', 'Message', { rows: 5, placeholder: 'Tell me about your project or opportunity…', maxLength: 2000 })}

              {/* Honeypot: hidden from humans, bots tend to fill it in. */}
              <div className="visually-hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange} />
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={sending}>
                {sending ? (
                  <><FiLoader className="spin" aria-hidden="true" /> Sending…</>
                ) : (
                  <><FiSend aria-hidden="true" /> Send message</>
                )}
              </button>

              <AnimatePresence>
                {(status.state === 'success' || status.state === 'error') && (
                  <motion.p
                    key={status.state}
                    className={`form-status ${status.state}`}
                    role="status"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {status.state === 'success' ? <FiCheckCircle aria-hidden="true" /> : <FiAlertCircle aria-hidden="true" />}
                    {status.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
