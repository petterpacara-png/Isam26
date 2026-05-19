// ── Auth ──────────────────────────────────────────────────────────────────────

const Auth = (() => {
  // Demo credentials — replace with real back-end call in production
  const CREDENTIALS = {
    admin:        { password: '1234', role: 'admin',   name: 'Administrador' },
    estudiante01: { password: '1234', role: 'student', name: 'Luis García Mamani' },
    estudiante02: { password: '1234', role: 'student', name: 'Ana Quispe Flores' },
  };

  let _session = null;

  function login(username, password) {
    const user = CREDENTIALS[username.trim().toLowerCase()];
    if (user && user.password === password) {
      _session = { username, role: user.role, name: user.name };
      return { ok: true, session: _session };
    }
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
  }

  function logout() { _session = null; }

  function session() { return _session; }

  function isAdmin() { return _session && _session.role === 'admin'; }

  return { login, logout, session, isAdmin };
})();
