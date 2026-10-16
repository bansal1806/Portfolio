import Message from '../models/Message.js';
import { isDBConnected } from '../config/db.js';
import { sendContactNotification } from '../utils/mailer.js';

// POST /api/contact
export async function createMessage(req, res, next) {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ success: false, message: 'Database unavailable, please try again later.' });
    }

    const { name, email, message, website } = req.body ?? {};

    // Honeypot field: real users never fill it in, bots usually do.
    if (website) return res.status(201).json({ success: true, message: 'Message received!' });

    const saved = await Message.create({ name, email, message, ip: req.ip });

    // Email is best-effort — never fail the request because SMTP is down.
    sendContactNotification(saved).catch((err) => console.error('[mail] Failed to send:', err.message));

    return res.status(201).json({
      success: true,
      message: "Thanks for reaching out! I'll get back to you soon.",
      data: { id: saved._id, createdAt: saved.createdAt },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    return next(err);
  }
}
