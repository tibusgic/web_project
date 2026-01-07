// Assurez-vous d'avoir inclus la librairie astronomy-engine
<script src="https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js"></script>

// Dictionnaire des périodes de rotation sidérale (en heures)
// Source : NASA Planetary Fact Sheet
const rotationPeriods = {
    "Mercury": 1407.6,
    "Venus": -5832.5, // Négatif car elle tourne à l'envers (rétrograde)
    "Earth": 23.93,
    "Mars": 24.62,
    "Jupiter": 9.92,
    "Saturn": 10.66,
    "Uranus": -17.24, // Rétrograde
    "Neptune": 16.11,
    "Pluto": -153.3   // Rétrograde
};

/**
 * Récupère les données spatiales d'une planète spécifique
 * @param {string} planetName - Nom de la planète (ex: "Jupiter", "Earth")
 * @param {Date} date - (Optionnel) Date spécifique, par défaut "maintenant"
 */
function getPlanetData(planetName, date = new Date()) {
    // 1. Validation basique
    if (!rotationPeriods[planetName] && planetName !== 'Sun') {
        console.warn(`Planète inconnue ou données manquantes pour : ${planetName}`);
        return null;
    }

    // 2. Calcul de la position Héliocentrique (Soleil au centre)
    // Retourne un vecteur {x, y, z} en Unités Astronomiques (UA)
    let pos;
    if (planetName === 'Sun') {
        pos = { x: 0, y: 0, z: 0 }; // Le soleil est au centre
    } else {
        // La librairie fait le calcul complexe ici
        pos = Astronomy.HeliocentricCoordinates(planetName, date);
    }

    // 3. Calcul de la rotation sur elle-même (Spin)
    // On calcule le nombre d'heures écoulées depuis une date arbitraire (Epoch J2000)
    // pour avoir une rotation fluide en temps réel.
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const hoursSinceJ2000 = (date - j2000) / (1000 * 60 * 60);
    
    // Formule : (Heures écoulées / Période) * 360 degrés
    // Le modulo % 360 garde le nombre entre 0 et 360
    let rotationAngle = 0;
    if (rotationPeriods[planetName]) {
        rotationAngle = (hoursSinceJ2000 / rotationPeriods[planetName]) * 360 % 360;
    }

    return {
        name: planetName,
        x: pos.x, // Distance en UA (1 UA = 150 millions km)
        y: pos.y,
        z: pos.z,
        rotation: rotationAngle // En degrés
    };
}