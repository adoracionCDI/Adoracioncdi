// Conexión a Supabase
const supabaseUrl = 'https://atmflikzjdhwnssjsxhn.supabase.co';
const supabaseKey = 'sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función para cargar directores
async function cargarDirectores() {
    const { data, error } = await supabase.from('directores').select('*');
    const lista = document.getElementById('lista-directores');
    lista.innerHTML = ''; // Limpiar la lista

    if (error) {
        lista.innerHTML = `<li>Error cargando directores: ${error.message}</li>`;
        return;
    }

    data.forEach(director => {
        const li = document.createElement('li');
        li.textContent = director.nombre;
        li.dataset.id = director.id; // Guardamos id por si queremos filtrar canciones
        li.addEventListener('click', () => cargarMusicas(director.id));
        lista.appendChild(li);
    });
}

// Función para cargar músicas, opcionalmente filtrando por director
async function cargarMusicas(directorId = null) {
    let query = supabase.from('canciones').select('*');
    if (directorId) {
        query = query.eq('director_id', directorId);
    }

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
        lista.appendChild(li);
    });
}

// Cargar todo al inicio
cargarDirectores();
cargarMusicas();
