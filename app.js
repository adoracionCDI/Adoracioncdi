// Conexión a Supabase
const supabaseUrl = 'https://atmflikzjdhwnssjsxhn.supabase.co';
const supabaseKey = 'sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF';
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Rol del usuario
let rolUsuario = null;

// Iniciar según rol
function iniciar(rol) {
    rolUsuario = rol;

    // Mostrar app y ocultar pantalla de inicio
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    // Mostrar botones solo si es Director
    if (rolUsuario === 'director') {
        document.getElementById('btn-agregar-director').style.display = 'inline-block';
        document.getElementById('btn-agregar-musica').style.display = 'inline-block';
    }

    // Cargar listas
    cargarDirectores();
    cargarMusicas();
}

// Cargar directores
async function cargarDirectores() {
    const { data, error } = await window.supabaseClient.from('directores').select('*');
    const lista = document.getElementById('lista-directores');
    lista.innerHTML = '';

    if (error) {
        lista.innerHTML = `<li>Error cargando directores: ${error.message}</li>`;
        return;
    }

    data.forEach(director => {
        const li = document.createElement('li');
        li.textContent = director.nombre;
        li.dataset.id = director.id;
        li.addEventListener('click', () => cargarMusicas(director.id));

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = (e) => {
                e.stopPropagation();
                const nuevoNombre = prompt('Editar nombre del director:', director.nombre);
                if (nuevoNombre) {
                    window.supabaseClient.from('directores').update({ nombre: nuevoNombre }).eq('id', director.id)
                        .then(() => cargarDirectores());
                }
            };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Eliminar director ${director.nombre}?`)) {
                    window.supabaseClient.from('directores').delete().eq('id', director.id)
                        .then(() => cargarDirectores());
                }
            };

            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
        }

        lista.appendChild(li);
    });
}

// Cargar músicas, opcionalmente filtrando por director
async function cargarMusicas(directorId = null) {
    let query = window.supabaseClient.from('musicas').select('*');
    if (directorId) query = query.eq('director_id', directorId);

    const { data, error } = await query;
    const lista = document.getElementById('lista-musicas');
    lista.innerHTML = '';

    if (error) {
        lista.innerHTML = `<li>Error cargando músicas: ${error.message}</li>`;
        return;
    }

    if (data.length === 0) {
        lista.innerHTML = '<li>No hay músicas disponibles</li>';
        return;
    }

    data.forEach(musica => {
        const li = document.createElement('li');
        li.textContent = musica.titulo;

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = (e) => {
                e.stopPropagation();
                const nuevoTitulo = prompt('Editar título de la música:', musica.titulo);
                if (nuevoTitulo) {
                    window.supabaseClient.from('musicas').update({ titulo: nuevoTitulo }).eq('id', musica.id)
                        .then(() => cargarMusicas(directorId));
                }
            };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Eliminar música ${musica.titulo}?`)) {
                    window.supabaseClient.from('musicas').delete().eq('id', musica.id)
                        .then(() => cargarMusicas(directorId));
                }
            };

            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
        }

        lista.appendChild(li);
    });
}

// Botones de agregar
document.getElementById('btn-agregar-director').addEventListener('click', () => {
    const nombre = prompt('Nombre del nuevo director:');
    if (!nombre) return;
    window.supabaseClient.from('directores').insert([{ nombre }])
        .then(() => cargarDirectores());
});

document.getElementById('btn-agregar-musica').addEventListener('click', () => {
    const titulo = prompt('Título de la nueva música:');
    const directorId = prompt('ID del director:'); // luego se puede mejorar con dropdown
    if (!titulo || !directorId) return;
    window.supabaseClient.from('musicas').insert([{ titulo, director_id: directorId }])
        .then(() => cargarMusicas());
});
