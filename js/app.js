console.log('app.js cargado');

async function probarSupabase() {
  const { data, error } = await supabase
    .from('canciones')
    .select('*');

  if (error) {
    console.error('Error Supabase:', error);
    return;
  }

  console.log('Canciones desde Supabase:', data);
}

probarSupabase();

document.getElementById('director').addEventListener('change', async (e) => {
  const director = e.target.value;

  const { data, error } = await supabase
    .from('canciones')
    .select('*')
    .eq('director', director);

  if (error) {
    console.error(error);
    return;
  }

  console.log('Canciones del director', director, data);
});
