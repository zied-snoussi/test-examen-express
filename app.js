const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const bookRoutes = require('./routes/book');
const { Book } = require('./models/Book');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost:27017/livreDB')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection error', err);
  });

app.use(bodyParser.json());
app.use('/books', bookRoutes);

// Configurer Twig
app.set('view engine', 'twig');
app.set('views', './views');

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('getAvailableBooks', async () => {
    try {
      const availableBooksCount = await Book.countDocuments({ available: true });
      socket.emit('availableBooksCount', availableBooksCount);
    } catch (error) {
      console.error('Error fetching available books count', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});