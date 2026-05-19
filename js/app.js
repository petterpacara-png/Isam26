// ── App ───────────────────────────────────────────────────────────────────────

const App = (() => {

  const ADMIN_NAV = [
    { section: 'Principal' },
    { id: 'dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { section: 'Gestión' },
    { id: 'actividades',  icon: 'ti-calendar-event',   label: 'Actividades' },
    { id: 'estudiantes',  icon: 'ti-users',             label: 'Estudiantes' },
    { section: 'Reportes' },
    { id: 'reportes',     icon: 'ti-chart-bar',         label: 'Reportes' },
  ];

  const STUDENT_NAV = [
    { section: 'Mi cuenta' },
    { id: 'mis-actividades', icon: 'ti-calendar-event', label: 'Mis Actividades' },
    { id: 'mi-historial',    icon: 'ti-history',         label: 'Mi Historial' },
  ];

  let _currentPage = '';

  // ── Boot ─────────────────────────────────────────────────────────────────────
  function boot() {
    // Login button
    document.getElementById('btn-login').addEventListener('click', _handleLogin);
    document.getElementById('login-pass').addEventListener('keydown', e => {
      if (e.key === 'Enter') _handleLogin();
    });

    // Role tabs
    document.querySelectorAll('.role-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const role = tab.dataset.role;
        document.getElementById('login-user').value = role === 'admin' ? 'admin' : 'estudiante01';
      });
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', _handleLogout);
  }

  function _handleLogin() {
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;
    const result   = Auth.login(username, password);

    if (!result.ok) {
      document.getElementById('login-error').textContent = result.error;
      return;
    }

    document.getElementById('login-error').textContent = '';
    document.getElementById('login-screen').classList.add('hidden');
    const shell = document.getElementById('main-app');
    shell.classList.remove('hidden');

    // Set topbar info
    const s = Auth.session();
    document.getElementById('user-name').textContent = s.name;
    const badge = document.getElementById('role-badge');
    badge.textContent  = s.role === 'admin' ? 'Administrador' : 'Estudiante';
    badge.className    = 'role-badge ' + (s.role === 'admin' ? 'badge-admin' : 'badge-student');

    _buildSidebar(s.role);
    navigate(s.role === 'admin' ? 'dashboard' : 'mis-actividades');
  }

  function _handleLogout() {
    Auth.logout();
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-user').value = 'admin';
    document.getElementById('login-pass').value = '1234';
  }

  function _buildSidebar(role) {
    const nav = role === 'admin' ? ADMIN_NAV : STUDENT_NAV;
    document.getElementById('sidebar').innerHTML = nav.map(n =>
      n.section
        ? `<div class="nav-section">${n.section}</div>`
        : `<button class="nav-item" id="nav-${n.id}" onclick="App.navigate('${n.id}')">
             <i class="ti ${n.icon}" aria-hidden="true"></i>${n.label}
           </button>`
    ).join('');
  }

  // ── Router ────────────────────────────────────────────────────────────────────
  function navigate(page) {
    _currentPage = page;

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const active = document.getElementById('nav-' + page);
    if (active) active.classList.add('active');

    switch (page) {
      case 'dashboard':        _renderDashboard();        break;
      case 'actividades':      Actividades.render();      break;
      case 'estudiantes':      Estudiantes.render();      break;
      case 'reportes':         Reportes.render();         break;
      case 'mis-actividades':  MisActividades.render();   break;
      case 'mi-historial':     MiHistorial.render();      break;
    }
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  function _renderDashboard() {
    const acts     = DB.getActivities();
    const activas  = acts.filter(a => a.estado);
    const students = DB.getStudents();
    const totalH   = activas.reduce((s, a) => s + a.horas, 0);

    document.getElementById('content').innerHTML = `
      <div class="page-header">
        <div class="page-title">Dashboard</div>
        <div class="page-sub">Resumen general del sistema</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total actividades</div>
          <div class="stat-value stat-teal">${acts.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Actividades activas</div>
          <div class="stat-value stat-blue">${activas.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Horas acumuladas</div>
          <div class="stat-value stat-amber">${totalH}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Estudiantes registrados</div>
          <div class="stat-value stat-green">${students.length}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Actividades recientes</div>
          <button class="btn btn-teal" onclick="App.navigate('actividades')">
            Ver todas <i class="ti ti-arrow-right"></i>
          </button>
        </div>
        <table>
          <thead>
            <tr><th>Descripción</th><th>Tipo</th><th>Fecha</th><th>Horas</th><th>Estado</th></tr>
          </thead>
          <tbody>
            ${acts.slice(-5).reverse().map(a => `
            <tr>
              <td>${a.descripcion}</td>
              <td><span class="tag ${UI.tagClass(a.tipo)}">${a.tipo}</span></td>
              <td>${a.fecha}</td>
              <td>${a.horas}h</td>
              <td>${UI.estadoTag(a.estado)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  return { boot, navigate };
})();

// ── Start ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.boot());
