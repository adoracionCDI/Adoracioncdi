// Selección de rol
const roleButtons = document.querySelectorAll('.role-btn');
const inicio = document.getElementById('inicio');
const administrador = document.getElementById('administrador');
const director = document.getElementById('director');
const musico = document.getElementById('musico');

roleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const rol = btn.getAttribute('data-role');
    localStorage.setItem('rolUsuario', rol);
    inicio.classList.add('oculto');

    if(rol === 'administrador') administrador.classList.remove('oculto');
    if(rol === 'director') director.classList.remove('oculto');
    if(rol === 'musico') musico.classList.remove('oculto');

    // Aquí podés cargar la música desde Supabase según el rol
  });
});

// Botones para volver al inicio
document.getElementById('volverInicioAdmin').addEventListener('click', () => {
  administrador.classList.add('oculto'); inicio.classList.remove('oculto');
});
document.getElementById('volverInicioDirector').addEventListener('click', () => {
  director.classList.add('oculto'); inicio.classList.remove('oculto');
});
document.getElementById('volverInicioMusico').addEventListener('click', () => {
  musico.classList.add('oculto'); inicio.classList.remove('oculto');
});
