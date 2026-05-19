// ── Seed data ────────────────────────────────────────────────────────────────
// In a production build this module would be replaced by API calls.

const DB = (() => {
  const KEYS = { activities: 'esen_activities', students: 'esen_students', seq: 'esen_seq' };

  const defaultActivities = [
    { id: 1, tipo: 'Deportivo',  descripcion: 'Campeonato Interescolar de Fútbol',   fecha: '2026-03-10', resolucion: 'RES-001-2026', horas: 8,  estudiantes: ['García Mamani, Luis', 'Quispe Flores, Ana', 'Mamani Torres, Pedro'], estado: true },
    { id: 2, tipo: 'Cultural',   descripcion: 'Festival de Arte y Música',            fecha: '2026-03-22', resolucion: 'RES-002-2026', horas: 5,  estudiantes: ['Quispe Flores, Ana', 'Huanca Condori, María'], estado: true },
    { id: 3, tipo: 'Académico',  descripcion: 'Olimpiada de Matemáticas',             fecha: '2026-04-05', resolucion: 'RES-003-2026', horas: 6,  estudiantes: ['García Mamani, Luis', 'Mamani Torres, Pedro'], estado: true },
    { id: 4, tipo: 'Social',     descripcion: 'Jornada de Voluntariado Comunitario',  fecha: '2026-04-18', resolucion: 'RES-004-2026', horas: 10, estudiantes: ['Huanca Condori, María', 'García Mamani, Luis'], estado: true },
    { id: 5, tipo: 'Deportivo',  descripcion: 'Torneo de Vóley Femenino',             fecha: '2026-05-02', resolucion: 'RES-005-2026', horas: 7,  estudiantes: ['Quispe Flores, Ana', 'Mamani Torres, Pedro'], estado: false },
  ];

  const defaultStudents = [
    { id: 1, codigo: 'EST-001', dni: '12345678', nombres: 'Luis',   apellidos: 'García Mamani',  escuela: 'Ingeniería de Sistemas' },
    { id: 2, codigo: 'EST-002', dni: '23456789', nombres: 'Ana',    apellidos: 'Quispe Flores',  escuela: 'Administración' },
    { id: 3, codigo: 'EST-003', dni: '34567890', nombres: 'Pedro',  apellidos: 'Mamani Torres',  escuela: 'Contabilidad' },
    { id: 4, codigo: 'EST-004', dni: '45678901', nombres: 'María',  apellidos: 'Huanca Condori', escuela: 'Derecho' },
  ];

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function nextId(entity) {
    const seq = load(KEYS.seq, {});
    const n = (seq[entity] || 5) + 1;
    seq[entity] = n;
    save(KEYS.seq, seq);
    return n;
  }

  // Activities
  function getActivities() { return load(KEYS.activities, defaultActivities); }
  function saveActivities(list) { save(KEYS.activities, list); }

  function addActivity(data) {
    const list = getActivities();
    const item = { id: nextId('activity'), ...data, estado: true };
    list.push(item);
    saveActivities(list);
    return item;
  }

  function updateActivity(id, data) {
    const list = getActivities();
    const idx  = list.findIndex(a => a.id === id);
    if (idx < 0) return null;
    list[idx] = { ...list[idx], ...data };
    saveActivities(list);
    return list[idx];
  }

  function deleteActivity(id) {
    const list = getActivities().filter(a => a.id !== id);
    saveActivities(list);
  }

  function toggleActivity(id) {
    const list = getActivities();
    const item = list.find(a => a.id === id);
    if (item) { item.estado = !item.estado; saveActivities(list); }
    return item;
  }

  // Students
  function getStudents() { return load(KEYS.students, defaultStudents); }
  function saveStudents(list) { save(KEYS.students, list); }

  function addStudent(data) {
    const list = getStudents();
    const item = { id: nextId('student'), ...data };
    list.push(item);
    saveStudents(list);
    return item;
  }

  function updateStudent(id, data) {
    const list = getStudents();
    const idx  = list.findIndex(s => s.id === id);
    if (idx < 0) return null;
    list[idx] = { ...list[idx], ...data };
    saveStudents(list);
    return list[idx];
  }

  function deleteStudent(id) {
    const list = getStudents().filter(s => s.id !== id);
    saveStudents(list);
  }

  return {
    getActivities, addActivity, updateActivity, deleteActivity, toggleActivity,
    getStudents, addStudent, updateStudent, deleteStudent,
  };
})();
