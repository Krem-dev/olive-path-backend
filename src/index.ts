import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import sequelize from './db/connection';
import './models'; // load model associations

import { errorHandler, notFound } from './middleware/error';
import { asyncHandler } from './utils/asyncHandler';
import { webhook as paystackWebhook } from './modules/payments/payments.controller';

// Module routers
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import booksRoutes from './modules/books/books.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import sermonsRoutes from './modules/sermons/sermons.routes';
import devotionsRoutes from './modules/devotions/devotions.routes';
import qaRoutes from './modules/qa/qa.routes';
import announcementsRoutes from './modules/announcements/announcements.routes';
import programsRoutes from './modules/programs/programs.routes';
import bookmarksRoutes from './modules/bookmarks/bookmarks.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import prayersRoutes from './modules/prayers/prayers.routes';
import bookingsRoutes from './modules/bookings/bookings.routes';

const app = express();

// ── Global middleware ──
app.use(helmet());
app.use(cors());

// Paystack webhook needs the raw body so we can verify the HMAC signature.
// MUST be mounted BEFORE express.json().
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(paystackWebhook),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.isDev) app.use(morgan('dev'));

// ── Health ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', environment: config.nodeEnv });
});

// ── Public read endpoints ──
app.use('/api/auth', authRoutes);
app.use('/api/sermons', sermonsRoutes);
app.use('/api/devotions', devotionsRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/programs', programsRoutes);

// ── Authenticated endpoints ──
app.use('/api/users', usersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/prayers', prayersRoutes);
app.use('/api/bookings', bookingsRoutes);

// ── Errors ──
app.use(notFound);
app.use(errorHandler);

// ── Boot ──
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    if (config.isDev) {
      await sequelize.sync({ alter: true });
      console.log('Database tables synced.');
    }

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
