//fonction pour creer la carte d'information d'une planete
let currentCard = null; // référence à la card actuelle

export function createPlanetCard(planetData) {
    // Fermer la card précédente si elle existe
    if (currentCard) {
      currentCard.remove();
    }

    const card = document.createElement('div');
    card.className = 'planet-card';
    card.style.position = 'fixed';
    card.style.top = '50%';
    card.style.right = '20px';
    card.style.transform = 'translateY(-50%)';
    card.style.zIndex = '2000';

    // Générer les éléments d'atmosphère
    let atmosphereHTML = '';
    if (planetData.atmosphere && planetData.atmosphere.mainComponents) {
      atmosphereHTML = planetData.atmosphere.mainComponents.map(comp => 
        `<div class="element-pill">
          <span class="element-percent">${comp.percentage}%</span>
          <span class="element-symbol">${comp.symbol}</span>
          <span class="element-name">${comp.name}</span>
        </div>`
      ).join('');
    }

    // Formater la masse en notation scientifique lisible
    const massExponent = Math.floor(Math.log10(planetData.physical.mass));
    const massBase = (planetData.physical.mass / Math.pow(10, massExponent)).toFixed(2);
    const massSuperscript = massExponent.toString().split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d] || d).join('');

    card.innerHTML = `
    <!-- HEADER -->
    <div class="planet-card-header">
      <div class="header-left">
        <h2 class="planet-name">${planetData.name.toUpperCase()}</h2>
        <span class="planet-type">${planetData.type.toUpperCase()}</span>
      </div>
      
    </div>

    <!-- DESCRIPTION -->
    <p class="planet-description">
      ${planetData.description}
    </p>

    <!-- ORBIT SECTION -->
    <div class="planet-section">
      <div class="section-header">
        <i class="bi bi-arrow-repeat"></i>
        <h3>ORBIT</h3>
      </div>
      <div class="section-divider"></div>
      <div class="planet-stats">
        <div class="stat">
          <span class="label"><i class="bi bi-sun"></i> Semi-major Axis</span>
          <span class="value">${planetData.orbit.semimajorAxis} <span class="unit">M km</span></span>
        </div>
        <div class="stat">
          <span class="label"><i class="bi bi-bullseye"></i> Eccentricity</span>
          <span class="value">${planetData.orbit.eccentricity}</span>
        </div>
        <div class="stat">
          <span class="label"><i class="bi bi-slash-lg"></i> Inclination</span>
          <span class="value">${planetData.orbit.inclination}<span class="unit">°</span></span>
        </div>
        <div class="stat">
          <span class="label"><i class="bi bi-calendar3"></i> Orbital Period</span>
          <span class="value">${planetData.orbit.orbitalPeriod} <span class="unit">days</span></span>
        </div>
      </div>
    </div>

    <!-- PHYSICAL SECTION -->
    <div class="planet-section">
      <div class="section-header">
        <i class="bi bi-box"></i>
        <h3>PHYSICAL</h3>
      </div>
      <div class="section-divider"></div>
      <div class="planet-stats">
        <div class="stat">
          <span class="label"><i class="bi bi-speedometer2"></i> Gravity</span>
          <span class="value">${planetData.physical.gravity} <span class="unit">m/s²</span></span>
        </div>
        <div class="stat">
          <span class="label"><i class="bi bi-basket3"></i> Mass</span>
          <span class="value">${massBase}×10${massSuperscript} <span class="unit">kg</span></span>
        </div>
        <div class="stat">
          <span class="label"><i class="bi bi-dice-3"></i> Density</span>
          <span class="value">${planetData.physical.density} <span class="unit">kg/m³</span></span>
        </div>
        <div class="stat">
          <span class="label"><i class="bi bi-arrow-clockwise"></i> Rotation</span>
          <span class="value">${planetData.physical.rotationPeriod} <span class="unit">days</span></span>
        </div>
      </div>
    </div>

    <!-- ATMOSPHERE SECTION -->
    ${planetData.atmosphere && planetData.atmosphere.mainComponents ? `
    <div class="planet-section">
      <div class="section-header">
        <i class="bi bi-cloud-haze"></i>
        <h3>ATMOSPHERE</h3>
        <span class="atmosphere-badge">${planetData.atmosphere.type.toUpperCase()}</span>
      </div>
      <div class="section-divider"></div>
      <div class="atmosphere-composition">
        ${atmosphereHTML}
      </div>
    </div>
    ` : ''}

    <!-- TEMPERATURE SECTION -->
    <div class="planet-section">
      <div class="section-header">
        <i class="bi bi-thermometer-half"></i>
        <h3>TEMPERATURE</h3>
      </div>
      <div class="section-divider"></div>
      <div class="temperature-display">
        <div class="temp-block temp-min">
          <span class="temp-label">MIN</span>
          <span class="temp-value">${planetData.temperature.min}°C</span>
        </div>
        <div class="temp-block temp-avg">
          <span class="temp-label">AVG</span>
          <span class="temp-value">${planetData.temperature.average}°C</span>
        </div>
        <div class="temp-block temp-max">
          <span class="temp-label">MAX</span>
          <span class="temp-value">${planetData.temperature.max}°C</span>
        </div>
      </div>
      <div class="temp-bar">
        <div class="temp-gradient"></div>
        <div class="temp-marker temp-marker-min" style="left: 0%"></div>
        <div class="temp-marker temp-marker-avg" style="left: 50%"></div>
        <div class="temp-marker temp-marker-max" style="left: 100%"></div>
      </div>
    </div>

    <button class="close-card"><i class="bi bi-x-lg"></i></button>
  `;
  
  const closeButton = card.querySelector('.close-card');
  closeButton.addEventListener('click', () => {
    card.remove();
    currentCard = null;
  });
  
  document.body.appendChild(card);
  currentCard = card;
  return card;
}