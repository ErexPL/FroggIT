const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: '0'
}));

app.use((err, req, res, next) => {
  console.error('Static file error:', err);
  next(err);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'gallery.html'));
});

app.get('/info', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'info.html'));
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

app.use((req, res) => {
  console.log(`404: ${req.path} not found`);
  res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke! Please try again.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Static files being served from: ${path.join(__dirname, 'public')}`);
});
