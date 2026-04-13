import { useState, useMemo, useEffect } from 'react';

const TYPES = {
  'P':  { label: 'P',  name: 'Povinný',            color: 'var(--accent-p)'  },
  'PV': { label: 'PV', name: 'Povinně volitelný',  color: 'var(--accent-pv)' },
  'V':  { label: 'V',  name: 'Volitelný',           color: 'var(--accent-v)'  }
};

const INITIAL_SUBJECTS = [
  { id: '1', name: 'Základy programování',  code: 'IT101',  credits: 6, type: 'P',  season: 'winter', lectures: 2, practices: 2, labs: 0, selfStudy: 4, kosLink: 'https://kos.cvut.cz/', semesterId: null },
  { id: '2', name: 'Pokročilá matematika',  code: 'MAT201', credits: 5, type: 'P',  season: 'summer', lectures: 3, practices: 1, labs: 0, selfStudy: 3, kosLink: '', semesterId: null },
  { id: '3', name: 'Umělá inteligence',     code: 'AI300',  credits: 4, type: 'PV', season: 'winter', lectures: 2, practices: 0, labs: 2, selfStudy: 5, kosLink: '', semesterId: null },
  { id: '4', name: 'Komunikace a soft skills', code: 'HUM105', credits: 2, type: 'V', season: 'both',   lectures: 0, practices: 2, labs: 0, selfStudy: 0, kosLink: '', semesterId: null }
];

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const LS = {
  getUsers: ()       => JSON.parse(localStorage.getItem('planner_users') || '[]'),
  saveUsers: (list)  => localStorage.setItem('planner_users', JSON.stringify(list)),
  getLastUser: ()    => localStorage.getItem('planner_last_user') || null,
  setLastUser: (u)   => localStorage.setItem('planner_last_user', u),
  clearLastUser: ()  => localStorage.removeItem('planner_last_user'),
  getData: (u)       => JSON.parse(localStorage.getItem(`planner_data_${u}`) || 'null'),
  saveData: (u, d)   => localStorage.setItem(`planner_data_${u}`, JSON.stringify(d)),
};

export default function App() {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [users,       setUsers]       = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');

  // ── Planner state ───────────────────────────────────────────────────────────
  const [subjects,        setSubjects]        = useState([]);
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [draggedSubjectId, setDraggedSubjectId] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', credits: 3, type: 'P', season: 'both', lectures: 0, practices: 0, labs: 0, selfStudy: 0, kosLink: '' });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [semesterCount, setSemesterCount] = useState(4);
  const [semesterTitles, setSemesterTitles] = useState({});
  const [editingSemesterId, setEditingSemesterId] = useState(null);
  const [tempSemesterTitle, setTempSemesterTitle] = useState('');

  // ── Bootstrap: load users + auto-login last user ───────────────────────────
  useEffect(() => {
    const savedUsers = LS.getUsers();
    setUsers(savedUsers);
    const last = LS.getLastUser();
    if (last && savedUsers.includes(last)) {
      loginUser(last);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist subjects whenever they change ──────────────────────────────────
  useEffect(() => {
    if (currentUser !== null) {
      LS.saveData(currentUser, { subjects, semesterCount, semesterTitles });
    }
  }, [subjects, semesterCount, semesterTitles, currentUser]);

  // ── Auth handlers ───────────────────────────────────────────────────────────
  const loginUser = (username) => {
    setCurrentUser(username);
    LS.setLastUser(username);
    const saved = LS.getData(username);
    if (saved) {
      if (Array.isArray(saved)) {
        setSubjects(saved);
        setSemesterCount(4);
        setSemesterTitles({});
      } else {
        setSubjects(saved.subjects || INITIAL_SUBJECTS);
        setSemesterCount(saved.semesterCount || 4);
        setSemesterTitles(saved.semesterTitles || {});
      }
    } else {
      setSubjects(INITIAL_SUBJECTS);
      setSemesterCount(4);
      setSemesterTitles({});
    }
  };

  const handleSelectUser = (username) => loginUser(username);

  const handleRegister = (e) => {
    e.preventDefault();
    const trimmed = newUsername.trim();
    if (!trimmed) return;
    let updatedUsers = users;
    if (!users.includes(trimmed)) {
      updatedUsers = [...users, trimmed];
      setUsers(updatedUsers);
      LS.saveUsers(updatedUsers);
    }
    setNewUsername('');
    loginUser(trimmed);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSubjects([]);
    LS.clearLastUser();
  };

  // ── Subject handlers ────────────────────────────────────────────────────────
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubjectId(null);
    setFormData({ name: '', code: '', credits: 3, type: 'P', season: 'both', lectures: 0, practices: 0, labs: 0, selfStudy: 0, kosLink: '' });
  };

  const handleEditClick = (sub) => {
    setFormData({
      name: sub.name,
      code: sub.code,
      credits: sub.credits,
      type: sub.type,
      season: sub.season || 'both',
      lectures: sub.lectures ?? 0,
      practices: sub.practices ?? 0,
      labs: sub.labs ?? 0,
      selfStudy: sub.selfStudy ?? 0,
      kosLink: sub.kosLink || ''
    });
    setEditingSubjectId(sub.id);
    setIsModalOpen(true);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    
    // Parse form data integers
    const parsedData = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      credits: parseInt(formData.credits, 10),
      type: formData.type,
      season: formData.season,
      lectures: parseInt(formData.lectures, 10) || 0,
      practices: parseInt(formData.practices, 10) || 0,
      labs: parseInt(formData.labs, 10) || 0,
      selfStudy: parseInt(formData.selfStudy, 10) || 0,
      kosLink: formData.kosLink ? formData.kosLink.trim() : ''
    };

    if (editingSubjectId) {
      setSubjects(prev => prev.map(s => s.id === editingSubjectId ? { ...s, ...parsedData } : s));
    } else {
      setSubjects(prev => [...prev, { id: crypto.randomUUID(), semesterId: null, ...parsedData }]);
    }
    
    closeModal();
  };

  const handleRemoveSubject = (id) => setSubjects(prev => prev.filter(s => s.id !== id));

  const handleAddSemester = () => setSemesterCount(c => c + 1);

  const handleRemoveSemester = () => {
    if (semesterCount <= 1) return;
    const removedId = semesterCount;
    setSubjects(prev => prev.map(s => s.semesterId === removedId ? { ...s, semesterId: null } : s));
    setSemesterCount(c => c - 1);
  };

  const handleResetSemester = (id) => {
    if (window.confirm(`Are you sure you want to remove all subjects from Semester ${id}?`)) {
      setSubjects(prev => prev.map(s => s.semesterId === id ? { ...s, semesterId: null } : s));
    }
  };

  const handleSaveSemesterTitle = (id) => {
    const trimmed = tempSemesterTitle.trim();
    setSemesterTitles(prev => ({
      ...prev,
      [id]: trimmed ? trimmed : `Semester ${id}`
    }));
    setEditingSemesterId(null);
  };

  const handleExport = () => {
    const allData = { 
      version: '1.0',
      timestamp: new Date().toISOString(),
      username: currentUser,
      subjects,
      semesterCount,
      semesterTitles
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `semester_planner_${currentUser}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.subjects && data.semesterCount !== undefined) {
          if (window.confirm('Importing will overwrite your current plan for this profile. Continue?')) {
            setSubjects(data.subjects);
            setSemesterCount(data.semesterCount);
            setSemesterTitles(data.semesterTitles || {});
          }
        } else {
          alert('Invalid file format.');
        }
      } catch (err) {
        alert('Error reading file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const onDragStart = (e, id) => {
    setDraggedSubjectId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  const onDrop = (e, targetSemesterId) => {
    e.preventDefault();
    if (draggedSubjectId) {
      const subject = subjects.find(s => s.id === draggedSubjectId);
      
      if (targetSemesterId !== null && subject) {
        const isWinterSemester = targetSemesterId % 2 !== 0; // 1, 3 are odd (winter)
        
        if (subject.season === 'winter' && !isWinterSemester) {
          alert(`Subject "${subject.name}" is only available in Winter semesters (Semester 1, 3, etc.).`);
          setDraggedSubjectId(null);
          return;
        }
        
        if (subject.season === 'summer' && isWinterSemester) {
          alert(`Subject "${subject.name}" is only available in Summer semesters (Semester 2, 4, etc.).`);
          setDraggedSubjectId(null);
          return;
        }
      }

      setSubjects(prev => prev.map(s =>
        s.id === draggedSubjectId ? { ...s, semesterId: targetSemesterId } : s
      ));
    }
    setDraggedSubjectId(null);
  };

  const handleDrag = (e) => {
    // Ignore 0 which happens at the very end of the drag event
    if (e.clientY === 0) return;

    const threshold = 80;
    const speed = 15;

    // Scroll down if approaching bottom boundary
    if (window.innerHeight - e.clientY < threshold) {
      window.scrollBy(0, speed);
    } 
    // Scroll up if approaching top boundary
    else if (e.clientY < threshold) {
      window.scrollBy(0, -speed);
    }
  };

  // ── Derived state ───────────────────────────────────────────────────────────
  const unassignedSubjects = subjects.filter(s => s.semesterId === null);
  const unassignedCredits = unassignedSubjects.reduce((s, sub) => s + sub.credits, 0);
  const unassignedSchoolHours = unassignedSubjects.reduce((s, sub) => s + (sub.lectures || 0) + (sub.practices || 0) + (sub.labs || 0) + (sub.selfStudy || 0), 0);
  const unassignedHoursDist = { lectures: 0, practices: 0, labs: 0, selfStudy: 0 };
  const unassignedStats = { 
    P: { count: 0, credits: 0 }, 
    PV: { count: 0, credits: 0 }, 
    V: { count: 0, credits: 0 } 
  };
  unassignedSubjects.forEach(sub => {
    unassignedStats[sub.type].count++;
    unassignedStats[sub.type].credits += sub.credits;
    unassignedHoursDist.lectures += (sub.lectures || 0);
    unassignedHoursDist.practices += (sub.practices || 0);
    unassignedHoursDist.labs += (sub.labs || 0);
    unassignedHoursDist.selfStudy += (sub.selfStudy || 0);
  });

  const semesters = useMemo(() => {
    const semsIdArray = Array.from({ length: semesterCount }, (_, i) => i + 1);
    const sems = semsIdArray.map(id => ({ 
      id, title: semesterTitles[id] || `Semester ${id}`, subjects: [], credits: 0,
      schoolHours: 0, hoursDist: { lectures: 0, practices: 0, labs: 0, selfStudy: 0 },
      stats: { 
        P: { count: 0, credits: 0 }, 
        PV: { count: 0, credits: 0 }, 
        V: { count: 0, credits: 0 } 
      } 
    }));
    subjects.forEach(sub => {
      if (sub.semesterId !== null) {
        const sem = sems.find(s => s.id === sub.semesterId);
        if (sem) { 
          sem.subjects.push(sub); 
          sem.credits += sub.credits; 
          sem.stats[sub.type].count++;
          sem.stats[sub.type].credits += sub.credits;
          sem.schoolHours += (sub.lectures || 0) + (sub.practices || 0) + (sub.labs || 0) + (sub.selfStudy || 0);
          sem.hoursDist.lectures += (sub.lectures || 0);
          sem.hoursDist.practices += (sub.practices || 0);
          sem.hoursDist.labs += (sub.labs || 0);
          sem.hoursDist.selfStudy += (sub.selfStudy || 0);
        }
      }
    });
    return sems;
  }, [subjects, semesterCount, semesterTitles]);

  const totalCredits = useMemo(() => semesters.reduce((s, sem) => s + sem.credits, 0), [semesters]);

  const totalCreditsStats = useMemo(() => {
    const s = { P: 0, PV: 0, V: 0 };
    semesters.forEach(sem => {
      s.P += sem.stats.P.credits;
      s.PV += sem.stats.PV.credits;
      s.V += sem.stats.V.credits;
    });
    return s;
  }, [semesters]);

  // ── Render helpers ──────────────────────────────────────────────────────────
  const renderStats = (stats, totalSubjects, totalCredits, schoolHours, hoursDist) => (
    <div className="stats-row">
      <span className="stat-item total" title="Total Subjects">{totalSubjects} subj</span>
      <span className="stat-item total" title={`Total Credits\nPovinný (P): ${stats.P.credits} cr\nPovinně volitelný (PV): ${stats.PV.credits} cr\nVolitelný (V): ${stats.V.credits} cr`}>{totalCredits} cr</span>
      <span className="stat-item total" title={`Přednášky: ${hoursDist.lectures}\nCvičení: ${hoursDist.practices}\nLaboratoře: ${hoursDist.labs}\nSamostudium: ${hoursDist.selfStudy}`}>🏫 {schoolHours} hrs</span>
      <div className="stat-types">
        <span className="stat-item stat-p" title={`Povinný (P): ${stats.P.credits} credits`}>{stats.P.count}</span>
        <span className="stat-item stat-pv" title={`Povinně volitelný (PV): ${stats.PV.credits} credits`}>{stats.PV.count}</span>
        <span className="stat-item stat-v" title={`Volitelný (V): ${stats.V.credits} credits`}>{stats.V.count}</span>
      </div>
    </div>
  );

  const renderSubjectCard = (sub) => {
    const typeInfo = TYPES[sub.type];
    return (
      <div
        key={sub.id}
        className={`subject-card ${draggedSubjectId === sub.id ? 'is-dragging' : ''}`}
        style={{ '--type-color': typeInfo.color, cursor: 'pointer' }}
        draggable
        onDragStart={(e) => onDragStart(e, sub.id)}
        onDrag={handleDrag}
        onClick={() => handleEditClick(sub)}
      >
        <div className="subject-header">
          <span className="subject-code">{sub.code}</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {sub.kosLink && (
              <a 
                href={sub.kosLink} 
                target="_blank" 
                rel="noreferrer" 
                onClick={(e) => { e.stopPropagation(); }} 
                title="Open KOS link"
                style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
            {sub.season === 'winter' && <span title="Winter Semester" style={{ fontSize: '0.85rem' }}>❄️</span>}
            {sub.season === 'summer' && <span title="Summer Semester" style={{ fontSize: '0.85rem' }}>☀️</span>}
            {sub.season === 'both' && <span title="Both Semesters" style={{ fontSize: '0.85rem' }}>❄️/☀️</span>}
            <span className="subject-type" title={typeInfo.name}>{typeInfo.label}</span>
          </div>
        </div>
        <div className="subject-name">{sub.name}</div>
        <div className="subject-credits">{sub.credits} credits</div>
        <button className="remove-btn" onClick={(e) => { e.stopPropagation(); handleRemoveSubject(sub.id); }} title="Remove Subject">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </div>
    );
  };

  // ── LOGIN SCREEN ────────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>Semester Planner</h1>
            <p>Plan your academic journey. Sign in to continue.</p>
          </div>

          <div className="login-content">
            {users.length > 0 && (
              <div className="login-section">
                <h3>Select Profile</h3>
                <div className="user-list">
                  {users.map(u => (
                    <button key={u} className="user-select-btn" onClick={() => handleSelectUser(u)}>
                      <span className="user-avatar">{u[0].toUpperCase()}</span>
                      <span className="user-name">{u}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {users.length > 0 && <div className="divider"><span>OR</span></div>}

            <div className="login-section">
              <h3>New Profile</h3>
              <form onSubmit={handleRegister} className="create-user-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username..."
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  required
                  autoFocus
                />
                <button type="submit" className="primary-btn">Get Started →</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN APP ────────────────────────────────────────────────────────────────
  return (
    <div className="app-container">
      <header>
        <div>
          <h1>Semester Planner</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Plan your next semesters intuitively</p>
        </div>
        <div className="header-actions">
          <div className="user-pill">
            <span className="user-pill-avatar">{currentUser[0].toUpperCase()}</span>
            <span>{currentUser}</span>
          </div>
          <div className="total-credits" title={`Total Scheduled Credits\nPovinný (P): ${totalCreditsStats.P} cr\nPovinně volitelný (PV): ${totalCreditsStats.PV} cr\nVolitelný (V): ${totalCreditsStats.V} cr`} style={{ cursor: 'help' }}>
            Total Credits: <span style={{ color: 'var(--accent-v)' }}>{totalCredits}</span>
          </div>
          <button className="secondary-btn" onClick={handleExport} title="Export current plan to JSON file">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <label className="secondary-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Import plan from JSON file">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="primary-btn" onClick={() => {
            setFormData({ name: '', code: '', credits: 3, type: 'P', season: 'both', lectures: 0, practices: 0, labs: 0, selfStudy: 0, kosLink: '' });
            setEditingSubjectId(null);
            setIsModalOpen(true);
          }}>+ Add Subject</button>
          <button className="secondary-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        {/* Subject Bank */}
        <section className="subject-bank-container" onDragOver={onDragOver} onDrop={(e) => onDrop(e, null)}>
          <div className="section-header">
            <h2>Available Subjects</h2>
            {renderStats(unassignedStats, unassignedSubjects.length, unassignedCredits, unassignedSchoolHours, unassignedHoursDist)}
          </div>
          <div className="subject-list">
            {unassignedSubjects.length > 0
              ? unassignedSubjects.map(renderSubjectCard)
              : <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginTop: '2rem' }}>All subjects have been scheduled.</p>
            }
          </div>
        </section>

        {/* Semester Board */}
        <section className="semester-board">
          {semesters.map(sem => (
            <div key={sem.id} className="semester-col" onDragOver={onDragOver} onDrop={(e) => onDrop(e, sem.id)}>
              <div className="semester-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {editingSemesterId === sem.id ? (
                    <input 
                      type="text" 
                      value={tempSemesterTitle}
                      autoFocus
                      onBlur={() => handleSaveSemesterTitle(sem.id)}
                      onChange={(e) => setTempSemesterTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveSemesterTitle(sem.id);
                        if (e.key === 'Escape') setEditingSemesterId(null);
                      }}
                      style={{ fontSize: '1.17em', fontWeight: 'bold', width: '100%', background: 'transparent', border: 'none', color: 'inherit', borderBottom: '1px solid var(--accent-primary)', outline: 'none', marginRight: '1rem' }}
                    />
                  ) : (
                    <h3 
                      onClick={() => {
                        setTempSemesterTitle(sem.title);
                        setEditingSemesterId(sem.id);
                      }}
                      title="Click to rename"
                      style={{ cursor: 'pointer', borderBottom: '1px dashed transparent', margin: 0, transition: 'border-color 0.2s', flex: 1 }}
                      onMouseEnter={(e) => e.target.style.borderBottomColor = 'var(--text-muted)'}
                      onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                    >
                      {sem.title}
                    </h3>
                  )}
                  <button 
                    onClick={() => handleResetSemester(sem.id)} 
                    title="Reset Semester"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                    </svg>
                  </button>
                </div>
                {renderStats(sem.stats, sem.subjects.length, sem.credits, sem.schoolHours, sem.hoursDist)}
              </div>
              <div className="semester-list">
                {sem.subjects.map(renderSubjectCard)}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '240px' }}>
            <button className="secondary-btn" onClick={handleAddSemester} style={{ borderStyle: 'dashed' }}>
              + Add Semester
            </button>
            {semesterCount > 1 && (
              <button className="secondary-btn" onClick={handleRemoveSemester} style={{ borderStyle: 'dashed', borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--accent-p)' }}>
                - Remove Semester
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Add/Edit Subject Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingSubjectId ? 'Edit Subject' : 'Add New Subject'}</h2>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Subject Name</label>
                <input type="text" className="form-control" required value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mathematics" />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input type="text" className="form-control" required value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. MAT202" />
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Credits</label>
                  <input type="number" className="form-control" required min="1" max="30"
                    value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Type</label>
                  <select className="form-control" value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="P">Povinný (P)</option>
                    <option value="PV">Povinně volitelný (PV)</option>
                    <option value="V">Volitelný (V)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Season</label>
                  <select className="form-control" value={formData.season || 'both'}
                    onChange={e => setFormData({...formData, season: e.target.value})}>
                    <option value="both">Both</option>
                    <option value="winter">Winter (Odd)</option>
                    <option value="summer">Summer (Even)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>KOS Link (optional)</label>
                <input type="url" className="form-control" value={formData.kosLink}
                  onChange={e => setFormData({...formData, kosLink: e.target.value})} placeholder="https://kos.cvut.cz/..." />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div>
                  <label>Přednášky</label>
                  <input type="number" className="form-control" min="0" value={formData.lectures}
                    onChange={e => setFormData({...formData, lectures: e.target.value})} />
                </div>
                <div>
                  <label>Cvičení</label>
                  <input type="number" className="form-control" min="0" value={formData.practices}
                    onChange={e => setFormData({...formData, practices: e.target.value})} />
                </div>
                <div>
                  <label>Laboratoře</label>
                  <input type="number" className="form-control" min="0" value={formData.labs}
                    onChange={e => setFormData({...formData, labs: e.target.value})} />
                </div>
                <div>
                  <label>Samostudium</label>
                  <input type="number" className="form-control" min="0" value={formData.selfStudy}
                    onChange={e => setFormData({...formData, selfStudy: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary-btn">{editingSubjectId ? 'Save Changes' : 'Add Subject'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
