import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const recipient = 'info@tovision.sa';
export function createApp({transporter, from, trustProxyHops = 0}) {
 const app = express();
 app.disable('x-powered-by');
 if (trustProxyHops > 0) app.set('trust proxy', trustProxyHops);
 app.use(express.json({limit: '2kb'}));
 app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
 app.post('/api/interest', rateLimit({windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false}), async (req, res) => {
  if (!req.is('application/json')) return res.status(415).json({message:'JSON required.'});
  const {email, website} = req.body ?? {};
  if (typeof email !== 'string' || email.length > 254 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(email.trim())) {
   return res.status(400).json({message:'A valid email address is required.'});
  }
  if (website) return res.status(400).json({message:'Unable to submit.'});
  if (!transporter || !from) return res.status(503).json({message:'Email service is not configured.'});
  const address = email.trim();
  try {
   const result = await transporter.sendMail({
    from, to: recipient, replyTo: address,
    subject: 'New interest from the ToVision landing page',
    text: `A visitor is interested in ToVision services.\n\nEmail: ${address}\nSubmitted: ${new Date().toISOString()}\nSource: Landing page contact form\n\nReply to this message to contact the visitor.`,
    disableFileAccess: true, disableUrlAccess: true
   });
   if (!result.accepted?.some(value => String(value).toLowerCase() === recipient)) throw new Error('Recipient not accepted');
   return res.json({message:'Interest notification accepted.'});
  } catch {
   console.error('Interest notification could not be accepted by SMTP.');
   return res.status(502).json({message:'Unable to send notification. Please try again later.'});
  }
 });
 app.use('/api', (_req,res) => res.status(404).json({message:'Not found.'}));
 const publicDirectory = fileURLToPath(new URL('../dist/home/browser/', import.meta.url));
 app.use(express.static(publicDirectory));
 app.get('/{*path}', (_req,res) => res.sendFile(path.join(publicDirectory,'index.html')));
 app.use((error, _req, res, _next) => res.status(error.status === 413 ? 413 : 400).json({message:'Invalid request.'}));
 return app;
}
