console.log('app.js cargado');

async function probarSupabase() {
  const { data, error } = await supabaseClient
    .from('musicas')   // <-- tabla correcta
    .select('*');

  if (error) {
    console.error('Error Supabase:', error);
    return;
  }

  console.log('Musicas desde Supabase:', data);
}

probarSupabase();

document.getElementById('director').addEventListener('change', async (e) => {
  const director = e.target.value;

  const { data, error } = await supabaseClient
    .from('musicas')  // <-- tabla correcta
    .select('*')
    .eq('director', director);

  if (error) {
    console.error(error);
    return;
  }

  console.log('Musicas del director', director, data);
});
