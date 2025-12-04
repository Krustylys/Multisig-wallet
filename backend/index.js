const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory store for demo
let proposals = [];

// GET /proposals
app.get('/proposals', (req, res) => {
  res.json(proposals);
});

// POST /proposals
app.post('/proposals', (req, res) => {
  const { title, value, owners = ['0xA1','0xB2','0xC3'], threshold = 2 } = req.body;
  if(!title) return res.status(400).json({ error: 'missing title' });
  const p = { id: nanoid(8), title, value, owners, threshold, approvals: [], executed: false, createdAt: Date.now() };
  proposals.unshift(p);
  res.json(p);
});

// POST /proposals/:id/approve
app.post('/proposals/:id/approve', (req, res) => {
  const { owner } = req.body;
  const p = proposals.find(x => x.id === req.params.id);
  if(!p) return res.status(404).json({ error: 'not found' });
  if(!p.owners.includes(owner)) return res.status(400).json({ error: 'not an owner' });
  if(p.approvals.includes(owner)) return res.status(400).json({ error: 'already approved' });
  p.approvals.push(owner);
  res.json(p);
});

// POST /proposals/:id/execute
app.post('/proposals/:id/execute', (req, res) => {
  const p = proposals.find(x => x.id === req.params.id);
  if(!p) return res.status(404).json({ error: 'not found' });
  if(p.executed) return res.status(400).json({ error: 'already executed' });
  if(p.approvals.length < p.threshold) return res.status(400).json({ error: 'not enough approvals' });
  p.executed = true;
  p.executedAt = Date.now();
  res.json(p);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on', PORT));
