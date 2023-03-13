
var map = L.map('map')
var tabla = document.querySelector("#list");
var templateList = document.querySelector("template.list");
var templateModal = document.querySelector("template.modal");
var body = document.querySelector("body");

// Añadimos el mapa de open street map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

// Añadimos la vista con las coordenadas de Málaga y un zoom de 16
map.setView([36.7201600, -4.4203400], 16)

// Creamos un array donde importaremos los datos del json
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
        //Llamamos a las funciones de crear marcadores y crear la lista
        crearMarcadores()
        crearLista()
      });  
}

function crearMarcadores() {
    // Recorremos el listado de elementos para crear los marcadores en el mapa
    elementos.forEach(function(e) {
        var latitud = e.properties.x;
        var longitude = e.properties.y;
        var name = e.properties.nombre;
        var calle = e.properties.direccion;

        // Creamos los marcadores
        let marker = L.marker([latitud, longitude]).addTo(map);
        marker.bindPopup('<p class="fs-6">'+name+'</p><p>'+calle+'</p>').addTo(map);
    })
}

function crearLista() {
    elementos.forEach(function(e, i) {
    
    // Creamos el objeto en la lista con los datos oportunos
    let nuevoEdif = templateList.content.cloneNode(true);
    // Evento de click para que se abra el modal
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

    
    // Creamos el modal con los datos oportunos
    let nuevoModal =  templateModal.content.cloneNode(true);
    nuevoModal.querySelector(".modal").setAttribute('id', 'modal-'+i)
    nuevoModal.querySelector(".modal-title").innerText = e.properties.nombre;
    nuevoModal.querySelector(".modal-horario").innerText = e.properties.horario;
    nuevoModal.querySelector(".modal-direccion").innerText = e.properties.direccion;
    nuevoModal.querySelector(".modal-telefono").innerText = e.properties.telefono;
    body.appendChild(nuevoModal)
    
    })
}


