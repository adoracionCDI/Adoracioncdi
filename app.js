// --- Conexión Supabase ---
const supabaseUrl = 'https://atmflikzjdhwnssjsxhn.supabase.co';
const supabaseKey = 'sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// --- Función de prueba de insert ---
async function pruebaInsertMusica() {
    const nuevaMusica = {
        titulo: 'Canción de prueba',
        director_id: '5b772b19-cd03-41b0-afe5-24b7d2c52a6e', // pon un id válido de tu tabla directores
        acorde_url: null // o una URL de prueba si quieres
    };

    const { data, error } = await supabaseClient
        .from('musicas')
        .insert([nuevaMusica]);

    if (error) {
        console.error('❌ Error insertando música:', error.message);
        alert('Error insertando música: ' + error.message);
    } else {
        console.log('✅ Música insertada correctamente:', data);
        alert('Música insertada correctamente! Revisa la consola para detalles.');
    }
}

// --- Llamar a la función para probar ---
pruebaInsertMusica();
