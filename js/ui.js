// ── UI Helpers ────────────────────────────────────────────────────────────────

const UI = (() => {

  function tagClass(tipo) {
    return { Deportivo: 'tag-deportivo', Cultural: 'tag-cultural', Académico: 'tag-academico', Social: 'tag-social' }[tipo] || 'tag-deportivo';
  }

  function estadoTag(estado) {
    return estado
      ? '<span class="tag tag-active">Activa</span>'
      : '<span class="tag tag-inactive">Inactiva</span>';
  }

  function validadoTag(estado) {
    return estado
      ? '<span class="tag tag-active">Sí</span>'
      : '<span class="tag tag-inactive">No</span>';
  }

  function alert(msg, type = 'success') {
    const icon = type === 'success' ? 'ti-circle-check' : 'ti-alert-circle';
    return `<div class="alert alert-${type}"><i class="ti ${icon}"></i>${msg}</div>`;
  }

  function emptyState(icon, msg) {
    return `<div class="empty-state"><i class="ti ${icon}"></i><p>${msg}</p></div>`;
  }

  function openModal(html) {
    document.getElementById('modal-container').innerHTML = html;
  }

  function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
  }

  // Close on overlay click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });

  function buildModal({ title, body, onSave, saveLabel = 'Guardar' }) {
    return `
    <div class="modal-overlay">
      <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="modal-close" onclick="UI.closeModal()" aria-label="Cerrar">×</button>
        </div>
        ${body}
        <div class="modal-footer">
          <button class="btn" onclick="UI.closeModal()">Cancelar</button>
          <button class="btn btn-teal" onclick="${onSave}">
            <i class="ti ti-check"></i> ${saveLabel}
          </button>
        </div>
      </div>
    </div>`;
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function checkedValues(selector) {
    return [...document.querySelectorAll(selector + ':checked')].map(c => c.value);
  }

  function navigate(page) {
    App.navigate(page);
  }

  return {
    tagClass, estadoTag, validadoTag,
    alert, emptyState, openModal, closeModal, buildModal,
    val, checkedValues, navigate,
  };
})();
