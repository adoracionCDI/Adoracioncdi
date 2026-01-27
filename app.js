// Conexión a Supabase
const supabaseUrl = 'https://atmflikzjdhwnssjsxhn.supabase.co';
const supabaseKey = 'sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF';
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Rol del usuario
let rolUsuario = null;

// Función para iniciar según rol
function iniciar(rol) {
    rolUsuario = rol;

    // Ocultar pantalla de inicio y mostrar app
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    // Mostrar botones solo si es director
    if (rolUsuario === 'director') {
        document.getElementById('btn-agregar-director').style.display = 'inline-block';
        document.getElementById('btn-agregar-musica').style.display = 'inline-block';
    }

    // Cargar datos
    cargarDirectores();
    cargarMusicas();
}

// Función para cargar directores
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

        // Si es director, permitimos editar/eliminar
        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = (e) => { e.stopPropagation(); alert(`Editar director ${director.nombre}`); };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = (e) => { e.stopPropagation(); alert(`Eliminar director ${director.nombre}`); };

            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
        }

        lista.appendChild(li);
    });
}

// Función para cargar músicas, opcionalmente filtrando por director
async function cargarMusicas(directorId = null) {
    let query = window.supabaseClient.from('canciones').select('*');
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

    data.forEach(cancion => {
        const li = document.createElement('li');
        li.textContent = cancion.titulo;

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = (e) => { e.stopPropagation(); alert(`Editar música ${cancion.titulo}`); };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = (e) => { e.stopPropagation(); alert(`Eliminar música ${cancion.titulo}`); };

            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
        }

        lista.appendChild(li);
    });
}

// Opcional: botones para agregar
document.getElementById('btn-agregar-director').addEventListener('click', () => {
    const nombre = prompt('Nombre del nuevo director:');
    if (!nombre) return;
    window.supabaseClient.from('directores').insert([{ nombre }])
        .then(() => cargarDirectores());
});

document.getElementById('btn-agregar-musica').addEventListener('click', () => {
    const titulo = prompt('Título de la nueva música:');
    const directorId = prompt('ID del director:'); // puedes mejorar con dropdown después
    if (!titulo || !directorId) return;
    window.supabaseClient.from('canciones').insert([{ titulo, director_id: directorId }])
        .then(() => cargarMusicas());
});
