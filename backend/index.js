const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user');
const offersRoutes = require('./routes/offers');
const categoryRoutes = require('./routes/category');
const candidaturesRoutes = require('./routes/candidatures');

require('./models')

app.use(cors({
  origin: '*', // Autoriser toutes les origines en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  credentials: true, // Permet l'envoi des cookies (par exemple, le JWT)
}));


// Middleware pour analyser le corps de la requête (en JSON)
app.use(express.json());  // Pour les requêtes avec JSON (par exemple lors de l'inscription)

// Configurez express pour servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/user', userRoutes);  // Ajouter les routes des utilisateurs sous le chemin '/api/user'
app.use('/api/offers', offersRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/candidatures', candidaturesRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
