

// charger variable d'environnement depuis le serveur
let envData = {};
try {
  const reponse = await fetch('http://localhost:5175/envData');
  envData = await reponse.json();
  console.log('Données d\'environnement chargées avec succès.');
} catch (err) {
  console.error('Erreur lors du chargement des données d\'environnement :', err);
}

//charger les planètes depuis le serveur
let systemeData = [];
try {
  const reponse = await fetch('http://localhost:5175/systemeData');
  systemeData = await reponse.json();
  console.log('Données du système chargées avec succès.');
} catch (err) {
  console.error('Erreur lors du chargement des données du système :', err);
}

console.log(envData);
console.log(systemeData);


//mettre infos sur la page
const ambientlightcolor = document.getElementById('ambient-light-color');
ambientlightcolor.value = envData.ambientLight.color;

const ambientlightintensity = document.getElementById('ambient-light-intensity');
ambientlightintensity.value = envData.ambientLight.intensity;

const camerafov = document.getElementById('camera-fov');
camerafov.value = envData.camera.fov;
const cameranear = document.getElementById('camera-min-distance');
cameranear.value = envData.camera.near;
const camerafar = document.getElementById('camera-max-distance');
camerafar.value = envData.camera.far;

const zoommindistance = document.getElementById('zoom-min-distance');
zoommindistance.value = envData.zoom.minDistance;
const zoommaxdistance = document.getElementById('zoom-max-distance');
zoommaxdistance.value = envData.zoom.maxDistance;

const nbskyparticules = document.getElementById('nb-sky-particules');
nbskyparticules.value = envData.sky.quantity;
const skymindistance = document.getElementById('sky-particule-min-distance');
skymindistance.value = envData.sky.minDistance;
const skymaxdistance = document.getElementById('sky-particule-max-distance');
skymaxdistance.value = envData.sky.maxDistance;

//liste des planètes
const celestialbodySelect = document.getElementById('celestialbody-select');
systemeData.forEach((body, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = body.name;
    celestialbodySelect.appendChild(option);

    // ajouter les lunes si existantes
    if (body.moons && body.moons.length > 0) {
        body.moons.forEach((moon, moonIndex) => {
            const moonOption = document.createElement('option');
            moonOption.value = index + '-' + moonIndex;
            moonOption.textContent = `${moon.name} (Moon of ${body.name})`;
            celestialbodySelect.appendChild(moonOption);
        });
    }
});



// références aux inputs
const nameInput = document.getElementById('name-input');
const typeInput = document.getElementById('type-input');
const descriptionInput = document.getElementById('description-input');
const textureInput = document.getElementById('texture-input');

const radiusInput = document.getElementById('radius-input');

const massInput = document.getElementById('mass-input');
const densityInput = document.getElementById('density-input');
const gravityInput = document.getElementById('gravity-input');
const rotationInput = document.getElementById('rotation-input');

const semimajorAxisInput = document.getElementById('semimajoraxis-input');
const eccentricityInput = document.getElementById('eccentricity-input');
const inclinationInput = document.getElementById('inclination-input');
const longitudeInput = document.getElementById('longitude-input');
const periapsisInput = document.getElementById('periapsis-input');
const meanAnomalyInput = document.getElementById('meananomaly-input');
const orbitalPeriodInput = document.getElementById('orbitalperiod-input');

const atmosphereExistsInput = document.getElementById('atmosphere-exists-input');
const atmosphereTypeInput = document.getElementById('atmosphere-type-input');
const atmosphereComponentsContainer = document.querySelector('.atmosphere-components');

const tempMinInput = document.getElementById('temp-min-input');
const tempMaxInput = document.getElementById('temp-max-input');
const tempAvgInput = document.getElementById('temp-avg-input');


// fonction pour remplir le formulaire (planète ou lune)
function fillBodyData(bodyValue) {
    let body;
    
    // Vérifier si c'est une lune  planetIndex-moonIndex
    if (typeof bodyValue === 'string' && bodyValue.includes('-')) {
        const [planetIndex, moonIndex] = bodyValue.split('-').map(Number);
        body = systemeData[planetIndex]?.moons?.[moonIndex];
    } else {
        body = systemeData[parseInt(bodyValue)];
    }
    
    if (!body) return;

    nameInput.value = body.name || '';
    typeInput.value = body.type || '';
    descriptionInput.value = body.description || '';
    textureInput.value = body.texture || '';

    radiusInput.value = body.visual?.radius || 0;

    massInput.value = body.physical?.mass || 0;
    densityInput.value = body.physical?.density || 0;
    gravityInput.value = body.physical?.gravity || 0;
    rotationInput.value = body.physical?.rotationPeriod || 0;

    semimajorAxisInput.value = body.orbit?.semimajorAxis || 0;
    eccentricityInput.value = body.orbit?.eccentricity || 0;
    inclinationInput.value = body.orbit?.inclination || 0;
    longitudeInput.value = body.orbit?.longitudeOfAscendingNode || 0;
    periapsisInput.value = body.orbit?.argumentOfPeriapsis || 0;
    meanAnomalyInput.value = body.orbit?.meanAnomaly0 || 0;
    orbitalPeriodInput.value = body.orbit?.orbitalPeriod || 0;

    atmosphereExistsInput.checked = body.atmosphere?.exists || false;
    atmosphereTypeInput.value = body.atmosphere?.type || '';

    generateAtmosphereComponents(body.atmosphere?.mainComponents || []);

    tempMinInput.value = body.temperature?.min || 0;
    tempMaxInput.value = body.temperature?.max || 0;
    tempAvgInput.value = body.temperature?.average || 0;
}


// fonction pour générer les composants de l'atmosphère
function generateAtmosphereComponents(components) {
    const title = atmosphereComponentsContainer.querySelector('h5');
    atmosphereComponentsContainer.innerHTML = '';
    atmosphereComponentsContainer.appendChild(title);

    components.forEach((comp, index) => {
        const componentDiv = document.createElement('div');
        componentDiv.className = 'component';
        componentDiv.innerHTML = `
            <span>Name : <input type="text" class="component-name" value="${comp.name}" data-index="${index}"></span>
            <span>Symbol : <input type="text" class="component-symbol" value="${comp.symbol}" data-index="${index}"></span>
            <span>Percentage : <input type="number" class="component-percentage" value="${comp.percentage}" step="0.1" data-index="${index}">%</span>
            <button class="btn-remove-component" data-index="${index}"><i class="bi bi-trash"></i></button>
        `;
        atmosphereComponentsContainer.appendChild(componentDiv);
    });

    const addButtonDiv = document.createElement('div');
    addButtonDiv.className = 'component';
    addButtonDiv.innerHTML = `<button class="btn-add-component"><i class="bi bi-plus-circle"></i> Add Component</button>`;
    atmosphereComponentsContainer.appendChild(addButtonDiv);

    atmosphereComponentsContainer.querySelectorAll('.btn-remove-component').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            const currentBody = getCurrentBody();
            if (currentBody) {
                currentBody.atmosphere.mainComponents.splice(index, 1);
                generateAtmosphereComponents(currentBody.atmosphere.mainComponents);
            }
        });
    });

    atmosphereComponentsContainer.querySelector('.btn-add-component').addEventListener('click', () => {
        const currentBody = getCurrentBody();
        if (currentBody) {
            currentBody.atmosphere.mainComponents.push({
                name: 'New',
                symbol: 'X',
                percentage: 0
            });
            generateAtmosphereComponents(currentBody.atmosphere.mainComponents);
        }
    });
}

// Fonction pour obtenir le corps céleste actuel (planète ou lune)
function getCurrentBody() {
    if (typeof currentSelection === 'string' && currentSelection.includes('-')) {
        const [planetIndex, moonIndex] = currentSelection.split('-').map(Number);
        return systemeData[planetIndex]?.moons?.[moonIndex];
    } else {
        return systemeData[parseInt(currentSelection)];
    }
}

// Fonction pour sauvegarder les données du formulaire dans le bon objet
function saveCurrentBody() {
    const formData = getFormData();
    
    if (typeof currentSelection === 'string' && currentSelection.includes('-')) {
        const [planetIndex, moonIndex] = currentSelection.split('-').map(Number);
        if (systemeData[planetIndex]?.moons?.[moonIndex]) {
            // Conserver le tableau moons de la lune s'il existe
            formData.moons = systemeData[planetIndex].moons[moonIndex].moons || [];
            systemeData[planetIndex].moons[moonIndex] = formData;
        }
    } else {
        const planetIndex = parseInt(currentSelection);
        if (systemeData[planetIndex]) {
            // Conserver le tableau moons de la planète
            formData.moons = systemeData[planetIndex].moons || [];
            systemeData[planetIndex] = formData;
        }
    }
}


// fonction pour récup les données du formulaire
function getFormData() {

    //composants atmosphériques
    const components = [];
    atmosphereComponentsContainer.querySelectorAll('.component').forEach(compDiv => {
        const nameEl = compDiv.querySelector('.component-name');
        const symbolEl = compDiv.querySelector('.component-symbol');
        const percentageEl = compDiv.querySelector('.component-percentage');
        
        if (nameEl && symbolEl && percentageEl) {
            components.push({
                name: nameEl.value,
                symbol: symbolEl.value,
                percentage: parseFloat(percentageEl.value)
            });
        }
    });

    //retour des données
    return {
        name: nameInput.value,
        type: typeInput.value,
        description: descriptionInput.value,
        texture: textureInput.value,
        visual: {
            radius: parseFloat(radiusInput.value)
        },
        physical: {
            mass: parseFloat(massInput.value),
            density: parseFloat(densityInput.value),
            gravity: parseFloat(gravityInput.value),
            rotationPeriod: parseFloat(rotationInput.value)
        },
        orbit: {
            semimajorAxis: parseFloat(semimajorAxisInput.value),
            eccentricity: parseFloat(eccentricityInput.value),
            inclination: parseFloat(inclinationInput.value),
            longitudeOfAscendingNode: parseFloat(longitudeInput.value),
            argumentOfPeriapsis: parseFloat(periapsisInput.value),
            meanAnomaly0: parseFloat(meanAnomalyInput.value),
            orbitalPeriod: parseFloat(orbitalPeriodInput.value)
        },
        atmosphere: {
            exists: atmosphereExistsInput.checked,
            type: atmosphereTypeInput.value,
            mainComponents: components
        },
        temperature: {
            min: parseFloat(tempMinInput.value),
            max: parseFloat(tempMaxInput.value),
            average: parseFloat(tempAvgInput.value)
        }
    };
}


// Fonction pour récupérer les données d'environnement
function getEnvData() {
    return {
        ambientLight: {
            color: ambientlightcolor.value,
            intensity: parseFloat(ambientlightintensity.value)
        },
        camera: {
            fov: parseFloat(camerafov.value),
            near: parseFloat(cameranear.value),
            far: parseFloat(camerafar.value)
        },
        zoom: {
            minDistance: parseFloat(zoommindistance.value),
            maxDistance: parseFloat(zoommaxdistance.value)
        },
        sky: {
            quantity: parseInt(nbskyparticules.value),
            minDistance: parseFloat(skymindistance.value),
            maxDistance: parseFloat(skymaxdistance.value)
        }
    };
}


let currentSelection = '0'; // Peut être "0" (planète) ou "0-1" (lune)
fillBodyData(currentSelection);

celestialbodySelect.addEventListener('change', (event) => {
    // Sauvegarder avant de changer de corps céleste
    saveCurrentBody();
    
    currentSelection = event.target.value;
    fillBodyData(currentSelection);
    
    const currentBody = getCurrentBody();
    console.log(`Corps céleste sélectionné: ${currentBody?.name || 'Inconnu'}`);
});


//Register
document.getElementById('btn-register').addEventListener('click', async () => {
    // Sauvegarder le corps actuel
    saveCurrentBody();

    try {
        //données des planètes
        const systemeResponse = await fetch('http://localhost:5175/systemeData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(systemeData)
        });
        
        //données d'environnement
        const envResponse = await fetch('http://localhost:5175/envData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getEnvData())
        });

        if (systemeResponse.ok && envResponse.ok) {
            alert('Données enregistrées avec succès !');
            console.log('Données sauvegardées.');
        } else {
            alert('Erreur lors de l\'enregistrement.');
        }
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement:', err);
        alert('Erreur de connexion au serveur.');
    }
});
