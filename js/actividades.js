// ── Actividades ───────────────────────────────────────────────────────────────

const Actividades = (() => {

  let _filterTipo  = '';
  let _filterFecha = '';
  let _filterRes   = '';
  let _lastAlert   = null;

  // ── Render ──────────────────────────────────────────────────────────────────
  function render() {
    const acts = DB.getActivities().filter(a =>
      (!_filterTipo  || a.tipo === _filterTipo) &&
      (!_filterFecha || a.fecha === _filterFecha) &&
      (!_filterRes   || a.resolucion.toLowerCase().includes(_filterRes.toLowerCase()))
    );

    const alertHtml = _lastAlert ? UI.alert(_lastAlert) : '';
    _lastAlert = null;

    document.getElementById('content').innerHTML = `
      <div class="page-header">
        <div class="page-title">Gestión de Actividades</div>
        <div class="page-sub">Registre, modifique y administre actividades extracurriculares (RF02 – RF08)</div>
      </div>

      ${alertHtml}

      <div class="card">
        <div class="card-header">
          <div class="card-title">Lista de actividades</div>
          <button class="btn btn-teal" onclick="Actividades.openAgregar()">
            <i class="ti ti-plus"></i> Nueva actividad
          </button>
        </div>

        <div class="filters">
          <select class="filter-input" onchange="Actividades.setFilter('tipo', this.value)">
            <option value="">Todos los tipos</option>
            <option value="Deportivo"  ${_filterTipo==='Deportivo' ?'selected':''}>Deportivo</option>
            <option value="Cultural"   ${_filterTipo==='Cultural'  ?'selected':''}>Cultural</option>
            <option value="Académico"  ${_filterTipo==='Académico' ?'selected':''}>Académico</option>
            <option value="Social"     ${_filterTipo==='Social'    ?'selected':''}>Social</option>
          </select>
          <input type="date" class="filter-input" value="${_filterFecha}"
            onchange="Actividades.setFilter('fecha', this.value)" />
          <input type="text" class="filter-input" placeholder="Buscar resolución…"
            value="${_filterRes}"
            oninput="Actividades.setFilter('res', this.value)" />
        </div>

        ${acts.length ? `
        <table>
          <thead>
            <tr>
              <th>Descripción</th><th>Tipo</th><th>Fecha</th>
              <th>Resolución</th><th>Horas</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${acts.map(a => `
            <tr>
              <td>${a.descripcion}</td>
              <td><span class="tag ${UI.tagClass(a.tipo)}">${a.tipo}</span></td>
              <td>${a.fecha}</td>
              <td style="font-size:12px;color:var(--text-secondary)">${a.resolucion}</td>
              <td>${a.horas}h</td>
              <td>${UI.estadoTag(a.estado)}</td>
              <td>
                <div class="btn-row">
                  <button class="btn btn-sm" onclick="Actividades.openEditar(${a.id})" title="Editar">
                    <i class="ti ti-edit"></i>
                  </button>
                  <button class="btn btn-sm" onclick="Actividades.toggle(${a.id})"
                    title="${a.estado ? 'Deshabilitar' : 'Habilitar'}">
                    <i class="ti ti-${a.estado ? 'eye-off' : 'eye'}"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="Actividades.remove(${a.id})" title="Eliminar">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>` : UI.emptyState('ti-calendar-off', 'No hay actividades que coincidan con los filtros.')}
      </div>`;
  }

  function setFilter(key, val) {
    if (key === 'tipo')  _filterTipo  = val;
    if (key === 'fecha') _filterFecha = val;
    if (key === 'res')   _filterRes   = val;
    render();
  }

  // ── Form helpers ─────────────────────────────────────────────────────────────
  function _studentsChecklist(selected = []) {
    return DB.getStudents().map(s => {
      const fullName = `${s.apellidos}, ${s.nombres}`;
      return `<label>
        <input type="checkbox" class="est-check" value="${fullName}"
          ${selected.includes(fullName) ? 'checked' : ''}>
        ${fullName}
      </label>`;
    }).join('');
  }

  function _formBody(a = {}) {
    return `
      <div class="form-group">
        <label class="form-label">Descripción</label>
        <input class="form-control" id="m-desc" value="${a.descripcion || ''}" placeholder="Nombre de la actividad">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tipo / Categoría</label>
          <select class="form-control" id="m-tipo">
            ${['Deportivo','Cultural','Académico','Social'].map(t =>
              `<option ${t === a.tipo ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha</label>
          <input class="form-control" id="m-fecha" type="date" value="${a.fecha || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">N.° Resolución</label>
          <input class="form-control" id="m-res" value="${a.resolucion || ''}" placeholder="RES-XXX-2026">
        </div>
        <div class="form-group">
          <label class="form-label">Horas</label>
          <input class="form-control" id="m-horas" type="number" min="1" value="${a.horas || ''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Estudiantes participantes</label>
        <div class="check-list">${_studentsChecklist(a.estudiantes || [])}</div>
      </div>`;
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  function openAgregar() {
    UI.openModal(UI.buildModal({
      title: 'Nueva actividad extracurricular',
      body:  _formBody(),
      onSave: 'Actividades.save()',
    }));
  }

  function openEditar(id) {
    const a = DB.getActivities().find(x => x.id === id);
    if (!a) return;
    UI.openModal(UI.buildModal({
      title:     'Editar actividad',
      body:      _formBody(a),
      onSave:    `Actividades.update(${id})`,
      saveLabel: 'Actualizar',
    }));
  }

  function _readForm() {
    return {
      descripcion: UI.val('m-desc') || 'Sin título',
      tipo:        UI.val('m-tipo'),
      fecha:       UI.val('m-fecha') || new Date().toISOString().slice(0, 10),
      resolucion:  UI.val('m-res')  || 'RES-XXX-2026',
      horas:       parseInt(document.getElementById('m-horas').value) || 0,
      estudiantes: UI.checkedValues('.est-check'),
    };
  }

  function save() {
    DB.addActivity(_readForm());
    UI.closeModal();
    _lastAlert = 'Actividad registrada exitosamente.';
    render();
  }

  function update(id) {
    DB.updateActivity(id, _readForm());
    UI.closeModal();
    _lastAlert = 'Actividad actualizada exitosamente.';
    render();
  }

  function remove(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta actividad?')) return;
    DB.deleteActivity(id);
    _lastAlert = 'Actividad eliminada.';
    render();
  }

  function toggle(id) {
    const a = DB.toggleActivity(id);
    _lastAlert = a
      ? `Actividad ${a.estado ? 'habilitada' : 'deshabilitada'} correctamente.`
      : null;
    render();
  }

  return { render, setFilter, openAgregar, openEditar, save, update, remove, toggle };
})();
