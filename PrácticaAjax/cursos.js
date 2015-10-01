"use strict";

(function () {

    var url = "https://alumnoscurso.azure-mobile.net/Tables/Curso/";
    var modificando = undefined;

    function crearTabla(data) {
        var l, i;
        var tabla = document.getElementById("datos");
        var resultado = "<table>";

        l = data.length;
        for (i = 0; i < l; i++) {
            resultado += "<tr>";
            resultado += "<td>" + data[i].nombre + "</td>";
            resultado += "<td>" + data[i].duracion + "</td>";
            resultado += "<td><button type='button' class='borrar' onclick='borrar(\"" + data[i].id + "\")' >Borrar</button></td>";
            resultado += "<td><button type='button' onclick='cargarModificacion(\"" + data[i].id + "\")' >Modificar</button></td>";
            resultado += "</tr>";
        }
        resultado += "</table>";
        tabla.innerHTML = resultado;
    }

    function obtenerObjeto() {
        var obj = {
            nombre: document.getElementById("txtNom").value,
            duracion: parseInt(document.getElementById("txtDur").value)
        };
        return obj;
    }

    function add() {
        var ajax = new XMLHttpRequest();
        ajax.open("post", url);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4)
                if (ajax.status >= 200 && ajax.status < 300) actualizar();
                else console.log("Error");
        }
        ajax.send(JSON.stringify(obtenerObjeto()));
    }

    function cargarModificacion(id) {
        var ajax = new XMLHttpRequest();
        ajax.open("get", url + "/" + id);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status >= 200 && ajax.status < 300) {
                    var data = JSON.parse(ajax.responseText);
                    document.getElementById("txtNom").value = data.nombre;
                    document.getElementById("txtDur").value =
                    data.duracion;
                    modificando = data.id;
                }
                else console.log("Error!!!!");
            }
        }
        ajax.send(null);
    }

    function ejecutarModificacion() {
        var data;
        var ajax = new XMLHttpRequest();
        ajax.open("PATCH", url + "/" + modificando);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4)
                if (ajax.status >= 200 && ajax.status < 300) {
                    var data = JSON.parse(ajax.responseText);
                    actualizar();
                }
                else console.log("Error");
        }
        data = obtenerObjeto();
        data.id = modificando;
        ajax.send(JSON.stringify(data));
    }

    function actualizar() {
        modificando = undefined;
        var ajax = new XMLHttpRequest();
        ajax.open("get", url);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) 
                if (ajax.status >= 200 && ajax.status < 300) {
                    var data = JSON.parse(ajax.responseText);
                    crearTabla(data);
                }
                else console.log("Error");
        }
        ajax.send(null);
    }

    function borrar(id) {
        var ajax = new XMLHttpRequest();
        ajax.open("delete", url + "/" + id);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4)
                if (ajax.status >= 200 && ajax.status < 300) actualizar();
                else console.log("Error");
        }
        ajax.send(null);
    }

    document.getElementById("txtUpdate").onclick = function () {
        if (modificando) ejecutarModificacion();
        else add();
    };
    document.getElementById("txtAct").onclick = actualizar;

})();