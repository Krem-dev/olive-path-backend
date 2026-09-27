import { readFileSync } from 'fs';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (jsonEnv) {
    initializeApp({ credential: cert(JSON.parse(jsonEnv)) });
  } else if (filePath) {
    const raw = readFileSync(filePath, 'utf8');
    initializeApp({ credential: cert(JSON.parse(raw)) });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp();
  }
}
