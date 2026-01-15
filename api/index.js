
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5175;

// setting up cross-origin policy
const cors = require('cors');
app.use(cors({
  origin: `http://localhost:5173`,
}));


// charger les planètes
let systemeData;

try {
    const dataPath = path.join(__dirname, 'celestialBody.json');
    systemeData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log('celestialBody.json chargé avec succes.');
} catch (err) {
    console.error('Erreur lors du chargement de celestialBody.json:', err);
}


// env data
let envData;
try {
    const dataPath = path.join(__dirname, 'envData.json');
    envData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log('envData.json chargé avec succes.');
} catch (err) {
    console.error('Erreur lors du chargement de envData.json:', err);
}


//routes get SystmeData
app.get('/systemeData', (req, res) => {
    if (systemeData){
        res.json(systemeData);
    } else {
        res.status(500).send('System data pas encore chargé.');
    }
});

//route get EnvData
app.get('/envData', (req, res) => {
    res.json(envData);
});


//route post update systemeData
app.post('/systemeData', (req, res) => {
    const newData = req.body;
    if (!newData || Object.keys(newData).length === 0) {
        return res.status(400).send('Données invalides.');
    }
    systemeData = newData;
    res.send('Données du système mises à jour avec succès.');
});


//route post update envData
app.post('/envData', (req, res) => {
    const newData = req.body;
    if (!newData || Object.keys(newData).length === 0) {
        return res.status(400).send('Données invalides.');
    }
    envData = newData;
    res.send('Données de l\'environnement mises à jour avec succès.');
});


app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});