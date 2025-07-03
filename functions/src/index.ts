
'use server';
import { https } from 'firebase-functions';
import next from 'next';
import path from 'path';

// Initialize Next.js app
const nextApp = next({
  dev: false,
  conf: {
    distDir: path.join(path.dirname(__dirname), '.next'),
  },
});
const nextHandle = nextApp.getRequestHandler();

// Cloud Function to serve Next.js app
export const nextServer = https.onRequest((req, res) => {
  return nextApp.prepare().then(() => nextHandle(req, res));
});

// You can keep your other functions, like the Genkit ones, here as well.
// For example:
// export * from './genkit-sample';
