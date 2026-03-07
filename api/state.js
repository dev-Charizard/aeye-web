// api/state.js — GET current dashboard state
import { kv } from '@vercel/kv';

const DEFAULT_STATE = {
  isLive: true,
  currentFocus: "Anthropic API Integration",
  currentFocusMeta: "Module: Aeye React Native App · Est. completion: today",
  transmission: "connecting Aeye to the brain. API going in tonight. the eye learns.",
  phase: "PHASE 2 — CORE INTELLIGENCE",
  phaseProgress: 60,
  tasks: [
    { name: "Anthropic API integration", status: "active", pct: 40 },
    { name: "Personality imprint engine", status: "done", pct: 100 },
    { name: "Eye animation system", status: "done", pct: 100 },
    { name: "Input screen bug fixes", status: "active", pct: 65 },
    { name: "Push to TestFlight", status: "queued", pct: 0 },
    { name: "Token marketing toolkit", status: "queued", pct: 15 }
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const state = await kv.get('dashboard_state');
      return res.status(200).json(state || DEFAULT_STATE);
    } catch (e) {
      return res.status(200).json(DEFAULT_STATE);
    }
  }

  if (req.method === 'POST') {
    const authHeader = req.headers['authorization'];
    const password = authHeader?.replace('Bearer ', '');
    if (password !== process.env.DASHBOARD_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const body = req.body;
      await kv.set('dashboard_state', body);
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to save state' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
