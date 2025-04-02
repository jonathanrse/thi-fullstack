const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user');

app.use(cors({
  origin: 'http://localhost:5173', // URL de ton frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  credentials: true, // Permet l'envoi des cookies (par exemple, le JWT)
}));


// Middleware pour analyser le corps de la requête (en JSON)
app.use(express.json());  // Pour les requêtes avec JSON (par exemple lors de l'inscription)


app.use('/api/user', userRoutes);  // Ajouter les routes des utilisateurs sous le chemin '/api/user'


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
