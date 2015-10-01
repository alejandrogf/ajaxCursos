var url = "https://alumnoscurso.azure-mobile.net/Tables/curso/";
var modificando = undefined;

function obtenerObjeto() {
    var objeto = {
        nombre: document.getElementById("txtNombre").value,
        duracion: parseInt(document.getElementById("txtDuracion").value)
    };

    return objeto;
};

function obtenerDatos() {

    var ajax = new XMLHttpRequest();
    modificando=undefined;
    ajax.open("get", url);
    ajax.onreadystatechange = function () {

        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                var data = JSON.parse(ajax.responseText);
                crearTabla(data);      
            }
            else {
                alert("Error en la petición");
            };
        };

    };

    ajax.send(null);

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDuracion").value = "";
};




function guardarDatos() {

    var ajax = new XMLHttpRequest();
    ajax.open("post", url);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {

        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {

                obtenerDatos();
            }
            else {
                alert("ERROR");
            };
        };

    };

    ajax.send(JSON.stringify(obtenerObjeto()));

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDuracion").value = "";
}

function borrarDatos(id) {

    var ajax = new XMLHttpRequest();
    ajax.open("delete", url+"/"+id);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {

        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {

                obtenerDatos();
            }
            else {
                alert("ERROR");
            };
        };

    };

    ajax.send(null);

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDuracion").value = "";
};


function crearTabla(data) {

    var salida = "<table>";

    salida += "<tr>";
    salida += "<th>" + "Nombre Curso" + "</th>";
    salida += "<th>" + "Duracion (horas)" + "</th>" + "</tr>";
    

    for (var i = 0; i < data.length; i++) {
        salida += "<tr>";
        salida += "<td>" + data[i].nombre + "</td>";
        salida += "<td>" + data[i].duracion + "</td>";
        salida += "<td>" + '<button type="button" onclick="borrar(\"' + data[i].id + '\")">Borrar</button></td>';
        salida += "<td>" + '<button type="button" onclick="cargarModificacion(\"' + data[i].id + '\")">Actualizar</button></td>';
        salida += "</tr>";
    }
    salida += "</table>";

    //Se inserta la tabla creada en la capa del html
    document.getElementById("tabla").innerHTML = salida;
};

function cargarModificacion(id) {
    var ajax = new XMLHttpRequest();

    ajax.open("get", url + "/" + id);
    ajax.onreadystatechange = function () {

        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                var data = JSON.parse(ajax.responseText);
                document.getElementById(txtNombre).value = data.nombre;
                document.getElementById(txtDuracion).value = data.duracion;
                modificando = data.id;
            }
            else {
                alert("Error en la petición");
            };
        };

    };

    ajax.send(null);
};

function ejecutarModificacion() {

    var ajax = new XMLHttpRequest();

    ajax.open("PATCH", url + "/" + modificando);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {

        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {

                obtenerDatos();
            }
            else {
                alert("ERROR");
            };
        };

    };
    var data = obtenerObjeto();
    data.id = modificando;
    ajax.send(JSON.stringify(data));

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDuracion").value = "";
};

obtenerDatos();
document.getElementById("btnActualizar").onclick = obtenerDatos;
document.getElementById("btnGuardar").onclick = function () {

    if (modificando != undefined)
        ejecutarModificacion();
    else {
        guardarDatos();
    };

};

