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

  // Floating-label field: the label sits inside the input and rises when focused or filled.
  // (placeholder=" " lets CSS detect "filled" via :placeholder-shown.)
  const field = (name, label, props = {}) => {
    const Tag = props.rows ? 'textarea' : 'input';
    const id = `contact-${name}`;
    return (
      <div className={`float-field${props.rows ? ' is-area' : ''}${errors[name] ? ' has-error' : ''}`}>
        <Tag
          id={id}
          name={name}
          value={form[name]}
          onChange={onChange}
          disabled={sending}
          placeholder=" "
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${id}-error` : undefined}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
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

        {/* Glass panel adapted from a Uiverse.io form by sameer2malik */}
        <Reveal className="contact-glass">
          <form className="contact-form-glass" onSubmit={onSubmit} noValidate>
            <h3 className="contact-form-title">Send me a message</h3>
            {field('name', 'Your name', { type: 'text', autoComplete: 'name', maxLength: 80 })}
            {field('email', 'Email address', { type: 'email', autoComplete: 'email', maxLength: 120 })}
            {field('message', 'Tell me about your project or opportunity', { rows: 5, maxLength: 2000 })}

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

          <aside className="contact-side">
            <PaperPlane flying={status.state === 'success'} />
            <h3>Get in touch</h3>
            <p>
              I&apos;m currently looking for internships and fresher roles as a MERN stack developer. I usually reply
              within 24 hours.
            </p>
            <ul className="contact-list">
              <li>
                <span className="contact-icon"><FiMail aria-hidden="true" /></span>
                <div>
                  <span className="small contact-label">Email</span>
                  <a href={`mailto:${profile.email}`} className="contact-value">{profile.email}</a>
                </div>
              </li>
              <li>
                <span className="contact-icon"><FiMapPin aria-hidden="true" /></span>
                <div>
                  <span className="small contact-label">Location</span>
                  <span className="contact-value">{profile.location}</span>
                </div>
              </li>
            </ul>
            <SocialLinks className="contact-socials" />
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

/** Paper plane on the orb: bobs gently, and flies off (then glides back) when a message is sent. */
function PaperPlane({ flying }) {
  return (
    <motion.svg
      className="paper-plane"
      viewBox="0 0 64 64"
      aria-hidden="true"
      animate={
        flying
          ? { x: [0, 40, 280, -220, 0], y: [0, -30, -230, 60, 0], rotate: [0, -10, -25, 10, 0], opacity: [1, 1, 0, 0, 1] }
          : { x: 0, y: [0, -8, 0], rotate: 0, opacity: 1 }
      }
      transition={
        flying
          ? { duration: 3, times: [0, 0.15, 0.45, 0.5, 1], ease: 'easeInOut' }
          : { y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }, default: { duration: 0.8 } }
      }
    >
      <path d="M4 30 60 6 44 58 32 38Z" fill="#ffffff" />
      <path d="M32 38 60 6 24 34Z" fill="#c4b5fd" />
      <path d="M32 38 28 52 24 34Z" fill="#a78bfa" />
    </motion.svg>
  );
}
