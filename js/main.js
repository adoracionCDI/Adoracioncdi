// ---------- ADMINISTRADOR ----------
const listaDirectores = document.getElementById('listaDirectores');
const nombreDirectorInput = document.getElementById('nombreDirector');
const agregarDirectorBtn = document.getElementById('agregarDirector');

// Modal
const modal = document.getElementById('modalEditar');
const nombreEditarInput = document.getElementById('nombreEditar');
const guardarEditarBtn = document.getElementById('guardarEditar');
const cerrarModalBtn = document.getElementById('cerrarModal');

let idEditarActual = null;

// Cargar directores
async function cargarDirectores() {
  const { data, error } = await supabaseClient
    .from('directores')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al cargar directores:', error);
    return;
  }

  listaDirectores.innerHTML = '';

  data.forEach(d => {
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
    btnEliminar.addEventListener('click', async () => {
      if (confirm(`Eliminar al director "${d.nombre}"?`)) {
        const { error } = await supabaseClient
          .from('directores')
          .delete()
          .eq('id', d.id);
        if (error) alert('Error al eliminar: ' + error.message);
        else cargarDirectores();
      }
    });

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    listaDirectores.appendChild(li);
  });
}

// Agregar nuevo director
agregarDirectorBtn.addEventListener('click', async () => {
  const nombre = nombreDirectorInput.value.trim();
  if (!nombre) return alert('Escriba un nombre');

  const { error } = await supabaseClient
    .from('directores')
    .insert([{ nombre }]);

  if (error) alert('Error al agregar: ' + error.message);
  else {
    nombreDirectorInput.value = '';
    cargarDirectores();
  }
});

// Guardar edición desde modal
guardarEditarBtn.addEventListener('click', async () => {
  const nombre = nombreEditarInput.value.trim();
  if (!nombre) return alert('Escriba un nombre');

  const { error } = await supabaseClient
    .from('directores')
    .update({ nombre })
    .eq('id', idEditarActual);

  if (error) alert('Error al modificar: ' + error.message);
  else {
    modal.classList.add('oculto');
    cargarDirectores();
  }
});

// Cerrar modal sin guardar
cerrarModalBtn.addEventListener('click', () => {
  modal.classList.add('oculto');
});
