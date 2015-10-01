var url = "https://alumnoscurso.azure-mobile.net/Tables/curso/";

function obtenerDatos() {

    //Creo un objeto para usar AJAX
    var ajax = new XMLHttpRequest();
    // Se establece la conexión, indicando el método (get, put, delete) y la url destino
    ajax.open("get", url);

    //En las peticiones ajax el estado de la misma varía según los pasos realizados, 
    //por tanto se controla el paso en el que está para que haga una acción u otra.
    //Se controla con el método onreadystatechange.
    //Cuando cambie el estado ejecuta la función y son los distintos métodos del
    //objeto ajax con los que controlas el proceso.
    ajax.onreadystatechange = function () {

        //El status importante es 4, que es cuando ha finalizado.
        if (ajax.readyState == 4) {

            //Los códigos de status (404,500...) que indican éxito son los 200.
            if (ajax.status >= 200 && ajax.status < 300) {

                //XXXX.responseText es el valor "raw" (en texto plano) del resultado obtenido.
                //Se indica con JSON.parse(XXX) que se transforme a formato JSON
                //Igual que con parseInt/parseFloat para transformar una cadena de texto a número
                var data = JSON.parse(ajax.responseText);

                //Esta es la fórma básica y fea de construir una tabla "a mano" insertando
                //código html a pelo. Lo correcto es hacerlo con DOM (mas adelante)
                //Lo que se hace es concatenar todo el código html necesario para tener
                //una tabla y los datos recuperados.
                var salida = "<table>";

                salida += "<tr>";
                salida += "<th>" + "Nombre Curso" + "</th>";
                salida += "<th>" + "Duracion (horas)" + "</th>";
                
                for (var i = 0; i < data.length; i++) {
                    salida += "<tr>";
                    salida += "<td>" + data[i].nombre + "</td>";
                    salida += "<td>" + data[i].duracion + "</td>";
                    salida += "</tr>";
                }
                salida += "</table>";

                //Se inserta la tabla creada en la capa del html
                document.getElementById("tabla").innerHTML = salida;
            }

                //Otro código de error quiere decir algún tipo de error.
            else {

                alert("Error en la petición");

                //Se activa el log de la consola para "resultado", llamando a error.
                console.log(resultado.error)
            };
        };

    };
    //Una vez está todo configurado se envía la llamada ajax.
    //En este caso se pasa null porque es una llamada get.
    ajax.send(null)

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDuracion").value = "";
};

function guardarDatos() {

    //Crear un objeto recuperando la información de los campos por pantalla
    //RECUERDO: 
    //document.getElementById("XXX").value ==> elementos con valores (input, etc)
    //document.getElementById("txtNombre").innerHTML ==> capas o elementos de organización (div, section)
    var objeto = {
        nombre: document.getElementById("txtNombre").value,
        duracion: document.getElementById("txtDuracion").value
    };

    //Al igual que antes, se crea el objeto AJAX.
    var ajax = new XMLHttpRequest();

    //En este caso se indica POST ya que vamos a insertar un registro nuevo
    ajax.open("post", url);

    //Al ser una inserción hay que indicar datos de cabecera, indicando
    //datos de formato.
    ajax.setRequestHeader("Content-Type", "application/json");

    //De nuevo se comprueba si funciona bien el proceso.
    ajax.onreadystatechange = function () {

        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                //Si es correcto se carga de nuevo toda la tabla para ir
                //refrescando la información en cada envío.
                obtenerDatos();
            }
            else {
                alert("ERROR");
            };
        };

    };

    //Se transforma la información enviada a texto plano (aunque la cabecera
    //tiene indicado JSON, porque el http solo entiende texto plano para los
    //envíos
    var data = JSON.stringify(objeto);
    ajax.send(data);

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDuracion").value = "";
}

obtenerDatos();
document.getElementById("btnEnviar").onclick = guardarDatos;
document.getElementById("btnRefrescar").onclick = obtenerDatos;