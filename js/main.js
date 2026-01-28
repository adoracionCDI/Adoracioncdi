// ----------------- SECCIONES -----------------
const inicio = document.getElementById('inicio');
const administrador = document.getElementById('administrador');
const director = document.getElementById('director');
const musico = document.getElementById('musico');

const roleButtons = document.querySelectorAll('.role-btn');
roleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const rol = btn.getAttribute('data-role');
    localStorage.setItem('rolUsuario', rol);
    inicio.classList.add('oculto');

    if (rol === 'administrador') administrador.classList.remove('oculto');
    if (rol === 'director') director.classList.remove('oculto');
    if (rol === 'musico') musico.classList.remove('oculto');
  });
});

// Botones volver
document.getElementById('volverInicioAdmin').addEventListener('click', () => {
  administrador.classList.add('oculto'); inicio.classList.remove('oculto');
});
document.getElementById('volverInicioDirector').addEventListener('click', () => {
  director.classList.add('oculto'); inicio.classList.remove('oculto');
});
document.getElementById('volverInicioMusico').addEventListener('click', () => {
  musico.classList.add('oculto'); inicio.classList.remove('oculto');
});

// ----------------- ADMINISTRADOR -----------------
const listaDirectores = document.getElementById('listaDirectores');
const nombreDirectorInput = document.getElementById('nombreDirector');
const agregarDirectorBtn = document.getElementById('agregarDirector');

// Modal
const modal = document.getElementById('modalEditar');
const nombreEditarInput = document.getElementById('nombreEditar');
const guardarEditarBtn = document.getElementById('guardarEditar');
const cerrarModalBtn = document.getElementById('cerrarModal');

let idEditarActual = null;

// Funciones de ejemplo (sin Supabase aún)
function cargarDirectores() {
  // Aquí deberías traer desde Supabase
  // Por ahora ejemplo estático
  const directoresEjemplo = [
    { id: 1, nombre: 'Oscar' },
    { id: 2, nombre: 'Luis' }
  ];

  listaDirectores.innerHTML = '';
  directoresEjemplo.forEach(d => {
    const li = document.createElement('li');
    li.textContent = d.nombre;

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => {
      idEditarActual = d.id;
      nombreEditarInput.value = d.nombre;
      modal.classList.remove('oculto');
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => {
      alert(`Eliminar director ${d.nombre} (pendiente de Supabase)`);
    });

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    listaDirectores.appendChild(li);
  });
}

// Agregar director
agregarDirectorBtn.addEventListener('click', () => {
  const nombre = nombreDirectorInput.value.trim();
  if (!nombre) return alert('Escriba un nombre');
  alert(`Agregar director ${nombre} (pendiente de Supabase)`);
  nombreDirectorInput.value = '';
  cargarDirectores();
});

// Guardar edición desde modal
guardarEditarBtn.addEventListener('click', () => {
  const nombre = nombreEditarInput.value.trim();
  if (!nombre) return alert('Escriba un nombre');
  alert(`Editar director ${nombre} (pendiente de Supabase)`);
  modal.classList.add('oculto');
  cargarDirectores();
});

// Cerrar modal sin guardar
cerrarModalBtn.addEventListener('click', () => {
  modal.classList.add('oculto');
});

// Cargar directores al abrir Administrador
document.querySelector('.role-btn[data-role="administrador"]').addEventListener('click', () => {
  cargarDirectores();
});

