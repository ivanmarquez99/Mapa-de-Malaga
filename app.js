var tabla = document.querySelector("#list");
var templateList = document.querySelector("template.list");
var templateModal = document.querySelector("template.modal");
var body = document.querySelector("body");
var modalInformacion = document.querySelector("#modalInformacion");
var home = document.getElementById("zoom-home-boton");

var map = L.map('map',{
  minZoom: 13,
  maxZoom: 19,
  zoomControl: false,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).setView([36.7201600, -4.4203400], 16);

// Implementation: Instantiate a ZoomBar control in its place.
//
var zoom_bar = new L.Control.ZoomBar({position: 'topright'}).addTo(map);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{maxZoom: 19}).addTo(map);

L.control.scale({position: "bottomleft", maxWidth: 100, metric: true, imperial: false}).addTo(map);

// Creamos un array donde importaremos los datos del json
var elementos = []

window.addEventListener("load", function() {

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
      //Llamamos a las funciones de crear marcadores y crear la lista
      crearMarcadores()
      crearLista()
    });
})

function crearMarcadores() {
  // Recorremos el listado de elementos para crear los marcadores en el mapa
  elementos.forEach(e => {
    var latitud = e.properties.x;
    var longitude = e.properties.y;
    var name = e.properties.nombre;
    var calle = e.properties.direccion;

    // Creamos los marcadores
    let marker = L.marker([latitud, longitude]).addTo(map);
    marker.bindPopup('<p class="fs-6">' + name + '</p><p>' + calle + '</p>').addTo(map);
  })
}

function crearLista() {
  elementos.forEach(e => {

    // Creamos el objeto en la lista con los datos oportunos
    let nuevoEdif = templateList.content.cloneNode(true);
    nuevoEdif.querySelector(".title-edif").innerText = e.properties.nombre;
    nuevoEdif.querySelector(".horario-edif").innerText = e.properties.horario;
    nuevoEdif.querySelector(".calle-edif").innerText = e.properties.direccion;
    if (e.properties.telefono == '') {
      nuevoEdif.querySelector(".telefono-edif").remove();
    } else {
      nuevoEdif.querySelector(".telefono-edif").innerText = e.properties.telefono;
    }


    // Añadimos un evento de click al elemento de la lista para abrir el modal y rellenarlo con los datos correspondientes
    nuevoEdif.querySelector('li').addEventListener('click', function () {

      // Actualizamos el contenido del modal
      modalInformacion.querySelector('.modal-title').innerText = e.properties.nombre;
      modalInformacion.querySelector('.modal-body .modal-direccion').innerText = e.properties.direccion;
      modalInformacion.querySelector('.modal-body .modal-horario').innerText = e.properties.horario;
      if (e.properties.telefono.length != 0) {
        modalInformacion.querySelector('.modal-body .modal-telefono').innerText = e.properties.telefono;
        modalInformacion.querySelector('.modal-body .modal-telefono').setAttribute('href', 'tel:+34' + e.properties.telefono);
      } else {
        modalInformacion.querySelector('.modal-body .modal-telefono').innerText = '';
        modalInformacion.querySelector('.modal-body .modal-telefono').removeAttribute('href');
      }

      let myModal = new bootstrap.Modal('#modalInformacion', {
        keyboard: false
      });
      myModal.show();

      var latitud = e.properties.x;
      var longitude = e.properties.y;

      map.flyTo([latitud, longitude], 19);
    })

    tabla.appendChild(nuevoEdif);
  }
  )
}