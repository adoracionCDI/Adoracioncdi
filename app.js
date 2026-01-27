// Conexión a Supabase
const supabaseUrl = 'https://atmflikzjdhwnssjsxhn.supabase.co';
const supabaseKey = 'sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF';
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Rol del usuario
let rolUsuario = null;
let ultimaSeccion = null; // Para regresar
let editarObjeto = null;  // Objeto que se está editando

// Iniciar según rol
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

// Función regresar
function regresar() {
    document.getElementById('formulario').style.display = 'none';
    document.getElementById('seccion-directores').style.display = 'block';
    document.getElementById('seccion-musicas').style.display = 'block';
    document.getElementById('btn-atras').style.display = 'none';
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
            btnEditar.onclick = (e) => { e.stopPropagation(); abrirFormulario('directores', director); };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = (e) => { 
                e.stopPropagation(); 
                if(confirm(`Eliminar director ${director.nombre}?`)) {
                    window.supabaseClient.from('directores').delete().eq('id', director.id).then(() => cargarDirectores());
                }
            };

            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
        }

        lista.appendChild(li);
    });
}

// Cargar músicas
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

    if (data.length === 0) lista.innerHTML = '<li>No hay músicas disponibles</li>';

    data.forEach(musica => {
        const li = document.createElement('li');
        li.textContent = musica.titulo;

        if (rolUsuario === 'director') {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = (e) => { e.stopPropagation(); abrirFormulario('musicas', musica); };

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = (e) => { 
                e.stopPropagation(); 
                if(confirm(`Eliminar música ${musica.titulo}?`)) {
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

// Abrir formulario para agregar/editar
async function abrirFormulario(tabla, objeto = null) {
    editarObjeto = objeto;
    ultimaSeccion = tabla;
    document.getElementById('formulario').style.display = 'block';
    document.getElementById('btn-atras').style.display = 'inline-block';
    document.getElementById('seccion-directores').style.display = 'none';
    document.getElementById('seccion-musicas').style.display = 'none';

    const input = document.getElementById('input-nombre');
    const select = document.getElementById('select-director');

    if (tabla === 'directores') {
        input.value = objeto ? objeto.nombre : '';
        select.style.display = 'none';
    } else if (tabla === 'musicas') {
        input.value = objeto ? objeto.titulo : '';
        select.style.display = 'inline-block';
        // Cargar directores en select
        const { data: directores } = await window.supabaseClient.from('directores').select('*');
        select.innerHTML = '';
        directores.forEach(d => {
            const option = document.createElement('option');
            option.value = d.id;
            option.textContent = d.nombre;
            if(objeto && objeto.director_id === d.id) option.selected = true;
            select.appendChild(option);
        });
    }
}

// Guardar cambios
document.getElementById('btn-guardar').addEventListener('click', async () => {
    const input = document.getElementById('input-nombre').value.trim();
    const select = document.getElementById('select-director').value;

    if (!input) return alert('Debe ingresar un valor');

    if (ultimaSeccion === 'directores') {
        if (editarObjeto) {
            await window.supabaseClient.from('directores').update({ nombre: input }).eq('id', editarObjeto.id);
        } else {
            await window.supabaseClient.from('directores').insert([{ nombre: input }]);
        }
        cargarDirectores();
    } else if (ultimaSeccion === 'musicas') {
        if (editarObjeto) {
            await window.supabaseClient.from('musicas').update({ titulo: input, director_id: select }).eq('id', editarObjeto.id);
        } else {
            await window.supabaseClient.from('musicas').insert([{ titulo: input, director_id: select }]);
        }
        cargarMusicas();
    }

    regresar();
});

// Botones para agregar
document.getElementById('btn-agregar-director').addEventListener('click', () => abrirFormulario('directores'));
document.getElementById('btn-agregar-musica').addEventListener('click', () => abrirFormulario('musicas'));
