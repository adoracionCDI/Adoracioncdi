const buttons = document.querySelectorAll('.role-btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const rol = btn.getAttribute('data-role');
    localStorage.setItem('rolUsuario', rol);
    alert(`Has seleccionado: ${rol}`);
    // Ejemplo de redirección según rol:
    // window.location.href = rol + ".html";
  });
});
