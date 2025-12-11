//Use api form : https://astrologyapi.docs.apiary.io/#reference

var request = new XMLHttpRequest();

request.open('POST', 'http://ephemeris.kibo.cz/api/v1/planets');

request.setRequestHeader('Content-Type', 'application/json');
request.setRequestHeader('Accept', 'application/json');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
  }
};

var body = { 
    'event': '20251210110000', 
    'planets': ['Earth', 'Moon'],
    'topo': [ longitude, latitude, geoalt],
    'zodiac': 'sidereal mode name'
};

request.send(JSON.stringify(body));