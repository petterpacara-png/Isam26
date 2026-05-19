// ── Reportes ──────────────────────────────────────────────────────────────────

const Reportes = (() => {

  function render() {
    const acts     = DB.getActivities().filter(a => a.estado);
    const students = DB.getStudents();

    // Agrupar por tipo
    const byTipo = {};
    acts.forEach(a => { byTipo[a.tipo] = (byTipo[a.tipo] || 0) + 1; });

    const colorMap = {
      Deportivo: { bg: 'var(--blue-50)',  color: 'var(--blue-600)' },
      Cultural:  { bg: 'var(--amber-50)', color: 'var(--amber-400)' },
      Académico: { bg: 'var(--teal-50)',  color: 'var(--teal-600)' },
      Social:    { bg: 'var(--green-50)', color: 'var(--green-400)' },
    };

    document.getElementById('content').innerHTML = `
      <div class="page-header">
        <div class="page-title">Reportes</div>
        <div class="page-sub">Análisis y resumen de actividades extracurriculares (RF08)</div>
      </div>

      <div class="stats-grid">
        ${Object.entries(byTipo).map(([t, n]) => {
          const c = colorMap[t] || { bg: 'var(--gray-50)', color: 'var(--gray-400)' };
          return `<div class="stat-card">
            <div class="stat-label">${t}</div>
            <div class="stat-value" style="color:${c.color}">${n}</div>
          </div>`;
        }).join('')}
        <div class="stat-card">
          <div class="stat-label">Total horas acumuladas</div>
          <div class="stat-value stat-teal">${acts.reduce((s,a)=>s+a.horas,0)}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Reporte por estudiante</div>
          <button class="btn" onclick="Reportes.exportCSV()">
            <i class="ti ti-download"></i> Exportar CSV
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Estudiante</th><th>Escuela</th>
              <th>Actividades</th><th>Horas totales</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              const fullName = `${s.apellidos}, ${s.nombres}`;
              const myActs   = acts.filter(a => a.estudiantes.includes(fullName));
              const horas    = myActs.reduce((sum, a) => sum + a.horas, 0);
              return `<tr>
                <td style="font-size:12px;color:var(--text-secondary)">${s.codigo}</td>
                <td>${fullName}</td>
                <td>${s.escuela}</td>
                <td>${myActs.length}</td>
                <td><strong style="font-weight:600;color:var(--teal-600)">${horas}h</strong></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Reporte por actividad</div></div>
        <table>
          <thead>
            <tr><th>Actividad</th><th>Tipo</th><th>Fecha</th><th>Resolución</th><th>Horas</th><th>Participantes</th></tr>
          </thead>
          <tbody>
            ${acts.map(a => `
            <tr>
              <td>${a.descripcion}</td>
              <td><span class="tag ${UI.tagClass(a.tipo)}">${a.tipo}</span></td>
              <td>${a.fecha}</td>
              <td style="font-size:12px;color:var(--text-secondary)">${a.resolucion}</td>
              <td>${a.horas}h</td>
              <td>${a.estudiantes.length}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function exportCSV() {
    const acts     = DB.getActivities().filter(a => a.estado);
    const students = DB.getStudents();
    const rows     = [['Código', 'Estudiante', 'Escuela', 'Actividades', 'Horas totales']];

    students.forEach(s => {
      const fullName = `${s.apellidos}, ${s.nombres}`;
      const myActs   = acts.filter(a => a.estudiantes.includes(fullName));
      const horas    = myActs.reduce((sum, a) => sum + a.horas, 0);
      rows.push([s.codigo, fullName, s.escuela, myActs.length, horas]);
    });

    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'reporte_actividades.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return { render, exportCSV };
})();


// ── Vista Estudiante: Mis Actividades ─────────────────────────────────────────

const MisActividades = (() => {

  function render() {
    const session  = Auth.session();
    // Buscar el estudiante por nombre de sesión
    const students = DB.getStudents();
    const student  = students.find(s => session.name.includes(s.nombres)) || students[0];
    const fullName = `${student.apellidos}, ${student.nombres}`;
    const myActs   = DB.getActivities().filter(a => a.estado && a.estudiantes.includes(fullName));
    const totalH   = myActs.reduce((s, a) => s + a.horas, 0);

    document.getElementById('content').innerHTML = `
      <div class="page-header">
        <div class="page-title">Mis Actividades</div>
        <div class="page-sub">Actividades extracurriculares en las que participas (RF09 – RF10)</div>
      </div>

      <div class="hours-banner">
        <div>
          <div class="hours-num">${totalH}h</div>
          <div class="hours-label">Horas acumuladas totales</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:28px;font-weight:600;color:var(--teal-600)">${myActs.length}</div>
          <div style="font-size:13px;color:var(--teal-600)">Actividades validadas</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Actividades registradas</div></div>
        ${myActs.length ? `
        <table>
          <thead>
            <tr><th>Actividad</th><th>Tipo</th><th>Fecha</th><th>Resolución</th><th>Horas</th></tr>
          </thead>
          <tbody>
            ${myActs.map(a => `
            <tr>
              <td>${a.descripcion}</td>
              <td><span class="tag ${UI.tagClass(a.tipo)}">${a.tipo}</span></td>
              <td>${a.fecha}</td>
              <td style="font-size:12px;color:var(--text-secondary)">${a.resolucion}</td>
              <td>${a.horas}h</td>
            </tr>`).join('')}
          </tbody>
        </table>` : UI.emptyState('ti-calendar-off', 'No tienes actividades registradas aún.')}
      </div>`;
  }

  return { render };
})();


// ── Vista Estudiante: Mi Historial ────────────────────────────────────────────

const MiHistorial = (() => {

  function render() {
    const session  = Auth.session();
    const students = DB.getStudents();
    const student  = students.find(s => session.name.includes(s.nombres)) || students[0];
    const fullName = `${student.apellidos}, ${student.nombres}`;
    const myActs   = DB.getActivities().filter(a => a.estudiantes.includes(fullName));

    document.getElementById('content').innerHTML = `
      <div class="page-header">
        <div class="page-title">Mi Historial</div>
        <div class="page-sub">Historial completo de participación en actividades extracurriculares</div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Historial de participación</div></div>
        ${myActs.length ? `
        <table>
          <thead>
            <tr><th>Actividad</th><th>Tipo</th><th>Fecha</th><th>Horas</th><th>Validado</th></tr>
          </thead>
          <tbody>
            ${myActs.map(a => `
            <tr>
              <td>${a.descripcion}</td>
              <td><span class="tag ${UI.tagClass(a.tipo)}">${a.tipo}</span></td>
              <td>${a.fecha}</td>
              <td>${a.horas}h</td>
              <td>${UI.validadoTag(a.estado)}</td>
            </tr>`).join('')}
          </tbody>
        </table>` : UI.emptyState('ti-history', 'Sin historial de participación.')}
      </div>`;
  }

  return { render };
})();
