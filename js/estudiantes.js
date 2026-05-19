// ── Estudiantes ───────────────────────────────────────────────────────────────

const Estudiantes = (() => {

  let _lastAlert = null;

  function _horasPorEstudiante(s) {
    const fullName = `${s.apellidos}, ${s.nombres}`;
    return DB.getActivities()
      .filter(a => a.estado && a.estudiantes.includes(fullName))
      .reduce((sum, a) => sum + a.horas, 0);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  function render() {
    const students  = DB.getStudents();
    const alertHtml = _lastAlert ? UI.alert(_lastAlert) : '';
    _lastAlert      = null;

    document.getElementById('content').innerHTML = `
      <div class="page-header">
        <div class="page-title">Gestión de Estudiantes</div>
        <div class="page-sub">Administre el registro de estudiantes del sistema</div>
      </div>

      ${alertHtml}

      <div class="card">
        <div class="card-header">
          <div class="card-title">Lista de estudiantes</div>
          <button class="btn btn-teal" onclick="Estudiantes.openAgregar()">
            <i class="ti ti-user-plus"></i> Nuevo estudiante
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código</th><th>DNI</th><th>Nombre completo</th>
              <th>Escuela</th><th>Horas acum.</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
            <tr>
              <td style="font-size:12px;color:var(--text-secondary)">${s.codigo}</td>
              <td>${s.dni}</td>
              <td><strong style="font-weight:500">${s.apellidos}, ${s.nombres}</strong></td>
              <td>${s.escuela}</td>
              <td>
                <span class="tag" style="background:var(--teal-50);color:var(--teal-600)">
                  ${_horasPorEstudiante(s)}h
                </span>
              </td>
              <td>
                <div class="btn-row">
                  <button class="btn btn-sm" onclick="Estudiantes.openEditar(${s.id})" title="Editar">
                    <i class="ti ti-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="Estudiantes.remove(${s.id})" title="Eliminar">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  // ── Form helpers ─────────────────────────────────────────────────────────────
  function _formBody(s = {}) {
    return `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nombres</label>
          <input class="form-control" id="s-nombres" value="${s.nombres || ''}" placeholder="Nombres">
        </div>
        <div class="form-group">
          <label class="form-label">Apellidos</label>
          <input class="form-control" id="s-apellidos" value="${s.apellidos || ''}" placeholder="Apellidos">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Código</label>
          <input class="form-control" id="s-codigo" value="${s.codigo || ''}" placeholder="EST-00X">
        </div>
        <div class="form-group">
          <label class="form-label">DNI</label>
          <input class="form-control" id="s-dni" value="${s.dni || ''}" placeholder="12345678">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Escuela / Facultad</label>
        <input class="form-control" id="s-escuela" value="${s.escuela || ''}" placeholder="Ingeniería de Sistemas">
      </div>`;
  }

  function _readForm() {
    return {
      nombres:   UI.val('s-nombres')  || 'Sin nombre',
      apellidos: UI.val('s-apellidos')|| 'Sin apellido',
      codigo:    UI.val('s-codigo')   || 'EST-000',
      dni:       UI.val('s-dni')      || '00000000',
      escuela:   UI.val('s-escuela')  || 'Sin escuela',
    };
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  function openAgregar() {
    UI.openModal(UI.buildModal({
      title: 'Nuevo estudiante',
      body:  _formBody(),
      onSave: 'Estudiantes.save()',
    }));
  }

  function openEditar(id) {
    const s = DB.getStudents().find(x => x.id === id);
    if (!s) return;
    UI.openModal(UI.buildModal({
      title:     'Editar estudiante',
      body:      _formBody(s),
      onSave:    `Estudiantes.update(${id})`,
      saveLabel: 'Actualizar',
    }));
  }

  function save() {
    DB.addStudent(_readForm());
    UI.closeModal();
    _lastAlert = 'Estudiante registrado exitosamente.';
    render();
  }

  function update(id) {
    DB.updateStudent(id, _readForm());
    UI.closeModal();
    _lastAlert = 'Estudiante actualizado exitosamente.';
    render();
  }

  function remove(id) {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) return;
    DB.deleteStudent(id);
    _lastAlert = 'Estudiante eliminado.';
    render();
  }

  return { render, openAgregar, openEditar, save, update, remove };
})();
