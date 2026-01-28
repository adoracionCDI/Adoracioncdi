// ---------- ADMINISTRADOR ----------
const listaDirectores = document.getElementById('listaDirectores');
const nombreDirectorInput = document.getElementById('nombreDirector');
const agregarDirectorBtn = document.getElementById('agregarDirector');

// Modal
const modal = document.getElementById('modalEditar');
const nombreEditarInput = document.getElementById('nombreEditar');
const nombreActualModal = document.getElementById('nombreActualModal');
const guardarEditarBtn = document.getElementById('guardarEditar');
const cerrarModalBtn = document.getElementById('cerrarModal');

let idEditarActual = null;

// Función para cargar directores (ejemplo)
function cargarDirectores() {
  const directoresEjemplo = [
    { id: 1, nombre: 'Alma' },
    { id: 2, nombre: 'Oscar' },
    { id: 3, nombre: 'Luis' }
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
      nombreActualModal.textContent = `Nombre actual: ${d.nombre}`;
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

// Cerrar modal
cerrarModalBtn.addEventListener('click', () => modal.classList.add('oculto'));

// Cargar lista al abrir Administrador
document.querySelector('.role-btn[data-role="administrador"]').addEventListener('click', () => {
  cargarDirectores();
});
