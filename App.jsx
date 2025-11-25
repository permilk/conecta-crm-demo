
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