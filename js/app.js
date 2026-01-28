let directorSeleccionado = null;

/* ================= DIRECTORES ================= */

async function cargarDirectores() {
  const { data } = await supabase
    .from('directores')
    .select('*')
    .order('nombre');

  const ul = document.getElementById('listaDirectores');
  ul.innerHTML = '';

  data.forEach(d => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${d.nombre}
      <div class="actions">
        <button onclick="seleccionarDirector('${d.id}','${d.nombre}')">📂</button>
        <button onclick="editarDirector('${d.id}','${d.nombre}')">✏️</button>
        <button onclick="eliminarDirector('${d.id}')">🗑</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

async function agregarDirector() {
  const nombre = document.getElementById('nuevoDirector').value.trim();
  if (!nombre) return;

  await supabase.from('directores').insert({ nombre });
  document.getElementById('nuevoDirector').value = '';
  cargarDirectores();
}

async function editarDirector(id, actual) {
  const nuevo = prompt('Editar nombre', actual);
  if (!nuevo) return;

  await supabase.from('directores')
    .update({ nombre: nuevo })
    .eq('id', id);

  cargarDirectores();
}

async function eliminarDirector(id) {
  if (!confirm('¿Eliminar director?')) return;

  await supabase.from('directores')
    .delete()
    .eq('id', id);

  cargarDirectores();
}

/* ================= MÚSICAS ================= */

async function seleccionarDirector(id, nombre) {
  directorSeleccionado = id;
  document.getElementById('seccionMusicas').classList.remove('oculto');
  document.getElementById('tituloDirector').innerText = `Músicas de ${nombre}`;
  cargarMusicas();
}

async function cargarMusicas() {
  const { data } = await supabase
    .from('musicas')
    .select('*')
    .eq('director_id', directorSeleccionado);

  const ul = document.getElementById('listaMusicas');
  ul.innerHTML = '';

  data.forEach(m => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${m.titulo} (${m.tonalidad})
      <div class="actions">
        <a href="${m.imagen_url}" target="_blank">🎵</a>
        <button onclick="eliminarMusica('${m.id}')">🗑</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

async function agregarMusica() {
  const titulo = document.getElementById('titulo').value;
  const tonalidad = document.getElementById('tonalidad').value;
  const empieza = document.getElementById('empieza').value;
  const archivo = document.getElementById('imagen').files[0];

  if (!archivo) return alert('Seleccioná una imagen');

  const nombreArchivo = Date.now() + '_' + archivo.name;

  await supabase.storage
    .from('musicas-acordes')
    .upload(nombreArchivo, archivo);

  const { data } = supabase.storage
    .from('musicas-acordes')
    .getPublicUrl(nombreArchivo);

  await supabase.from('musicas').insert({
    titulo,
    tonalidad,
    quien_empieza: empieza,
    imagen_url: data.publicUrl,
    director_id: directorSeleccionado
  });

  cargarMusicas();
}

async function eliminarMusica(id) {
  if (!confirm('¿Eliminar música?')) return;

  await supabase.from('musicas')
    .delete()
    .eq('id', id);

  cargarMusicas();
}

cargarDirectores();
