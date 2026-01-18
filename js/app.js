// Cargar datos guardados
document.addEventListener("DOMContentLoaded", cargarServicios);

function agregarServicio() {
    const fecha = document.getElementById("fecha").value;
    const ministerio = document.getElementById("ministerio").value;
    const responsable = document.getElementById("responsable").value;

    if (!fecha || !ministerio || !responsable) {
        alert("Completa todos los campos");
        return;
    }

    const servicio = {
        id: Date.now(),
        fecha,
        ministerio,
        responsable
    };

    let servicios = obtenerServicios();
    servicios.push(servicio);
    localStorage.setItem("servicios", JSON.stringify(servicios));

    limpiarFormulario();
    mostrarServicios();
}

function obtenerServicios() {
    return JSON.parse(localStorage.getItem("servicios")) || [];
}

function cargarServicios() {
    mostrarServicios();
}

function mostrarServicios() {
    const lista = document.getElementById("listaServicios");
    lista.innerHTML = "";

    const servicios = obtenerServicios();

    if (servicios.length === 0) {
        lista.innerHTML = "<p>No hay servicios cargados.</p>";
        return;
    }

    servicios.forEach(servicio => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <strong>📆 ${servicio.fecha}</strong>
            Ministerio: ${servicio.ministerio}<br>
            Responsable: ${servicio.responsable}
            <button onclick="eliminarServicio(${servicio.id})">Eliminar</button>
        `;

        lista.appendChild(div);
    });
}

function eliminarServicio(id) {
    let servicios = obtenerServicios();
    servicios = servicios.filter(s => s.id !== id);
    localStorage.setItem("servicios", JSON.stringify(servicios));
    mostrarServicios();
}

function limpiarFormulario() {
    document.getElementById("fecha").value = "";
    document.getElementById("ministerio").value = "";
    document.getElementById("responsable").value = "";
}
