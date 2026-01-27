// --- Conexión Supabase ---
const supabaseUrl = 'https://atmflikzjdhwnssjsxhn.supabase.co';
const supabaseKey = 'sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// --- Variables globales ---
let rolUsuario = null;
let ultimaSeccion = null;
let editarObjeto = null;

// --- Iniciar app ---
function iniciar(rol) {
    rolUsuario = rol;
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    if (rolUsuario === 'director') {
        document.getElementById('btn-agregar-director').style.display = 'inline-block';
        document.getElementById('btn-agregar-musica').style.display = 'inline-block';
    }

    cargarDirectores();
    cargarMusicas();
}

// --- Regresar ---
function regresar() {
    document.getElementById('formulario').style.display = 'none';
    document.getElementById('seccion-directores').style.display = 'block';
    document.getElementById('seccion-musicas').style.display = 'block';
    document.getElementById('btn-atras').style.display = 'none';

    // Limpiar preview
    const preview = document.getElementById('preview-acorde');
    preview.src = '';
    preview.style.display = 'none';
}

// --- Cargar directores ---
async function cargarDirectores() {
    const { data, error } = await supabaseClient.from('directores').select('*');
    const lista = document.getElementById('lista-directores');
    lista.innerHTML = '';

    if (error) return lista.innerHTML = `<li>Error: ${error.message}</li>`;

    data.forEach(director => {
        const li = document.createElement('li');
        li.textContent = director.nombre;
        li.className = 'tarjeta';
        li.dataset.id = director.id;

        li.addEventListener('click', () => cargarMusicas(director.id));

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'secondary';
            btnEditar.onclick = (e) => { e.stopPropagation(); abrirFormulario('directores', director, false); };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'danger';
            btnEliminar.onclick = (e) => { 
                e.stopPropagation();
                if (confirm(`Eliminar director ${director.nombre}?`)) {
                    supabaseClient.from('directores').delete().eq('id', director.id)
                        .then(() => cargarDirectores());
                }
            };

            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
        }

        lista.appendChild(li);
    });
}

// --- Cargar músicas ---
async function cargarMusicas(directorId = null) {
    let query = supabaseClient.from('musicas').select('*');
    if (directorId) query = query.eq('director_id', directorId);

    const { data, error } = await query;
    const lista = document.getElementById('lista-musicas');
    lista.innerHTML = '';

    if (error) return lista.innerHTML = `<li>Error: ${error.message}</li>`;
    if (data.length === 0) return lista.innerHTML = '<li>No hay músicas disponibles</li>';

    data.forEach(musica => {
        const li = document.createElement('li');
        li.className = 'tarjeta';

        // Imagen del acorde
        if (musica.acorde_url) {
            const img = document.createElement('img');
            img.src = musica.acorde_url;
            img.alt = 'Acorde';
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.marginRight = '10px';
            img.style.borderRadius = '4px';
            li.appendChild(img);
        }

        const span = document.createElement('span');
        span.textContent = musica.titulo;
        li.appendChild(span);

        // Mostrar imagen al tocar la música
        li.addEventListener('click', () => {
            const preview = document.getElementById('preview-acorde');
            if (musica.acorde_url) {
                preview.src = musica.acorde_url;
                preview.style.display = 'block';
            }
        });

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'secondary';
            btnEditar.onclick = (e) => { e.stopPropagation(); abrirFormulario('musicas', musica, false); };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'danger';
            btnEliminar.onclick = (e) => { 
                e.stopPropagation();
                if (confirm(`Eliminar música ${musica.titulo}?`)) {
                    supabaseClient.from('musicas').delete().eq('id', musica.id)
                        .then(() => cargarMusicas(directorId));
                }
            };

            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
        }

        lista.appendChild(li);
    });
}

// --- Abrir formulario ---
async function abrirFormulario(tabla, objeto = null, crearNuevo = false) {
    editarObjeto = crearNuevo ? null : objeto;
    ultimaSeccion = tabla;

    document.getElementById('formulario').style.display = 'block';
    document.getElementById('btn-atras').style.display = 'inline-block';
    document.getElementById('seccion-directores').style.display = 'none';
    document.getElementById('seccion-musicas').style.display = 'none';

    const input = document.getElementById('input-nombre');
    const select = document.getElementById('select-director');
    const fileInput = document.getElementById('input-acorde');
    const preview = document.getElementById('preview-acorde');

    if (tabla === 'directores') {
        input.value = objeto && !crearNuevo ? objeto.nombre : '';
        select.style.display = 'none';
        fileInput.style.display = 'none';
        preview.style.display = 'none';
    } else if (tabla === 'musicas') {
        input.value = objeto && !crearNuevo ? objeto.titulo : '';
        select.style.display = 'inline-block';
        fileInput.style.display = 'inline-block';

        const { data: directores } = await supabaseClient.from('directores').select('*');
        select.innerHTML = '';
        directores.forEach(d => {
            const option = document.createElement('option');
            option.value = d.id;
            option.textContent = d.nombre;
            if (objeto && objeto.director_id === d.id) option.selected = true;
            select.appendChild(option);
        });

        // Previsualizar imagen si ya existe
        if (objeto && objeto.acorde_url) {
            preview.src = objeto.acorde_url;
            preview.style.display = 'block';
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }

        // Previsualización al seleccionar nuevo archivo
        fileInput.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        };
    }
}

// --- Guardar cambios ---
document.getElementById('btn-guardar').addEventListener('click', async () => {
    const input = document.getElementById('input-nombre').value.trim();
    const select = document.getElementById('select-director').value;
    const fileInput = document.getElementById('input-acorde');
    const preview = document.getElementById('preview-acorde');

    if (!input) return alert('Debe ingresar un valor');

    let acordeUrl = editarObjeto ? editarObjeto.acorde_url : null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabaseClient
            .storage.from('musicas-acordes')
            .upload(fileName, file);

        if (error) return alert('Error subiendo la imagen: ' + error.message);

        const { publicUrl } = supabaseClient.storage.from('musicas-acordes').getPublicUrl(fileName);
        acordeUrl = publicUrl;
    }

    if (ultimaSeccion === 'directores') {
        if (editarObjeto) {
            await supabaseClient.from('directores')
                .update({ nombre: input })
                .eq('id', editarObjeto.id);
        } else {
            await supabaseClient.from('directores')
                .insert([{ nombre: input }]);
        }
        cargarDirectores();
    } else if (ultimaSeccion === 'musicas') {
        const directorId = select;
        if (editarObjeto) {
            await supabaseClient.from('musicas')
                .update({ titulo: input, director_id: directorId, acorde_url: acordeUrl })
                .eq('id', editarObjeto.id);
        } else {
            await supabaseClient.from('musicas')
                .insert([{ titulo: input, director_id: directorId, acorde_url: acordeUrl }]);
        }
        cargarMusicas();
    }

    regresar();
});

// --- Botones agregar ---
document.getElementById('btn-agregar-director').addEventListener('click', () => abrirFormulario('directores', null, true));
document.getElementById('btn-agregar-musica').addEventListener('click', () => abrirFormulario('musicas', null, true));
