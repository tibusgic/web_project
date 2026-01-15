
<header>
  <h1>Projet Web 4A SAGI</h1>
  <p><strong>Nom du projet :</strong> <em>Système solaire interactif</em></p>
</header>

<section>
  <h2>Équipe</h2>
  <ul>
    <li>Thibault Gicquel</li>
    <li>Ethan Jeanneau</li>
    <li>Hugo Renault</li>
  </ul>
</section>

<section>
  <h2>Objectif du projet</h2>
  <p>
    L’objectif de ce projet est de concevoir une <strong>interface 3D interactive</strong> permettant la 
    <strong>visualisation du système solaire</strong> avec ses planètes, leurs orbites et diverses informations associées.
  </p>
  <p>
    L’application s’appuiera sur la bibliothèque <strong>Three.js</strong> afin de rendre la scène en trois dimensions et
    d’offrir une navigation fluide et intuitive.
  </p>
</section>


<section>
  <h2>Fonctionnalités prévues</h2>
  <ul>
    <li>Affichage en 3D des planètes et de leurs orbites autour du Soleil.</li>
    <li>Interaction avec la scène : rotation, zoom, déplacement.</li>
    <li>Fiche d’identification détaillée pour chaque astre (planète, lune, etc.).</li>
    <li>Possibilité d’animer le mouvement des planètes autour du Soleil.</li>
    <li>Interface claire et ergonomique.</li>
  </ul>
</section>
  <h2>Tâches principales</h2>
<section>
  
</section>

- [X] index.html qui inclut système.js
- [X] système.js qui est l'interface three.js globale du projet
- [X] fichier .js pour définir une planète
- [X] fichier .js pour définir une étoile
- [X] dossier texture
- [X] curseur de changement d'echelle
- [X] fiche d'intentification des planètes

</section>
  <h2>Tâches secondaires</h2>
<section>

- [X] Gestion du temps (timelapse)
- [X] lunes
- [X] API + page de configuration des données
- [ ] fichiers .js des ceintures d'astéroides
- [X] fichiers .js d'autres éléments
- [ ] déplacement sur la terre avec informations des pays

<section>
  <h2>Référence d’inspiration</h2>
  <p>
    Le projet s’inspire du site de la NASA :<br>
    <a href="https://eyes.nasa.gov/apps/solar-system" target="_blank">
      https://eyes.nasa.gov/apps/solar-system
    </a>
  </p>
</section>


<section>
<h2>Démarrer en local</h2>

### Installation
```
npm install          # Installe concurrently (racine)
npm run install:all  # Installe les dépendances de api/ et app/
```

### Lancement
```
npm run dev          # Lance l'API (port 5175) + l'App (port 5173) simultanément
```

### Commandes individuelles
| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance les deux serveurs en parallèle |
| `npm run start:api` | Lance uniquement l'API (port 5175) |
| `npm run start:app` | Lance uniquement l'App (port 5173) |

### Accès
- **Application** : [http://localhost:5173](http://localhost:5173)
- **API** : [http://localhost:5175](http://localhost:5175)

</section>
