import nodemailer from 'nodemailer';
import { createApp } from './app.mjs';
const configured = ['SMTP_HOST','SMTP_USER','SMTP_PASS','SMTP_FROM'].every(key => process.env[key]);
const transporter = configured ? nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: Number(process.env.SMTP_PORT || 587),
 secure: process.env.SMTP_SECURE === 'true',
 requireTLS: process.env.SMTP_SECURE !== 'true',
 auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS},
 connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000
}) : null;
if (!configured) console.warn('SMTP settings are missing; contact submissions return 503 until configured.');
const app = createApp({transporter, from:process.env.SMTP_FROM, trustProxyHops: Number(process.env.TRUST_PROXY_HOPS || 0)});
app.listen(Number(process.env.PORT || 3000), () => console.log('ToVision server is ready.'));
