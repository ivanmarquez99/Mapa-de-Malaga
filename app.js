
var map = L.map('map')
var tabla = document.querySelector("#list");
var templateList = document.querySelector("template.list");
var templateModal = document.querySelector("template.modal");
var body = document.querySelector("body");

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

map.setView([36.7201600, -4.4203400], 16)

const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
};

function error(err) {
    console.log(err)
}

function geoFindMe() {
    if (!navigator.geolocation) {
        console.log('No permitido por el navegador')
    } else {
        navigator.geolocation.getCurrentPosition(showInfo, error, options);
    }
}

var elementos = []

window.onload=function() {
  
    fetch('https://raw.githubusercontent.com/FRomero999/ExamenDIW2022/main/rutas_arqueologicas.json')
      .then(response => response.text())
      .then(data => {
  
        // Parseamos a array los datos recibidos
        let datosImportados = JSON.parse(data);
  
        // Añadimos los datos importados al array elementos
        if (datosImportados.length > 0) {
          datosImportados.forEach((line) => {
            elementos.push(line);
          });
        }
        crearMarcadores()
        crearLista()
      });  
}

function crearMarcadores() {
    elementos.forEach(function(e) {
        var latitud = e.properties.x;
        var longitude = e.properties.y;
        var name = e.properties.nombre;
        var calle = e.properties.direccion;

        let marker = L.marker([latitud, longitude]).addTo(map);
        marker.bindPopup('<p class="fs-6">'+name+'</p><p>'+calle+'</p>').addTo(map);
    })
}

function crearLista() {
    elementos.forEach(function(e, i) {

    let nuevoEdif = templateList.content.cloneNode(true);
    nuevoEdif.querySelector('.element').addEventListener("click", function()
    {
        const myModal = new bootstrap.Modal(document.getElementById('modal-'+i));
        myModal.show();
    });
    nuevoEdif.querySelector(".title-edif").innerText = e.properties.nombre;
    nuevoEdif.querySelector(".horario-edif").innerText = e.properties.horario;
    nuevoEdif.querySelector(".calle-edif").innerText = e.properties.direccion;
    nuevoEdif.querySelector(".telefono-edif").innerText = e.properties.telefono;
    tabla.appendChild(nuevoEdif);

    

    let nuevoModal =  templateModal.content.cloneNode(true);
    nuevoModal.querySelector(".modal").setAttribute('id', 'modal-'+i)
    nuevoModal.querySelector(".modal-title").innerText = e.properties.nombre;
    nuevoModal.querySelector(".modal-horario").innerText = e.properties.horario;
    nuevoModal.querySelector(".modal-direccion").innerText = e.properties.direccion;
    nuevoModal.querySelector(".modal-telefono").innerText = e.properties.telefono;
    body.appendChild(nuevoModal)
    
    })
}
console.log(elementos)


