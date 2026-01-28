// ----------------- INICIO Y SECCIONES -----------------
const inicio = document.getElementById('inicio');
const administrador = document.getElementById('administrador');

const roleButtons = document.querySelectorAll('.role-btn');
roleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const rol = btn.getAttribute('data-role');
    localStorage.setItem('rolUsuario', rol);
    inicio.classList.add('oculto');

    if (rol === 'administrador') {
      administrador.classList.remove('oculto');
      cargarDirectores(); // Cargar lista al mostrar Administrador
    }
  });
});

// Botón volver al inicio
document.getElementById('volverInicioAdmin').addEventListener('click', () => {
  administrador.classList.add('oculto'); 
  inicio.classList.remove('oculto');
});

// ----------------- ADMINISTRADOR -----------------
const listaDirectores = document.getElementById('listaDirectores');
const nombreDirectorInput = document.getElementById('nombreDirector');
const idDirectorEditar = document.getElementById('idDirectorEditar');
const guardarDirectorBtn = document.getElementById('guardarDirector');
const cancelarEdicionBtn = document.getElementById('cancelarEdicion');

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

    // Editar
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.style.marginLeft = '10px';
    btnEditar.addEventListener('click', () => {
      nombreDirectorInput.value = d.nombre;
      idDirectorEditar.value = d.id;
      cancelarEdicionBtn.style.display = 'inline';
    });

    // Eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.style.marginLeft = '5px';
    btnEliminar.addEventListener('click', async () => {
      if (confirm(`Eliminar al director "${d.nombre}"?`)) {
        const { error } = await supabaseClient
          .from('directores')
          .delete()
          .eq('id', d.id);
        if (error) {
          alert('Error al eliminar: ' + error.message);
        } else {
          cargarDirectores();
        }
      }
    });

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    listaDirectores.appendChild(li);
  });
}

// Guardar nuevo o modificar
guardarDirectorBtn.addEventListener('click', async () => {
  const nombre = nombreDirectorInput.value.trim();
  const idEditar = idDirectorEditar.value;

  if (!nombre) { alert('Escriba un nombre'); return; }

  if (idEditar) {
    // Modificar
    const { error } = await supabaseClient
      .from('directores')
      .update({ nombre })
      .eq('id', idEditar);
    if (error) { alert('Error al modificar: ' + error.message); }
  } else {
    // Agregar
    const { error } = await supabaseClient
      .from('directores')
      .insert([{ nombre }]);
    if (error) { alert('Error al agregar: ' + error.message); }
  }

  nombreDirectorInput.value = '';
  idDirectorEditar.value = '';
  cancelarEdicionBtn.style.display = 'none';
  cargarDirectores();
});

// Cancelar edición
cancelarEdicionBtn.addEventListener('click', () => {
  nombreDirectorInput.value = '';
  idDirectorEditar.value = '';
  cancelarEdicionBtn.style.display = 'none';
});
