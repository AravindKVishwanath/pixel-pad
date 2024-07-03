const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// In-memory store for notes
const notes = {};
const users = [{ username: 'Karthik', password: 'karthik', name: 'Karthik' } ,{username: 'Abhigna', password: 'Abhigna', name: 'Abhigna'},{username: 'Aravind', password: 'Aravind', name: 'Aravind'}];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.json({ success: true, name: user.name });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

// Endpoint to create a new note
app.post('/notes', (req, res) => {
  const { title, content, drawing } = req.body;
  const id = shortid.generate();
  const note = { title, content, drawing };
  notes[id] = note;

  const filePath = path.join(__dirname, 'public', 'notes', `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(note), 'utf8');

  res.json({ id, url: `/notes/${id}` });
});

// Endpoint to get a note by ID
app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  const note = notes[id] || JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'notes', `${id}.json`), 'utf8'));

  if (note) {
    res.send(`
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body{
                display:flex,
                align-items:center,
                justify-content:center
            }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <p>${note.content}</p>
          <img src="${note.drawing}" alt="Drawing">
        </body>
      </html>
    `);
  } else {
    res.status(404).send('Note not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
