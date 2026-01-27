// --- Conexión a Supabase ---
const supabaseUrl = 'https://atmflikzjdhwnssjsxhn.supabase.co';
const supabaseKey = 'sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// --- Variables globales ---
let rolUsuario = null;
let ultimaSeccion = null;
let editarObjeto = null;

// --- Iniciar según rol ---
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

// --- Función regresar ---
function regresar() {
    document.getElementById('formulario').style.display = 'none';
    document.getElementById('seccion-directores').style.display = 'block';
    document.getElementById('seccion-musicas').style.display = 'block';
    document.getElementById('btn-atras').style.display = 'none';
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
        li.dataset.id = director.id;

        li.addEventListener('click', () => cargarMusicas(director.id));

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'secondary';
            btnEditar.onclick = (e) => { e.stopPropagation(); abrirFormulario('directores', director); };

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

        // Imagen del acorde
        if (musica.acorde_url) {
            const img = document.createElement('img');
            img.src = musica.acorde_url;
            img.alt = 'Acorde';
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.marginRight = '10px';
            li.appendChild(img);
        }

        const span = document.createElement('span');
        span.textContent = musica.titulo;
        li.appendChild(span);

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'secondary';
            btnEditar.onclick = (e) => { e.stopPropagation(); abrirFormulario('musicas', musica); };

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

    if (tabla === 'directores') {
        input.value = objeto && !crearNuevo ? objeto.nombre : '';
        select.style.display = 'none';
        fileInput.style.display = 'none';
    } else if (tabla === 'musicas') {
        input.value = ''; // vacío para escribir título
        select.style.display = 'inline-block';
        fileInput.style.display = 'inline-block';
        fileInput.value = ''; // limpiar cualquier archivo previo

        // Cargar directores
        const { data: directores } = await supabaseClient.from('directores').select('*');
        select.innerHTML = '';
        directores.forEach(d => {
            const option = document.createElement('option');
            option.value = d.id;
            option.textContent = d.nombre;
            select.appendChild(option);
        });
    }
}

// --- Guardar cambios ---
document.getElementById('btn-guardar').addEventListener('click', async () => {
    const input = document.getElementById('input-nombre').value.trim();
    const select = document.getElementById('select-director').value;
    const fileInput = document.getElementById('input-acorde');

    if (!input) return alert('Debe ingresar un valor');

    let acordeUrl = editarObjeto ? editarObjeto.acorde_url : null;

    // Subir imagen si hay
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabaseClient
            .storage.from('musicas-acordes')
            .upload(fileName, file);

        if (error) return alert('Error subiendo la imagen: ' + error.message);

        // Obtener URL pública
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
