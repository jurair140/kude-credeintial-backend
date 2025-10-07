import express from 'express';
import fs from 'fs';
import path from 'path';

export const router = express.Router();
const dbPath = path.join(__dirname, 'db.json');
const workerId = process.env.WORKER_ID || 'worker-1';

if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));

router.post('/issue', (req, res) => {
  const credential = req.body;
  if (!credential.id) return res.status(400).json({ error: 'Credential must have an id' });

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const exists = db.find((c: any) => c.id === credential.id);

  if (exists) return res.json({ message: 'Credential already issued', worker: exists.worker });

  const newCredential = { ...credential, issuedAt: new Date(), worker: workerId };
  db.push(newCredential);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.json({ message: 'Credential issued', worker: workerId });
});

router.post('/verify', (req, res) => {
  const credential = req.body;
  if (!credential.id) return res.status(400).json({ error: 'Credential must have an id' });

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const found = db.find((c: any) => c.id === credential.id);

  if (!found) return res.json({ valid: false });

  res.json({ valid: true, worker: found.worker, issuedAt: found.issuedAt });
});
