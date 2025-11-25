import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  DollarSign, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Edit2,
  Save,
  X,
  LogOut,
  Facebook,
  Loader2,
  MessageCircle,
  Mail,
  FileSpreadsheet,
  Trash2,
  FileText,
  Image as ImageIcon,
  Download,
  Paperclip,
  Grid,
  List as ListIcon,
  Briefcase,
  Clock,
  MessageSquare,
  UploadCloud,
  PieChart as PieChartIcon,
  BarChart2,
  Activity,
  Target,
  HelpCircle,
  GripVertical,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// --- 1. CONFIGURACIÓN Y DATOS ---

const STATUS_CONFIG = {
  'Nuevo': { color: 'bg-blue-50 text-blue-700 border-blue-100', fill: '#3b82f6', label: 'Nuevo' },
  'Contactando': { color: 'bg-yellow-50 text-yellow-700 border-yellow-100', fill: '#eab308', label: 'Contactando' },
  'Contactado': { color: 'bg-indigo-50 text-indigo-700 border-indigo-100', fill: '#6366f1', label: 'Contactado' },
  'Calificado': { color: 'bg-purple-50 text-purple-700 border-purple-100', fill: '#a855f7', label: 'Calificado' },
  'No Calificado': { color: 'bg-slate-100 text-slate-600 border-slate-200', fill: '#94a3b8', label: 'No Calificado' },
  'Interesado': { color: 'bg-teal-50 text-teal-700 border-teal-100', fill: '#14b8a6', label: 'Interesado' },
  'Cita Agendada': { color: 'bg-orange-50 text-orange-700 border-orange-100', fill: '#f97316', label: 'Cita Agendada' },
  'En Negociación': { color: 'bg-pink-50 text-pink-700 border-pink-100', fill: '#ec4899', label: 'En Negociación' },
  'Ganado': { color: 'bg-green-50 text-green-700 border-green-100', fill: '#22c55e', label: 'Ganado' },
  'Perdido': { color: 'bg-red-50 text-red-700 border-red-100', fill: '#ef4444', label: 'Perdido' },
  'Seguimiento': { color: 'bg-gray-50 text-gray-700 border-gray-100', fill: '#64748b', label: 'Seguimiento' },
  'No Contactable': { color: 'bg-slate-200 text-slate-600 border-slate-300', fill: '#475569', label: 'No Contactable' }
};

const PRIORITIES = {
  '🔥 Alta': 'text-red-600 bg-red-50 border border-red-100',
  '⚡ Media': 'text-orange-600 bg-orange-50 border border-orange-100',
  '🔵 Normal': 'text-blue-600 bg-blue-50 border border-blue-100',
  '⚪ Baja': 'text-slate-500 bg-slate-50 border border-slate-200'
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const INITIAL_ASSETS = [
  { id: 1, name: "Brochure Corporativo 2025", type: "pdf", size: "2.4 MB", date: "2024-11-01" },
  { id: 2, name: "Kit Redes Sociales - Q4", type: "zip", size: "15 MB", date: "2024-10-28" },
  { id: 3, name: "Plantilla Email Bienvenida", type: "doc", size: "150 KB", date: "2024-09-15" },
  { id: 4, name: "Presentación de Ventas SaaS", type: "ppt", size: "5.1 MB", date: "2024-11-10" },
  { id: 5, name: "Logo Pack (SVG/PNG)", type: "image", size: "8 MB", date: "2024-01-20" },
  { id: 6, name: "Caso de Éxito - Finanzas", type: "pdf", size: "1.2 MB", date: "2024-11-05" },
  { id: 7, name: "Contrato Marco 2025", type: "pdf", size: "1.8 MB", date: "2024-11-15" },
  { id: 8, name: "Flyer Promocional", type: "image", size: "3.2 MB", date: "2024-11-18" },
];

const INITIAL_DATA = [
  { 
    id: 1, 
    nombre: "Juan Pérez García", 
    telefono: "5548581058", 
    email: "juan.731@email.com", 
    fecha: "2025-11-01", 
    fuente: "Instagram", 
    estado: "Nuevo", 
    prioridad: "🔥 Alta", 
    vendedor: "Vendedor 1", 
    monto: 0, 
    lastContact: "2025-11-20", 
    nextAction: "2025-11-26", 
    intentos: 1,
    canalPref: "WhatsApp",
    tieneAfore: "Sí",
    edad52: "No",
    nivelInteres: "Alto",
    notas: "Cliente busca diversificar.", 
    fechaCierre: "",
    motivoPerdida: "",
    attachments: [] 
  },
  { 
    id: 2, 
    nombre: "María López", 
    telefono: "5518212585", 
    email: "maria.949@email.com", 
    fecha: "2025-11-02", 
    fuente: "Facebook", 
    estado: "Contactando", 
    prioridad: "🔥 Alta", 
    vendedor: "Vendedor 1", 
    monto: 0, 
    lastContact: "2025-11-21", 
    nextAction: "2025-11-25", 
    intentos: 3,
    canalPref: "Llamada",
    tieneAfore: "No sé",
    edad52: "Sí",
    nivelInteres: "Medio",
    notas: "Llamar por la tarde.", 
    fechaCierre: "",
    motivoPerdida: "",
    attachments: [] 
  },
  { 
    id: 3, 
    nombre: "Carlos Rodríguez", 
    telefono: "5517995718", 
    email: "carlos.665@email.com", 
    fecha: "2025-11-03", 
    fuente: "WhatsApp", 
    estado: "Ganado", 
    prioridad: "🔵 Normal", 
    vendedor: "Vendedor 2", 
    monto: 25000, 
    lastContact: "2025-11-15", 
    nextAction: "2025-12-01", 
    intentos: 5,
    canalPref: "Email",
    tieneAfore: "Sí",
    edad52: "Sí",
    nivelInteres: "Alto",
    notas: "Contrato firmado.", 
    fechaCierre: "2025-11-18",
    motivoPerdida: "",
    attachments: ["contrato.pdf"] 
  },
  { 
    id: 4, 
    nombre: "Ana González", 
    telefono: "5594428319", 
    email: "ana.903@email.com", 
    fecha: "2025-11-05", 
    fuente: "Instagram", 
    estado: "Cita Agendada", 
    prioridad: "⚡ Media", 
    vendedor: "Vendedor 2", 
    monto: 0, 
    lastContact: "2025-11-22", 
    nextAction: "2025-11-27", 
    intentos: 2,
    canalPref: "WhatsApp",
    tieneAfore: "Sí",
    edad52: "No",
    nivelInteres: "Medio",
    notas: "Reunión de Zoom.", 
    fechaCierre: "",
    motivoPerdida: "",
    attachments: [] 
  },
  { 
    id: 5, 
    nombre: "Roberto Diaz", 
    telefono: "5512345678", 
    email: "roberto@email.com", 
    fecha: "2025-11-08", 
    fuente: "Referido", 
    estado: "En Negociación", 
    prioridad: "🔥 Alta", 
    vendedor: "Vendedor 1", 
    monto: 0, 
    lastContact: "2025-11-23", 
    nextAction: "2025-11-28", 
    intentos: 4,
    canalPref: "Llamada",
    tieneAfore: "Sí",
    edad52: "Sí",
    nivelInteres: "Alto",
    notas: "Enviada propuesta v2.", 
    fechaCierre: "",
    motivoPerdida: "",
    attachments: ["propuesta_v2.pdf"] 
  },
  { 
    id: 6, 
    nombre: "Lucía Mendez", 
    telefono: "5587654321", 
    email: "lucia@email.com", 
    fecha: "2025-11-10", 
    fuente: "Facebook", 
    estado: "Ganado", 
    prioridad: "🔥 Alta", 
    vendedor: "Vendedor 1", 
    monto: 40000, 
    lastContact: "2025-11-18", 
    nextAction: "2025-12-05", 
    intentos: 2,
    canalPref: "WhatsApp",
    tieneAfore: "Sí",
    edad52: "No",
    nivelInteres: "Alto",
    notas: "Onboarding pendiente.", 
    fechaCierre: "2025-11-20",
    motivoPerdida: "",
    attachments: [] 
  },
  { 
    id: 7, 
    nombre: "Pedro Pascal", 
    telefono: "5511122233", 
    email: "pedro@email.com", 
    fecha: "2025-11-12", 
    fuente: "Web", 
    estado: "Perdido", 
    prioridad: "⚪ Baja", 
    vendedor: "Vendedor 2", 
    monto: 0, 
    lastContact: "2025-11-15", 
    nextAction: "", 
    intentos: 6,
    canalPref: "Email",
    tieneAfore: "No",
    edad52: "Sí",
    nivelInteres: "Bajo",
    notas: "Precio muy alto.", 
    fechaCierre: "",
    motivoPerdida: "Precio Alto",
    attachments: [] 
  },
];

const EMPTY_LEAD = {
  id: null,
  nombre: "",
  telefono: "",
  email: "",
  fecha: new Date().toISOString().split('T')[0],
  fuente: "Manual",
  estado: "Nuevo",
  prioridad: "🔵 Normal",
  vendedor: "Vendedor 1",
  monto: 0,
  notas: "",
  lastContact: "",
  nextAction: "",
  intentos: 0,
  canalPref: "WhatsApp",
  tieneAfore: "No sé",
  edad52: "No",
  nivelInteres: "Medio",
  fechaCierre: "",
  motivoPerdida: "",
  attachments: []
};

// --- 2. COMPONENTES DE UI ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl text-sm">
        <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center gap-2" style={{ color: entry.color || entry.payload.fill }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill }}></span>
            <span className="font-medium">{entry.name}:</span> 
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, subtext, icon: Icon, color, bgColor }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">
      <Icon size={80} color={color} />
    </div>
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm transition-transform group-hover:scale-110`} style={{ backgroundColor: bgColor }}>
        <Icon size={28} color={color} />
      </div>
      <h3 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">{value}</h3>
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
      {subtext && <p className="text-sm text-slate-400 mt-3 flex items-center gap-1 font-medium"><TrendingUp size={14}/> {subtext}</p>}
    </div>
  </div>
);

const Badge = ({ type, value }) => {
  if (!value) return <span className="bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full">N/A</span>;
  const strValue = String(value);
  let className = "px-3 py-1.5 rounded-full text-xs uppercase font-bold tracking-wide shadow-sm border";
  
  if (type === 'status') {
    const config = STATUS_CONFIG[strValue] || STATUS_CONFIG['Nuevo'];
    className += ` ${config.color}`;
  } else if (type === 'priority') {
    if(strValue.includes('Alta')) className += " bg-red-50 text-red-700 border-red-100";
    else if(strValue.includes('Media')) className += " bg-orange-50 text-orange-700 border-orange-100";
    else if(strValue.includes('Baja')) className += " bg-slate-50 text-slate-600 border-slate-200";
    else className += " bg-blue-50 text-blue-700 border-blue-100";
  }
  return <span className={className}>{strValue}</span>;
};

// --- 3. VISTAS ---

const KanbanView = ({ leads, onEdit, onStatusChange, currentView }) => {
  const allColumns = Object.keys(STATUS_CONFIG);
  
  // FILTRO CRÍTICO DE COLUMNAS:
  // Si estamos en 'client-center', SOLO mostramos 'Ganado'.
  // Si estamos en 'lead-center', mostramos TODO EXCEPTO 'Ganado'.
  const columns = currentView === 'client-center' 
    ? ['Ganado'] 
    : allColumns.filter(c => c !== 'Ganado');

  const [draggedLeadId, setDraggedLeadId] = useState(null);

  const handleDragStart = (e, leadId) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedLeadId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedLeadId) {
      onStatusChange(draggedLeadId, targetStatus);
    }
  };
  
  return (
    <div className="flex gap-8 overflow-x-auto pb-8 h-full items-start px-4">
      {columns.map(status => {
        const columnLeads = leads.filter(l => l.estado === status);
        const config = STATUS_CONFIG[status];
        
        return (
          <div 
            key={status} 
            className="min-w-[320px] w-[320px] flex-shrink-0 flex flex-col bg-slate-50/80 rounded-3xl border border-slate-200/60 h-full max-h-full shadow-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-slate-50/95 backdrop-blur-sm rounded-t-3xl z-10">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config?.color?.split(' ')[0].replace('bg-', 'bg-') || 'bg-slate-400'} shadow-sm ring-2 ring-white`}></div>
                <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">{status}</span>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-xs text-slate-600 font-bold border border-slate-200 shadow-sm">
                {columnLeads.length}
              </span>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {columnLeads.map(lead => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onEdit(lead)} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all group relative hover:border-blue-200"
                >
                  <div className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 cursor-move transition-opacity">
                    <GripVertical size={18} />
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-slate-800 text-base truncate pr-6 mb-1">{lead.nombre}</h4>
                    <p className="text-xs text-slate-400 truncate font-medium">{lead.empresa || 'Particular'} • {lead.email}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                     {lead.monto > 0 ? (
                       <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                         ${lead.monto.toLocaleString()}
                       </span>
                     ) : <span className="text-[10px] text-slate-400 italic bg-slate-50 px-3 py-1.5 rounded-lg">Sin monto</span>}
                     {lead.prioridad && <Badge type="priority" value={lead.prioridad} />}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                       <Clock size={14} className="text-slate-400"/> {lead.lastContact || 'Sin contacto'}
                     </div>
                     <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 shadow-sm">
                        {lead.vendedor?.split(' ')[1] || '1'}
                     </div>
                  </div>
                </div>
              ))}
              {columnLeads.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30 mx-2">
                  <span className="text-sm font-medium">
                    {currentView === 'lead-center' && status === 'Ganado' ? '¡Arrastra aquí para cerrar!' : 'Sin registros'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CalendarView = ({ leads, onEdit }) => {
  const days = Array.from({length: 35}, (_, i) => i + 1); 
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><CalendarIcon className="text-blue-600" size={24}/> Calendario de Actividades</h3>
        <span className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">Noviembre 2025</span>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
          <div key={d} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{d}</div>
        ))}
        {days.map(day => {
            const dayStr = day > 30 ? day - 30 : day; 
            const dateStr = `2025-11-${dayStr.toString().padStart(2, '0')}`;
            const events = leads.filter(l => l.nextAction === dateStr);
            const isToday = dayStr === 25; 
            return (
              <div key={day} className={`bg-white min-h-[140px] p-3 transition-colors hover:bg-blue-50/30 ${isToday ? 'bg-blue-50/50' : ''}`}>
                <div className={`text-right text-sm font-bold mb-3 ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                  {isToday && <span className="mr-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">Hoy</span>}
                  {dayStr}
                </div>
                <div className="space-y-2">
                  {events.map(ev => (
                    <div key={ev.id} onClick={() => onEdit(ev)} className="text-[11px] p-2 rounded-lg bg-blue-50 text-blue-800 truncate cursor-pointer hover:bg-blue-100 border border-blue-100 shadow-sm flex items-center gap-1.5 font-medium transition-colors">
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                      {ev.nombre}
                    </div>
                  ))}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (user === 'admin' && pass === '1234') onLogin({ id: 'adm01', name: 'Admin General', role: 'admin', avatar: 'AD' });
    else if (user === 'supervisor' && pass === '1234') onLogin({ id: 'sup01', name: 'José Carola', role: 'supervisor', avatar: 'JC' });
    else if (user === 'vendedor1' && pass === '1234') onLogin({ id: 'ven01', name: 'Vendedor 1', role: 'vendedor', assignedName: 'Vendedor 1', avatar: 'V1' });
    else setError('Credenciales inválidas');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10">
        <div className="p-8 text-center border-b border-white/10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg transform rotate-3">
            <span className="text-white font-bold text-3xl">CS</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
          <p className="text-blue-200 text-sm">CRM Conecta Strategy v2.0</p>
        </div>
        
        <div className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Usuario</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700 text-sm" 
                placeholder="Ingresa tu usuario"
                value={user} 
                onChange={(e) => setUser(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contraseña</label>
              <input 
                type="password" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700 text-sm" 
                placeholder="••••••••"
                value={pass} 
                onChange={(e) => setPass(e.target.value)} 
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 font-medium">
                <AlertCircle size={14}/> {error}
              </div>
            )}
            <button type="submit" className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 text-sm">
              Iniciar Sesión
            </button>
          </form>
          <div className="mt-6 text-center">
             <p className="text-xs text-slate-400">Demo Access: admin / 1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. MODAL DE EDICIÓN ---

const LeadFormModal = ({ lead, isOpen, onClose, onSave, isReadOnly }) => {
  if (!isOpen) return null;
  
  const [formData, setFormData] = useState(lead || EMPTY_LEAD);
  const fileInputRef = useRef(null);

  useEffect(() => { 
    if (lead) setFormData(lead); 
  }, [lead]);

  if (!formData) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newAttachments = [...(formData.attachments || []), file.name];
      setFormData({ ...formData, attachments: newAttachments });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col my-8 transform transition-all scale-100">
        <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {!formData.id ? <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Plus size={24}/></div> : <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Edit2 size={24}/></div>}
              {!formData.id ? 'Nuevo Lead' : 'Expediente del Cliente'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 ml-12">Complete la información detallada del prospecto.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 bg-[#FAFAFA] overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-3 pb-2 border-b border-slate-50">
                   <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                   Información Personal
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre Completo</label>
                     <input disabled={isReadOnly} required type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} className="w-full input-premium text-base" placeholder="Ej. Roberto Gómez Bolaños"/>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Teléfono</label>
                      <div className="flex gap-3">
                         <input disabled={isReadOnly} required type="tel" name="telefono" value={formData.telefono || ''} onChange={handleChange} className="w-full input-premium text-base" placeholder="55 1234 5678"/>
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                      <div className="flex gap-3">
                        <input disabled={isReadOnly} type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full input-premium text-base" placeholder="correo@ejemplo.com"/>
                      </div>
                   </div>
                 </div>
              </section>

              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-3 pb-2 border-b border-slate-50">
                   <div className="w-1.5 h-5 bg-purple-500 rounded-full"></div>
                   Perfilamiento y Origen
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <label className="label-premium mb-2">Tiene AFORE</label>
                      <select disabled={isReadOnly} name="tieneAfore" value={formData.tieneAfore || 'No sé'} onChange={handleChange} className="w-full select-premium text-base">
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                        <option value="No sé">No sé</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-premium mb-2">Edad 52+</label>
                      <select disabled={isReadOnly} name="edad52" value={formData.edad52 || 'No'} onChange={handleChange} className="w-full select-premium text-base">
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-premium mb-2">Nivel Interés</label>
                      <div className="relative">
                        <select disabled={isReadOnly} name="nivelInteres" value={formData.nivelInteres || 'Medio'} onChange={handleChange} className="w-full select-premium appearance-none text-base">
                          <option value="Alto">Alto 🔥</option>
                          <option value="Medio">Medio ⚡</option>
                          <option value="Bajo">Bajo ⚪</option>
                        </select>
                        <div className="absolute right-4 top-4 pointer-events-none text-slate-400"><ChevronDown size={16}/></div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="label-premium mb-2">Fuente de Captura</label>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {['Instagram', 'Facebook', 'WhatsApp', 'Web', 'Referido'].map(src => (
                          <button 
                            key={src}
                            type="button"
                            onClick={() => setFormData({...formData, fuente: src})}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${formData.fuente === src ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                          >
                            {src}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Notas y Comentarios</h3>
                <textarea disabled={isReadOnly} name="notas" value={formData.notas || ''} onChange={handleChange} rows="4" className="w-full input-premium resize-none text-base" placeholder="Escribe detalles importantes sobre la negociación..."></textarea>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Estado del Lead</h3>
                <div className="mb-8">
                  <label className="label-premium mb-2">Fase Actual</label>
                  <select disabled={isReadOnly} name="estado" value={formData.estado || 'Nuevo'} onChange={handleChange} className="w-full select-premium font-bold text-slate-700 bg-slate-50 text-base">
                      {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="mb-8">
                  <label className="label-premium mb-2">Prioridad</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(PRIORITIES).map(p => (
                      <button 
                        key={p} 
                        type="button" 
                        onClick={() => setFormData({...formData, prioridad: p})}
                        className={`text-xs py-3 px-2 rounded-xl border transition-all ${formData.prioridad === p ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm ring-1 ring-blue-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-8 border-t border-slate-100 space-y-6">
                   <div>
                      <label className="label-premium mb-2">Próx. Seguimiento</label>
                      <input disabled={isReadOnly} type="date" name="nextAction" value={formData.nextAction || ''} onChange={handleChange} className="w-full input-premium bg-blue-50 border-blue-100 text-blue-800 font-medium text-base" />
                   </div>
                   <div>
                      <label className="label-premium mb-2">Monto Potencial ($)</label>
                      <input disabled={isReadOnly} type="number" name="monto" value={formData.monto || 0} onChange={handleChange} className="w-full input-premium text-right font-mono text-xl font-bold text-green-600" />
                   </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documentos</h3>
                    <button type="button" onClick={() => fileInputRef.current.click()} className="text-blue-600 text-xs hover:underline flex items-center gap-1 font-bold"><UploadCloud size={16}/> SUBIR</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                 </div>
                 <div className="space-y-3">
                    {formData.attachments && formData.attachments.length > 0 ? (
                      formData.attachments.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm"><FileText size={20}/></div>
                            <span className="text-sm text-slate-600 font-medium truncate max-w-[120px]">{typeof file === 'string' ? file : 'Archivo'}</span>
                          </div>
                          <button type="button" className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-sm text-slate-400">Sin archivos adjuntos</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
             <button type="button" className="text-red-500 text-sm font-medium hover:bg-red-50 px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
               <Trash2 size={18}/> Eliminar Lead
             </button>
             <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-8 py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-10 py-4 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <Save size={20}/> Guardar Cambios
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 5. APLICACIÓN PRINCIPAL ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard'); 
  const [subView, setSubView] = useState('list'); 
  
  const [leads, setLeads] = useState(INITIAL_DATA);
  const [assets, setAssets] = useState(INITIAL_ASSETS); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtros
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [dashboardVendorFilter, setDashboardVendorFilter] = useState('Todos');
  const [centerFilterVendor, setCenterFilterVendor] = useState('Todos');
  const [centerFilterStatus, setCenterFilterStatus] = useState('Todos');

  const [modalData, setModalData] = useState(null);
  const assetInputRef = useRef(null); 

  const handleLogin = (user) => { setCurrentUser(user); setIsAuthenticated(true); };
  const handleLogout = () => { setIsAuthenticated(false); setCurrentUser(null); setView('dashboard'); };

  const isAdmin = currentUser?.role === 'admin';
  const isSupervisor = currentUser?.role === 'supervisor';
  const isVendedor = currentUser?.role === 'vendedor';

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) setLeads(leads.filter(l => l.id !== id));
  };

  const handleSaveLead = (formData) => {
    if (formData.id) {
      setLeads(leads.map(l => l.id === formData.id ? formData : l));
    } else {
      const newId = leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1;
      setLeads([{ ...formData, id: newId }, ...leads]);
    }
    setModalData(null);
  };

  const handleStatusChange = (leadId, newStatus) => {
    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === leadId ? { ...lead, estado: newStatus } : lead
    ));
  };

  const handleAssetUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newAsset = {
        id: Date.now(),
        name: file.name,
        type: file.name.split('.').pop() || 'file',
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        date: new Date().toISOString().split('T')[0]
      };
      setAssets([newAsset, ...assets]);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Estado', 'Vendedor', 'Monto'];
    const rows = currentData.map(l => [
      l.id, 
      l.nombre, 
      l.email, 
      l.telefono, 
      l.estado, 
      l.vendedor, 
      l.monto
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredData = (targetView) => {
    let filtered = leads;
    if (targetView === 'lead-center') filtered = filtered.filter(l => l.estado !== 'Ganado');
    else if (targetView === 'client-center') filtered = filtered.filter(l => l.estado === 'Ganado');
    
    // Filtros de Center
    if (isVendedor) {
        filtered = filtered.filter(l => l.vendedor === currentUser.assignedName);
    } else {
        if (centerFilterVendor !== 'Todos') filtered = filtered.filter(l => l.vendedor === centerFilterVendor);
    }

    if (centerFilterStatus !== 'Todos') filtered = filtered.filter(l => l.estado === centerFilterStatus);

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(l => (l.nombre && l.nombre.toLowerCase().includes(lower)) || (l.email && l.email.toLowerCase().includes(lower)));
    }
    return filtered;
  };

  const currentData = getFilteredData(view);

  const stats = useMemo(() => {
    let dashData = leads;
    
    // Filtro de Vendedor en Dashboard (Solo Supervisor/Admin)
    if (isVendedor) {
        dashData = dashData.filter(l => l.vendedor === currentUser.assignedName);
    } else if (dashboardVendorFilter !== 'Todos') {
        dashData = dashData.filter(l => l.vendedor === dashboardVendorFilter);
    }

    if (filterDateStart && filterDateEnd) dashData = dashData.filter(l => l.fecha >= filterDateStart && l.fecha <= filterDateEnd);

    const total = dashData.length;
    const won = dashData.filter(l => l.estado === 'Ganado');
    const revenue = won.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
    const newLeads = dashData.filter(l => l.estado === 'Nuevo').length;
    
    // Line Data (Trends) - Formato DD MMM
    const leadsByDate = {};
    dashData.forEach(l => { 
        if(l.fecha) {
            // Simple format: "05 Nov"
            const dateObj = new Date(l.fecha);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = dateObj.toLocaleString('es-ES', { month: 'short' });
            const key = `${day} ${month}`; 
            leadsByDate[key] = (leadsByDate[key] || 0) + 1;
        }
    });
    // Sort keys crudely or assume date order if critical
    const lineData = Object.keys(leadsByDate).map(d => ({ date: d, leads: leadsByDate[d] }));

    const vendorStats = { 'Vendedor 1': 0, 'Vendedor 2': 0 };
    dashData.forEach(l => { if (vendorStats[l.vendedor] !== undefined && l.estado === 'Ganado') vendorStats[l.vendedor]++; });
    const vendorData = Object.keys(vendorStats).map(v => ({ name: v, ventas: vendorStats[v] }));

    const leadsBySource = {};
    dashData.forEach(l => { leadsBySource[l.fuente] = (leadsBySource[l.fuente] || 0) + 1; });
    const sourceData = Object.keys(leadsBySource).map(k => ({ name: k, value: leadsBySource[k] }));

    const leadsByPriority = {};
    dashData.forEach(l => { 
        const cleanPriority = l.prioridad.replace(/[^a-zA-Z\s]/g, '').trim(); 
        leadsByPriority[cleanPriority] = (leadsByPriority[cleanPriority] || 0) + 1; 
    });
    const priorityData = Object.keys(leadsByPriority).map(k => ({ name: k, value: leadsByPriority[k] }));

    const statusDistribution = Object.keys(STATUS_CONFIG).map(status => ({
      name: status,
      value: dashData.filter(l => l.estado === status).length,
      color: STATUS_CONFIG[status].fill
    }));

    return { total, won: won.length, revenue, newLeads, lineData, vendorData, sourceData, priorityData, statusDistribution };
  }, [leads, isVendedor, currentUser, filterDateStart, filterDateEnd, dashboardVendorFilter]);

  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      <aside className={`w-72 flex-shrink-0 hidden md:flex flex-col transition-all duration-300 bg-[#0f172a] text-white relative overflow-hidden`}>
        <div className="p-8 z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="font-bold text-lg">CS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Conecta</h1>
              <p className="text-xs text-slate-400">Strategy CRM</p>
            </div>
          </div>
          
          <div className="mb-6">
             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-lg">
                  {currentUser.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{currentUser.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
                </div>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 z-10">
          <MenuButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={LayoutDashboard} label="Dashboard General" />
          
          <div className="pt-6 pb-3 px-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ventas</p>
          </div>
          <MenuButton active={view === 'lead-center'} onClick={() => setView('lead-center')} icon={Filter} label="Lead Center" />
          <MenuButton active={view === 'client-center'} onClick={() => setView('client-center')} icon={Users} label="Client Center" />
          
          <div className="pt-6 pb-3 px-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Herramientas</p>
          </div>
          <MenuButton active={view === 'assets'} onClick={() => setView('assets')} icon={Briefcase} label="Marketing Assets" />
        </nav>

        <div className="p-4 z-10">
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
             <LogOut size={18} /> Cerrar Sesión
           </button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
      </aside>

      <main className="flex-1 overflow-auto h-screen flex flex-col relative">
        <div className="md:hidden bg-[#0f172a] text-white p-4 flex justify-between items-center sticky top-0 z-20">
          <span className="font-bold text-lg">CS CRM</span>
          <button onClick={handleLogout}><LogOut size={20}/></button>
        </div>

        <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
          
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="animate-fadeIn space-y-8">
              <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
                  <p className="text-slate-500 mt-1">Resumen de rendimiento y métricas clave de hoy.</p>
                </div>
                <div className="flex gap-3">
                    {/* Filtro Vendedor para Supervisor */}
                    {(isSupervisor || isAdmin) && (
                        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100">Vendedor</div>
                            <select 
                                className="text-sm border-none outline-none text-slate-600 bg-transparent font-medium pr-8" 
                                value={dashboardVendorFilter}
                                onChange={(e) => setDashboardVendorFilter(e.target.value)}
                            >
                                <option value="Todos">Todos</option>
                                <option value="Vendedor 1">Vendedor 1</option>
                                <option value="Vendedor 2">Vendedor 2</option>
                            </select>
                        </div>
                    )}
                    <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100">Periodo</div>
                        <input type="date" className="text-sm border-none outline-none text-slate-600 bg-transparent font-medium" onChange={e => setFilterDateStart(e.target.value)} />
                        <span className="text-slate-300">-</span>
                        <input type="date" className="text-sm border-none outline-none text-slate-600 bg-transparent font-medium" onChange={e => setFilterDateEnd(e.target.value)} />
                    </div>
                </div>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ingresos Totales" value={`$${stats.revenue.toLocaleString()}`} subtext="vs mes anterior" icon={DollarSign} color="#16a34a" bgColor="#dcfce7" />
                <StatCard title="Clientes Ganados" value={stats.won} subtext="Tasa conv. 12%" icon={CheckCircle} color="#2563eb" bgColor="#dbeafe" />
                <StatCard title="Leads Nuevos" value={stats.newLeads} subtext="20 pendientes" icon={AlertCircle} color="#dc2626" bgColor="#fee2e2" />
                <StatCard title="Pipeline Total" value={stats.total} subtext="Activos hoy" icon={TrendingUp} color="#9333ea" bgColor="#f3e8ff" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Tendencia de Captación</h3>
                       <button className="p-1 hover:bg-slate-50 rounded"><MoreHorizontal size={16} className="text-slate-400"/></button>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.lineData}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                {/* Updated XAxis with tick formatter logic applied in useMemo */}
                                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Target size={18} className="text-indigo-500"/> Fuentes de Tráfico</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={stats.sourceData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {stats.sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none"/>
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
              </div>
              
              {(isSupervisor || isAdmin) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Filter size={18} className="text-orange-500"/> Distribución Total</h3>
                     <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.statusDistribution} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <XAxis type="number" hide/>
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#64748b'}} interval={0} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}}/>
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                  {stats.statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || '#94a3b8'} />
                                  ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Users size={18} className="text-purple-500"/> Ventas por Asesor</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.vendorData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="ventas" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><AlertCircle size={18} className="text-red-500"/> Temperatura Leads</h3>
                    <div className="h-80 flex flex-col justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.priorityData} layout="vertical" margin={{ left: 0, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}}/>
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                {stats.priorityData.map((entry, index) => {
                                    let color = '#94a3b8';
                                    if(entry.name.includes('Alta')) color = '#ef4444';
                                    if(entry.name.includes('Media')) color = '#f97316';
                                    if(entry.name.includes('Normal') || entry.name.includes('Baja')) color = '#3b82f6'; 
                                    return <Cell key={`cell-${index}`} fill={color} />
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
                </div>
              )}
            </div>
          )}

          {/* LEAD & CLIENT CENTER */}
          {(view === 'lead-center' || view === 'client-center') && (
            <div className="animate-fadeIn h-full flex flex-col">
              <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 shrink-0">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    {view === 'lead-center' ? <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Filter size={28}/></div> : <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Users size={28}/></div>}
                    {view === 'lead-center' ? 'Lead Center' : 'Client Center'}
                  </h2>
                  <p className="text-slate-500 mt-1 ml-14">Gestión centralizada de {view === 'lead-center' ? 'prospectos y oportunidades' : 'cartera de clientes'}.</p>
                </div>
                
                <div className="flex gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                   <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button onClick={() => setSubView('list')} className={`p-2.5 rounded-lg transition-all ${subView === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon size={20}/></button>
                      <button onClick={() => setSubView('kanban')} className={`p-2.5 rounded-lg transition-all ${subView === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={20}/></button>
                      <button onClick={() => setSubView('calendar')} className={`p-2.5 rounded-lg transition-all ${subView === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><CalendarIcon size={20}/></button>
                   </div>
                   <div className="w-px h-8 bg-slate-200 mx-1"></div>
                   <button onClick={() => setModalData(EMPTY_LEAD)} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-1">
                    <Plus size={20} /> Nuevo
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-hidden min-h-[500px] bg-white rounded-3xl shadow-sm border border-slate-100 relative">
                
                {subView === 'list' && (
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-slate-100 flex gap-4 items-center justify-between flex-wrap">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input 
                          type="text" 
                          placeholder="Buscar por nombre, correo..." 
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 text-sm font-medium transition-all" 
                          onChange={e => setSearchTerm(e.target.value)} 
                        />
                      </div>
                      
                      <div className="flex gap-3 items-center">
                         {/* Filtros Funcionales */}
                         {!isVendedor && (
                             <select 
                                className="p-3 border border-slate-200 rounded-xl text-slate-600 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                                value={centerFilterVendor}
                                onChange={(e) => setCenterFilterVendor(e.target.value)}
                             >
                                 <option value="Todos">Todos Vendedores</option>
                                 <option value="Vendedor 1">Vendedor 1</option>
                                 <option value="Vendedor 2">Vendedor 2</option>
                             </select>
                         )}
                         <select 
                            className="p-3 border border-slate-200 rounded-xl text-slate-600 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                            value={centerFilterStatus}
                            onChange={(e) => setCenterFilterStatus(e.target.value)}
                         >
                             <option value="Todos">Todos Estados</option>
                             {Object.keys(STATUS_CONFIG)
                                .filter(s => view === 'client-center' ? s === 'Ganado' : s !== 'Ganado')
                                .map(s => <option key={s} value={s}>{s}</option>)
                             }
                         </select>

                         <button onClick={exportToCSV} className="p-3 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors" title="Exportar Excel">
                            <Download size={20}/>
                         </button>
                      </div>
                    </div>
                    
                    <div className="overflow-auto flex-1 custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                          <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-6">Nombre del Lead</th>
                            <th className="p-6">Estado / Prioridad</th>
                            <th className="p-6">Asignado A</th>
                            <th className="p-6">Próx. Acción</th>
                            <th className="p-6 text-center">Acciones Rápidas</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                          {currentData.map(lead => (
                            <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-50">
                                    {lead.nombre.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 text-base">{lead.nombre}</div>
                                    <div className="text-xs text-slate-400">{lead.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-col gap-2 items-start">
                                  <Badge type="status" value={lead.estado}/> 
                                  <Badge type="priority" value={lead.prioridad}/>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                    {lead.vendedor.charAt(0)}
                                  </div>
                                  <span className="font-medium">{lead.vendedor}</span>
                                </div>
                              </td>
                              <td className="p-6">
                                {lead.nextAction ? (
                                  <div className="flex items-center gap-2 text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg w-fit border border-slate-200 font-medium">
                                    <Clock size={14} className="text-slate-400"/> {lead.nextAction}
                                  </div>
                                ) : <span className="text-slate-300 italic">-</span>}
                              </td>
                              <td className="p-6">
                                <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => window.open(`https://wa.me/52${lead.telefono?.replace(/\D/g, '')}`, '_blank')} className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"><MessageCircle size={18}/></button>
                                  <button onClick={() => window.open(`mailto:${lead.email}`, '_blank')} className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><Mail size={18}/></button>
                                  <button onClick={() => setModalData(lead)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><Edit2 size={18}/></button>
                                  {isAdmin && <button onClick={() => handleDelete(lead.id)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={18}/></button>}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {currentData.length === 0 && (
                            <tr><td colSpan="5" className="p-12 text-center text-slate-400 italic">No se encontraron registros.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {subView === 'kanban' && (
                  <div className="p-6 h-full overflow-hidden">
                    <KanbanView leads={currentData} onEdit={setModalData} onStatusChange={handleStatusChange} currentView={view} />
                  </div>
                )}
                
                {subView === 'calendar' && <CalendarView leads={currentData} onEdit={setModalData} />}

              </div>
            </div>
          )}

          {/* ASSETS VIEW */}
          {view === 'assets' && (
             <div className="animate-fadeIn">
               <header className="mb-10 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Briefcase size={28}/></div>
                      Marketing Library
                    </h2>
                    <p className="text-slate-500 mt-1 ml-14">Recursos oficiales y material de apoyo.</p>
                  </div>
                  {isAdmin && (
                    <>
                      <input 
                        type="file" 
                        ref={assetInputRef} 
                        onChange={handleAssetUpload} 
                        className="hidden" 
                      />
                      <button 
                        onClick={() => assetInputRef.current.click()}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:-translate-y-0.5 transition-transform text-sm"
                      >
                        <UploadCloud size={20}/> Subir Recurso
                      </button>
                    </>
                  )}
               </header>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {assets.map(asset => (
                    <div key={asset.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors border border-indigo-100">
                        {asset.type === 'pdf' ? <FileText size={32} className="text-red-500"/> : asset.type === 'image' || asset.type === 'png' || asset.type === 'jpg' ? <ImageIcon size={32} className="text-blue-500"/> : <FileSpreadsheet size={32} className="text-green-500"/>}
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1 truncate text-lg">{asset.name}</h3>
                      <div className="flex justify-between items-center text-xs text-slate-400 mt-4 font-medium">
                        <span>{asset.size}</span>
                        <span>{asset.date}</span>
                      </div>
                      <button className="w-full mt-8 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2">
                        <Download size={18}/> Descargar
                      </button>
                    </div>
                  ))}
               </div>
             </div>
          )}
        </div>
      </main>
      <LeadFormModal lead={modalData} isOpen={!!modalData} onClose={() => setModalData(null)} onSave={handleSaveLead} />
    </div>
  );
}

// --- Helpers ---
const MenuButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-white'} /> 
    {label}
  </button>
);