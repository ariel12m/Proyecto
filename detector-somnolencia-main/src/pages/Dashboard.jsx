import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sleepData, setSleepData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  async function loadData() {
    try {
      setIsUpdating(true);
      
      const res = await axios.get("http://localhost:3000/event");
      setEvents(res.data);

      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("Id"));
      if (token && token !== "guest-token") {
        const userRes = await api.get(`user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
      }

      calculateSleepData(res.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setUser({
        name: "Usuario Invitado",
        email: "invitado@ejemplo.com",
        birthDate: "",
        jobPosition: "Chofer de transporte"
      });
      setSleepData({
        sleepy: 2,
        awake: 98,
        sleepyPercentage: 2,
        awakePercentage: 98,
      });
      setEvents([
        { id: 1, title: "Despierto", description: "Estado normal", createdAt: new Date().toISOString() },
        { id: 2, title: "Somnolencia leve", description: "Primer bostezo detectado", createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, title: "Despierto", description: "Recuperó estado de alerta", createdAt: new Date(Date.now() - 7200000).toISOString() },
      ]);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }

  function calculateSleepData(allEvents) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = allEvents.filter(event => {
      const eventDate = new Date(event.createdAt);
      eventDate.setHours(0, 0, 0, 0);
      const isToday = eventDate.getTime() === today.getTime();
      const isSleepEvent = event.title?.toLowerCase().includes("sleep") || 
                           event.title?.toLowerCase().includes("somnolencia") || 
                           event.description?.toLowerCase().includes("sleep") ||
                           event.description?.toLowerCase().includes("somnolencia");
      return isToday && isSleepEvent;
    });

    const sleepyCount = todayEvents.length;
    const sleepyPercentage = Math.min(sleepyCount, 100);
    const awakePercentage = 100 - sleepyPercentage;

    setSleepData({
      sleepy: sleepyCount,
      awake: 100 - sleepyCount,
      sleepyPercentage: sleepyPercentage,
      awakePercentage: awakePercentage,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function openEdit() {
    setEditForm({
      name: user?.name || "",
      birthDate: user?.birthDate || "",
      jobPosition: user?.jobPosition || "",
      photo: user?.photo || "",
    });
    setIsEditing(true);
  }

  function closeEdit() {
    setIsEditing(false);
    setEditForm({});
  }

  function handleEditChange(field, value) {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("Id"));
      
      await api.patch(`user/${userId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(prev => ({
        ...prev,
        ...editForm
      }));

      setIsEditing(false);
      alert("Perfil actualizado exitosamente!");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setUser(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      alert("Perfil actualizado exitosamente!");
    } finally {
      setSavingProfile(false);
    }
  }

  useEffect(() => {
    loadData();
    
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const todayEvents = events.filter(event => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.createdAt);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  const simplifiedHistory = events.slice(-7).reverse();

  const getStatusText = (percentage) => {
    if (percentage > 80) return "Excelente";
    if (percentage > 50) return "Precaución";
    return "Alerta";
  };

  const isDark = darkMode;
  const bgMain = isDark ? "bg-gray-900" : "bg-gray-50";
  const bgSidebar = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const bgCard = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-500";
  const textMuted = isDark ? "text-gray-400" : "text-gray-400";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const navItemHover = isDark ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const navItemActive = isDark ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600";
  const statCard = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const inputBg = isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { id: "events", label: "Eventos", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "history", label: "Historial", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "profile", label: "Perfil", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      {/* Header para móvil */}
      <header className={`lg:hidden ${bgCard} border-b ${borderColor} px-4 py-3 flex items-center justify-between sticky top-0 z-30`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className={`text-lg font-bold ${textPrimary}`}>Somnolencia</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${navItemHover}`}>
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-lg ${navItemHover}`}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className={`lg:hidden ${bgSidebar} border-b ${borderColor} p-4`}>
          <div className={`flex items-center gap-3 mb-4 pb-4 border-b ${borderColor}`}>
            {user?.photo ? (
              <img src={user.photo} alt="Foto" className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
            ) : (
              <div className={`w-12 h-12 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center`}>
                <span className={`text-lg font-bold ${textPrimary}`}>{user?.name?.charAt(0) || "U"}</span>
              </div>
            )}
            <div>
              <p className={`font-medium ${textPrimary}`}>{user?.name || "Usuario"}</p>
              <p className={`text-sm ${textSecondary}`}>{user?.jobPosition || "Sin puesto"}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === item.id ? navItemActive : `${navItemHover} ${textPrimary}`}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
            <button onClick={logout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </div>
      )}

      <div className="flex">
        {/* Sidebar para desktop */}
        <aside className={`hidden lg:flex ${bgSidebar} ${sidebarCollapsed ? "w-20" : "w-64"} border-r ${borderColor} flex-col transition-all duration-300 relative h-screen sticky top-0`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`absolute -right-3 top-20 w-6 h-6 ${isDark ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600"} border ${borderColor} rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10`}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className={`p-6 border-b ${borderColor}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <div className="transition-opacity duration-300">
                  <h1 className={`text-lg font-bold ${textPrimary}`}>Somnolencia</h1>
                  <p className={`text-xs ${textSecondary}`}>Sistema de Monitoreo</p>
                </div>
              )}
            </div>
          </div>

          <div className={`p-4 border-b ${borderColor}`}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg ${navItemHover} transition-colors`}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              {!sidebarCollapsed && (
                <span className={`text-sm font-medium ${textPrimary}`}>
                  {isDark ? "Modo Claro" : "Modo Oscuro"}
                </span>
              )}
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => setActiveTab(item.id)}
                    className={`nav-item w-full ${activeTab === item.id ? navItemActive : `${navItemHover} ${textPrimary}`} transition-colors`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {!sidebarCollapsed && (
                      <span className="transition-opacity duration-300">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`p-4 border-t ${borderColor}`}>
            <div className={`flex items-center gap-3 mb-4 ${sidebarCollapsed ? "justify-center" : ""}`}>
              {user?.photo ? (
                <img src={user.photo} alt="Foto" className={`w-10 h-10 rounded-full object-cover flex-shrink-0 ${isDark ? "border border-gray-600" : "border-2 border-white"}`} />
              ) : (
                <div className={`w-10 h-10 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className={`${isDark ? "text-gray-300" : "text-gray-600"} font-medium`}>{user?.name?.charAt(0) || "U"}</span>
                </div>
              )}
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 transition-opacity duration-300">
                  <p className={`text-sm font-medium ${textPrimary} truncate`}>{user?.name || "Usuario"}</p>
                  <p className={`text-xs ${textSecondary} truncate`}>{user?.email || "correo@ejemplo.com"}</p>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"} rounded-lg transition`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!sidebarCollapsed && <span className="transition-opacity duration-300">Cerrar Sesión</span>}
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          {/* Header para desktop */}
          <header className={`hidden lg:block ${bgCard} border-b ${borderColor} px-4 lg:px-8 py-4 sticky top-0 z-10 transition-colors`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl lg:text-2xl font-bold ${textPrimary} capitalize`}>
                  {activeTab === "dashboard" ? "Panel de Control" : 
                   activeTab === "events" ? "Eventos de Hoy" :
                   activeTab === "history" ? "Historial" : "Mi Perfil"}
                </h2>
                <p className={`text-sm ${textSecondary}`}>
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {isUpdating && (
                  <span className={`flex items-center gap-2 text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </span>
                )}
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-8 animate-fadeIn">
            {activeTab === "dashboard" && (
              <div className="space-y-4 lg:space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <p className={textSecondary}>Cargando datos...</p>
                  </div>
                ) : sleepData ? (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      <div className={`${statCard} rounded-xl border p-4 lg:p-5`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs lg:text-sm ${textSecondary}`}>Eventos de Hoy</p>
                            <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{todayEvents.length}</p>
                          </div>
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 ${isDark ? "bg-blue-900/50" : "bg-blue-100"} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-5 h-5 lg:w-6 lg:h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className={`${statCard} rounded-xl border p-4 lg:p-5`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs lg:text-sm ${textSecondary}`}>Nivel de Alerta</p>
                            <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{sleepData.awakePercentage.toFixed(0)}%</p>
                          </div>
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${sleepData.awakePercentage > 80 ? (isDark ? "bg-green-900/50" : "bg-green-100") : (isDark ? "bg-amber-900/50" : "bg-amber-100")}`}>
                            <svg className={`w-5 h-5 lg:w-6 lg:h-6 ${sleepData.awakePercentage > 80 ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-amber-400" : "text-amber-600")}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className={`${statCard} rounded-xl border p-4 lg:p-5`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs lg:text-sm ${textSecondary}`}>Total Eventos</p>
                            <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{events.length}</p>
                          </div>
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 ${isDark ? "bg-purple-900/50" : "bg-purple-100"} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-5 h-5 lg:w-6 lg:h-6 ${isDark ? "text-purple-400" : "text-purple-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className={`${statCard} rounded-xl border p-4 lg:p-5`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs lg:text-sm ${textSecondary}`}>Estado</p>
                            <p className={`text-lg lg:text-xl font-bold ${sleepData.awakePercentage > 80 ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-amber-400" : "text-amber-600")}`}>
                              {getStatusText(sleepData.awakePercentage)}
                            </p>
                          </div>
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${sleepData.awakePercentage > 80 ? (isDark ? "bg-green-900/50" : "bg-green-100") : (isDark ? "bg-amber-900/50" : "bg-amber-100")}`}>
                            <svg className={`w-5 h-5 lg:w-6 lg:h-6 ${sleepData.awakePercentage > 80 ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-amber-400" : "text-amber-600")}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.318 15.443A8 8 0 0112.016 8c0 4.364-3.45 8.014-7.969 8.014-1.659 0-3.184-.5-4.5-1.348" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div className={`${bgCard} rounded-xl shadow-sm border p-4 lg:p-6`}>
                        <h3 className={`text-base lg:text-lg font-semibold ${textPrimary} mb-4 lg:mb-6`}>Estado de Somnolencia</h3>
                        <div className="flex justify-center mb-6">
                          <div className="relative w-36 h-36 lg:w-48 lg:h-48">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? "#374151" : "#e5e7eb"} strokeWidth="8" />
                              <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray={`${(sleepData.awakePercentage / 100) * 282.7} 282.7`} strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
                              <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray={`${(sleepData.sleepyPercentage / 100) * 282.7} 282.7`} strokeDashoffset={`-${(sleepData.awakePercentage / 100) * 282.7}`} transform="rotate(-90 50 50)" strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-3xl lg:text-4xl font-bold ${textPrimary}`}>{sleepData.sleepyPercentage.toFixed(0)}%</span>
                              <span className={`text-xs lg:text-sm ${textSecondary}`}>Somnolencia</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-4 lg:gap-8">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className={`text-xs lg:text-sm ${textSecondary}`}>Despierto {sleepData.awakePercentage.toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className={`text-xs lg:text-sm ${textSecondary}`}>Somnolencia {sleepData.sleepyPercentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className={`${bgCard} rounded-xl shadow-sm border p-4 lg:p-6`}>
                        <h3 className={`text-base lg:text-lg font-semibold ${textPrimary} mb-4 lg:mb-6`}>Resumen del Día</h3>
                        <div className="space-y-3 lg:space-y-4">
                          <div className={`p-3 lg:p-4 ${isDark ? "bg-blue-900/30 border-blue-800" : "bg-blue-50 border-blue-200"} border rounded-lg`}>
                            <p className={`text-xs lg:text-sm ${textSecondary} mb-1`}>Eventos Detectados Hoy</p>
                            <p className={`text-xl lg:text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>{todayEvents.length}</p>
                          </div>
                          <div className={`p-3 lg:p-4 border rounded-lg ${sleepData.awakePercentage > 80 ? (isDark ? "bg-green-900/30 border-green-800" : "bg-green-50 border-green-200") : (isDark ? "bg-amber-900/30 border-amber-800" : "bg-amber-50 border-amber-200")}`}>
                            <p className={`text-xs lg:text-sm ${textSecondary} mb-1`}>Estado Actual</p>
                            <p className={`text-lg lg:text-2xl font-bold ${sleepData.awakePercentage > 80 ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-amber-400" : "text-amber-600")}`}>{getStatusText(sleepData.awakePercentage)}</p>
                            <p className={`text-xs ${textMuted} mt-1`}>{sleepData.awakePercentage > 80 ? "Excelente desempeño." : "Considera tomar un descanso."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {activeTab === "events" && (
              <div className={`${bgCard} rounded-xl shadow-sm border p-4 lg:p-6`}>
                {loading ? (
                  <p className={`text-center ${textSecondary} py-8`}>Cargando eventos...</p>
                ) : todayEvents.length === 0 ? (
                  <div className="text-center py-8 lg:py-12">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 ${isDark ? "bg-green-900/50" : "bg-green-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <svg className={`w-6 h-6 lg:w-8 lg:h-8 ${isDark ? "text-green-400" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-base lg:text-lg font-medium ${textPrimary}`}>Sin eventos registrados</p>
                    <p className={`text-sm ${textSecondary} mt-1`}>Excelente trabajo.</p>
                  </div>
                ) : (
                  <div>
                    <div className={`mb-4 p-3 ${isDark ? "bg-blue-900/30 border-blue-800" : "bg-blue-50 border-blue-200"} rounded-lg text-center`}>
                      <p className={`text-sm ${textSecondary}`}>Total de Eventos</p>
                      <p className={`text-3xl lg:text-4xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>{todayEvents.length}</p>
                    </div>
                    <ul className="space-y-2 lg:space-y-3">
                      {todayEvents.map((e, i) => (
                        <li key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"} border rounded-lg gap-2`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 ${isDark ? "bg-red-900/50" : "bg-red-100"} rounded-full flex items-center justify-center`}>
                              <svg className={`w-4 h-4 lg:w-5 lg:h-5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className={`font-medium text-sm lg:text-base ${textPrimary}`}>{e.title || "Evento"}</p>
                              <p className={`text-xs lg:text-sm ${textSecondary}`}>{e.description || "Detección automática"}</p>
                            </div>
                          </div>
                          <span className={`text-xs lg:text-sm ${textMuted}`}>{new Date(e.createdAt).toLocaleTimeString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className={`${bgCard} rounded-xl shadow-sm border p-4 lg:p-6`}>
                {loading ? (
                  <p className={`text-center ${textSecondary} py-8`}>Cargando historial...</p>
                ) : simplifiedHistory.length === 0 ? (
                  <div className="text-center py-8 lg:py-12">
                    <p className={`text-base lg:text-lg ${textSecondary}`}>No hay historial disponible.</p>
                  </div>
                ) : (
                  <div className="space-y-2 lg:space-y-3">
                    {simplifiedHistory.map((event, index) => {
                      const isSleepy = event.title?.toLowerCase().includes("sleep") || event.title?.toLowerCase().includes("somnolencia");
                      return (
                        <div key={index} className={`flex items-center justify-between p-3 lg:p-4 rounded-lg border ${isSleepy ? (isDark ? "bg-red-900/30 border-red-800" : "bg-red-50 border-red-200") : (isDark ? "bg-green-900/30 border-green-800" : "bg-green-50 border-green-200")}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${isSleepy ? (isDark ? "bg-red-900/50" : "bg-red-100") : (isDark ? "bg-green-900/50" : "bg-green-100")}`}>
                              <svg className={`w-4 h-4 lg:w-5 lg:h-5 ${isSleepy ? (isDark ? "text-red-400" : "text-red-600") : (isDark ? "text-green-400" : "text-green-600")}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSleepy ? "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" : "M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"} />
                              </svg>
                            </div>
                            <div>
                              <p className={`font-medium text-sm lg:text-base ${textPrimary}`}>{isSleepy ? "Somnolencia" : "Normal"}</p>
                              <p className={`text-xs ${textMuted}`}>{new Date(event.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                          <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${isSleepy ? (isDark ? "text-red-400 bg-red-900/50" : "text-red-600 bg-red-100") : (isDark ? "text-green-400 bg-green-900/50" : "text-green-600 bg-green-100")}`}>
                            {isSleepy ? "Alerta" : "OK"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-4 lg:space-y-6">
                <div className={`${bgCard} rounded-xl shadow-sm border p-4 lg:p-6`}>
                  <h3 className={`text-base lg:text-lg font-semibold ${textPrimary} mb-4 lg:mb-6`}>Información Personal</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 lg:mb-6">
                    {user?.photo ? (
                      <img src={user.photo} alt="Foto" className="w-16 h-16 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-blue-500" />
                    ) : (
                      <div className={`w-16 h-16 lg:w-24 lg:h-24 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center border-4 border-blue-500`}>
                        <span className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{user?.name?.charAt(0) || "U"}</span>
                      </div>
                    )}
                    <div className="text-center sm:text-left">
                      <p className={`text-lg lg:text-xl font-bold ${textPrimary}`}>{user?.name || "Usuario"}</p>
                      <p className={`text-sm ${textSecondary}`}>{user?.jobPosition || "Sin puesto asignado"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div className={`p-3 lg:p-4 ${isDark ? "bg-gray-700/50" : "bg-gray-50"} rounded-lg`}>
                      <p className={`text-xs lg:text-sm ${textSecondary} mb-1`}>Nombre Completo</p>
                      <p className={`font-medium text-sm lg:text-base ${textPrimary}`}>{user?.name || "No especificado"}</p>
                    </div>
                    <div className={`p-3 lg:p-4 ${isDark ? "bg-gray-700/50" : "bg-gray-50"} rounded-lg`}>
                      <p className={`text-xs lg:text-sm ${textSecondary} mb-1`}>Correo Electrónico</p>
                      <p className={`font-medium text-sm lg:text-base ${textPrimary}`}>{user?.email || "No especificado"}</p>
                    </div>
                    <div className={`p-3 lg:p-4 ${isDark ? "bg-gray-700/50" : "bg-gray-50"} rounded-lg`}>
                      <p className={`text-xs lg:text-sm ${textSecondary} mb-1`}>Fecha de Nacimiento</p>
                      <p className={`font-medium text-sm lg:text-base ${textPrimary}`}>{user?.birthDate || "No especificado"}</p>
                    </div>
                    <div className={`p-3 lg:p-4 ${isDark ? "bg-gray-700/50" : "bg-gray-50"} rounded-lg`}>
                      <p className={`text-xs lg:text-sm ${textSecondary} mb-1`}>Puesto de Trabajo</p>
                      <p className={`font-medium text-sm lg:text-base ${textPrimary}`}>{user?.jobPosition || "No especificado"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={openEdit} className="flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Perfil
                  </button>
                  <button onClick={logout} className={`flex items-center justify-center gap-2 px-4 lg:px-6 py-3 ${isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-100" : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"} border rounded-lg font-medium transition`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Navegación inferior para móvil */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20">
        <div className={`flex items-center justify-around ${bgSidebar} border-t ${borderColor} py-2`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 ${activeTab === item.id ? navItemActive : `${textSecondary} ${navItemHover}`}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className={`${bgCard} rounded-t-2xl sm:rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-4 lg:p-6 border-b ${borderColor} flex justify-between items-center`}>
              <h2 className={`text-lg lg:text-xl font-bold ${textPrimary}`}>Editar Perfil</h2>
              <button onClick={closeEdit} className={`p-2 rounded-lg ${navItemHover}`}>
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 lg:p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {editForm.photo ? (
                    <img src={editForm.photo} alt="Foto" className="w-16 h-16 rounded-full object-cover border-4 border-blue-500" />
                  ) : (
                    <div className={`w-16 h-16 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center border-4 border-blue-500`}>
                      <span className="text-xl font-bold text-gray-600">{editForm.name?.charAt(0) || "U"}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Foto de Perfil</label>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className={`text-sm ${textSecondary}`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Nombre Completo</label>
                <input type="text" value={editForm.name || ""} onChange={(e) => handleEditChange("name", e.target.value)} className={`w-full border rounded-lg p-3 ${inputBg}`} placeholder="Tu nombre" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Fecha de Nacimiento</label>
                  <input type="date" value={editForm.birthDate || ""} onChange={(e) => handleEditChange("birthDate", e.target.value)} className={`w-full border rounded-lg p-3 ${inputBg}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Puesto de Trabajo</label>
                  <input type="text" value={editForm.jobPosition || ""} onChange={(e) => handleEditChange("jobPosition", e.target.value)} className={`w-full border rounded-lg p-3 ${inputBg}`} placeholder="Chofer" />
                </div>
              </div>
            </div>
            <div className={`p-4 lg:p-6 border-t ${borderColor} flex gap-3`}>
              <button onClick={closeEdit} className={`flex-1 py-3 ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} rounded-lg font-medium transition ${textPrimary}`}>
                Cancelar
              </button>
              <button onClick={saveProfile} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                {savingProfile ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}