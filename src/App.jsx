import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  Gauge,
  LayoutDashboard,
  LogIn,
  LogOut,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
  CheckCircle2,
  ClipboardList,
  Target,
  Factory,
  FileBarChart,
  Layers,
  Wrench,
  Save,
  Pencil,
  Filter,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'
import { supabase } from './lib/supabaseClient'
import './App.css'

const ratingOptions = [
  {
    value: '3',
    label: '3',
    description: 'Cumple totalmente',
    color: 'bg-emerald-500',
    text: 'text-emerald-700',
    soft: 'bg-emerald-50 border-emerald-200',
  },
  {
    value: '2',
    label: '2',
    description: 'Cumple condicionado',
    color: 'bg-amber-400',
    text: 'text-amber-700',
    soft: 'bg-amber-50 border-amber-200',
  },
  {
    value: '1',
    label: '1',
    description: 'Cumple condicionado',
    color: 'bg-yellow-400',
    text: 'text-yellow-700',
    soft: 'bg-yellow-50 border-yellow-200',
  },
  {
    value: '0',
    label: '0',
    description: 'No cumple',
    color: 'bg-red-500',
    text: 'text-red-700',
    soft: 'bg-red-50 border-red-200',
  },
  {
    value: 'NA',
    label: 'NA',
    description: 'No aplica',
    color: 'bg-slate-400',
    text: 'text-slate-600',
    soft: 'bg-slate-50 border-slate-200',
  },
]

const procesosBase = [
  'Almacén MP',
  'Mezclas',
  'Laboratorio de agua',
  'Producción',
  'Logística',
  'Infraestructura',
  'Sistema de Gestión',
  'Control de Calidad',
  'Mantenimiento',
  'Gestión de capital Humano',
  'Intendencia',
  'Planeación',
  'Servicio Médico',
  'Seguridad e Higiene',
  'Almacén de refacciones',
  'Comercialización',
  'Compras',
  'I+D',
]

const fccaSectionWeights = [
  {
    section: '1',
    code: '1.0',
    title: 'Factory Facilities & Environment',
    weight: 15,
  },
  {
    section: '2',
    code: '2.0',
    title: 'Quality Management System',
    weight: 20,
  },
  {
    section: '3',
    code: '3.0',
    title: 'Incoming Materials Control',
    weight: 15,
  },
  {
    section: '4',
    code: '4.0',
    title: 'Process and Production Control',
    weight: 25,
  },
  {
    section: '5',
    code: '5.0',
    title: 'In-House Testing',
    weight: 10,
  },
  {
    section: '6',
    code: '6.0',
    title: 'Final Inspection',
    weight: 10,
  },
  {
    section: '7',
    code: '7.0',
    title: 'People Resources and Training',
    weight: 5,
  },
]

const chartPalette = {
  cyan: '#0891b2',
  blue: '#2563eb',
  violet: '#7c3aed',
  green: '#16a34a',
  amber: '#f59e0b',
  red: '#dc2626',
  slate: '#64748b',
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'fcca', label: 'Auditorías FCCA', icon: ClipboardCheck, active: true },
  { id: 'hallazgos', label: 'Hallazgos', icon: AlertTriangle, active: true },
  { id: 'acciones', label: 'Acciones correctivas', icon: Target, active: true },
  { id: 'dinamicas', label: 'Dinámicas 5S', icon: Sparkles, active: false },
  { id: 'iso9001', label: 'ISO 9001', icon: Layers, active: false },
  { id: 'iso14001', label: 'ISO 14001', icon: Factory, active: false },
  { id: 'iso45001', label: 'ISO 45001', icon: ShieldCheck, active: false },
  { id: 'reportes', label: 'Reportes', icon: FileBarChart, active: false },
  { id: 'configuracion', label: 'Configuración', icon: Settings, active: false },
]

function getRatingConfig(value) {
  return ratingOptions.find((item) => item.value === value)
}

function extractProcesoFromText(value) {
  const text = String(value || '')
  const match = text.match(/Proceso:\s*([^|.]+)/i)
  return match?.[1]?.trim() || null
}

function extractCodigoPuntoFromText(value) {
  const text = String(value || '')
  const match = text.match(/Punto(?:\s+FCCA)?\s+([0-9]+(?:\.[0-9]+)?)/i)
  return match?.[1] || null
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('auditor1@nor.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorText('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorText(error.message)
      setLoading(false)
      return
    }

    onLogin(data.session)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff_0,transparent_35%),radial-gradient(circle_at_bottom_right,#efe7ff_0,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff,#eef8ff)] flex items-center justify-center p-4">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-white/80 backdrop-blur-xl rounded-[36px] shadow-[0_30px_100px_rgba(15,23,42,0.18)] overflow-hidden border border-white"
      >
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white overflow-hidden">
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-bold mb-8">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              Sistema de Gestión Integral
            </div>

            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              NOR
            </h1>

            <p className="text-xl md:text-2xl text-cyan-100 mt-4 max-w-lg">
              Plataforma cloud para auditorías FCCA, acciones correctivas,
              cumplimiento ISO y dashboard ejecutivo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              <div className="bg-white/10 rounded-3xl p-5 border border-white/10">
                <ClipboardCheck className="w-7 h-7 text-cyan-300 mb-3" />
                <div className="font-black text-lg">Auditorías</div>
                <div className="text-sm text-cyan-100">FCCA · ISO · 5S</div>
              </div>
              <div className="bg-white/10 rounded-3xl p-5 border border-white/10">
                <Gauge className="w-7 h-7 text-emerald-300 mb-3" />
                <div className="font-black text-lg">Score vivo</div>
                <div className="text-sm text-cyan-100">0 · 1 · 2 · 3 · NA</div>
              </div>
              <div className="bg-white/10 rounded-3xl p-5 border border-white/10">
                <BarChart3 className="w-7 h-7 text-yellow-300 mb-3" />
                <div className="font-black text-lg">Dashboard</div>
                <div className="text-sm text-cyan-100">Indicadores clave</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-3xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5 shadow-inner">
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-950">
              Iniciar sesión
            </h2>
            <p className="text-slate-500 mt-2">
              Ingresa con los usuarios creados en Supabase Auth.
            </p>
          </div>

          <label className="text-sm font-black text-slate-700 mb-2">
            Correo
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 mb-4"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="auditor1@nor.com"
            type="email"
          />

          <label className="text-sm font-black text-slate-700 mb-2">
            Contraseña
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 mb-5"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña"
            type="password"
          />

          {errorText && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-bold mb-4">
              {errorText}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-slate-950 hover:bg-cyan-700 text-white font-black py-4 transition-all shadow-xl disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Entrar a NOR'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="hidden 2xl:flex w-[290px] shrink-0 min-h-[calc(100vh-32px)] bg-white/90 backdrop-blur-xl rounded-[34px] border border-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] p-5 flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-slate-950 to-cyan-800 text-white flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-950 leading-none">
              NOR
            </div>
            <div className="text-xs font-black text-cyan-700 uppercase tracking-[0.18em] mt-1">
              SGI Cloud
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const selected = activeView === item.id

            return (
              <button
                key={item.id}
                onClick={() => item.active ? setActiveView(item.id) : setActiveView(item.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all ${selected
                    ? 'bg-slate-950 text-white shadow-xl'
                    : 'bg-slate-50 hover:bg-cyan-50 text-slate-700'
                  }`}
              >
                <span className="flex items-center gap-3 font-black">
                  <Icon className={`w-5 h-5 ${selected ? 'text-cyan-300' : 'text-slate-500'}`} />
                  {item.label}
                </span>

                {!item.active && (
                  <span className={`text-[10px] rounded-full px-2 py-1 font-black ${selected ? 'bg-white/15 text-white' : 'bg-white text-slate-400'
                    }`}>
                    Próx.
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-4 border border-cyan-100">
        <div className="flex items-center gap-2 text-cyan-700 font-black mb-2">
          <Sparkles className="w-4 h-4" />
          MVP FCCA activo
        </div>
        <p className="text-sm text-slate-600 font-semibold">
          Login, dashboard y auditoría FCCA ya conectados a Supabase.
        </p>
      </div>
    </aside>
  )
}

function KpiCard({ title, value, subtitle, icon, tone = 'cyan' }) {
  const tones = {
    cyan: 'text-cyan-700 bg-cyan-50',
    green: 'text-emerald-700 bg-emerald-50',
    amber: 'text-amber-700 bg-amber-50',
    red: 'text-red-700 bg-red-50',
    slate: 'text-slate-700 bg-slate-50',
    violet: 'text-violet-700 bg-violet-50',
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[28px] p-5 border border-white shadow-[0_18px_50px_rgba(15,23,42,0.09)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`text-xs uppercase tracking-[0.18em] font-black ${tones[tone] || tones.cyan}`}>
            {title}
          </div>
          <div className="text-4xl font-black text-slate-950 mt-3">
            {value}
          </div>
          <div className="text-sm text-slate-500 font-semibold mt-2">
            {subtitle}
          </div>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${tones[tone] || tones.cyan} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

function FindingsView() {
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('abiertos')

  const normalizeFinding = (finding) => {
    const textoBase = `${finding.descripcion || ''} ${finding.titulo || ''}`
    const procesoDetectado =
      finding.proceso ||
      finding.proceso_auditado ||
      finding.responsable_proceso ||
      extractProcesoFromText(textoBase)

    return {
      ...finding,
      finding_id: finding.finding_id || finding.id,
      auditoria: finding.auditoria || finding.audit_name || finding.nombre_auditoria,
      codigo_punto:
        finding.codigo_punto ||
        finding.codigo ||
        finding.punto ||
        extractCodigoPuntoFromText(textoBase),
      calificacion_origen:
        finding.calificacion_origen ?? finding.calificacion ?? finding.process_calificacion,
      criticidad: finding.criticidad || 'menor',
      estado: finding.estado || 'abierto',
      tipo: finding.tipo || 'hallazgo',
      proceso: procesoDetectado,
      automatico: finding.automatico ?? true,
    }
  }

  const loadFindings = async () => {
    setLoading(true)

    const { data: viewData, error: viewError } = await supabase
      .from('v_fcca_findings')
      .select('*')
      .order('created_at', { ascending: false })

    if (viewError) {
      console.error(viewError)
    }

    const { data: baseData, error: baseError } = await supabase
      .from('findings')
      .select('*')
      .order('created_at', { ascending: false })

    if (baseError) {
      console.warn('No se pudieron cargar hallazgos desde tabla base:', baseError.message)
    }

    const merged = [...(viewData || []), ...(baseData || [])]
      .map(normalizeFinding)
      .filter((finding) => finding.finding_id)

    const unique = Array.from(
      new Map(merged.map((finding) => [finding.finding_id, finding])).values(),
    ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

    setFindings(unique)
    setLoading(false)
  }

  useEffect(() => {
    loadFindings()

    const channel = supabase
      .channel('fcca-findings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'findings',
        },
        () => {
          loadFindings()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredFindings = findings.filter((finding) => {
    if (filter === 'todos') return true
    if (filter === 'abiertos') return finding.estado === 'abierto'
    if (filter === 'cerrados') return finding.estado === 'cerrado'
    if (filter === 'criticos') return finding.criticidad === 'critica'
    if (filter === 'mayores') return finding.criticidad === 'mayor'
    if (filter === 'menores') return finding.criticidad === 'menor'
    return true
  })

  const stats = {
    total: findings.length,
    abiertos: findings.filter((f) => f.estado === 'abierto').length,
    cerrados: findings.filter((f) => f.estado === 'cerrado').length,
    criticos: findings.filter((f) => f.criticidad === 'critica').length,
    mayores: findings.filter((f) => f.criticidad === 'mayor').length,
    menores: findings.filter((f) => f.criticidad === 'menor').length,
  }

  const getCriticidadStyle = (criticidad) => {
    if (criticidad === 'critica') {
      return 'bg-red-100 text-red-700 border-red-200'
    }

    if (criticidad === 'mayor') {
      return 'bg-orange-100 text-orange-700 border-orange-200'
    }

    if (criticidad === 'menor') {
      return 'bg-amber-100 text-amber-700 border-amber-200'
    }

    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const getEstadoStyle = (estado) => {
    if (estado === 'abierto') {
      return 'bg-cyan-100 text-cyan-700 border-cyan-200'
    }

    if (estado === 'cerrado') {
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }

    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[34px] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
        <p className="text-slate-500 font-bold">Cargando hallazgos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-6 gap-5">
        <KpiCard
          title="Total"
          value={stats.total}
          subtitle="Hallazgos generados"
          icon={<AlertTriangle className="w-7 h-7" />}
          tone="slate"
        />
        <KpiCard
          title="Abiertos"
          value={stats.abiertos}
          subtitle="Requieren atención"
          icon={<Clock className="w-7 h-7" />}
          tone="cyan"
        />
        <KpiCard
          title="Cerrados"
          value={stats.cerrados}
          subtitle="Atendidos"
          icon={<CheckCircle2 className="w-7 h-7" />}
          tone="green"
        />
        <KpiCard
          title="Críticos"
          value={stats.criticos}
          subtitle="Mayor prioridad"
          icon={<XCircle className="w-7 h-7" />}
          tone="red"
        />
        <KpiCard
          title="Mayores"
          value={stats.mayores}
          subtitle="No conformidad"
          icon={<AlertTriangle className="w-7 h-7" />}
          tone="amber"
        />
        <KpiCard
          title="Menores"
          value={stats.menores}
          subtitle="Condicionados"
          icon={<FileText className="w-7 h-7" />}
          tone="violet"
        />
      </div>

      <div className="bg-white rounded-[34px] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-950">
              Hallazgos FCCA
            </h2>
            <p className="text-slate-500 font-semibold">
              Hallazgos generados automáticamente desde calificaciones 0, 1 y 2.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 font-bold"
            >
              <option value="abiertos">Abiertos</option>
              <option value="cerrados">Cerrados</option>
              <option value="criticos">Críticos</option>
              <option value="mayores">Mayores</option>
              <option value="menores">Menores</option>
              <option value="todos">Todos</option>
            </select>

            <button
              onClick={loadFindings}
              className="rounded-2xl bg-slate-950 hover:bg-cyan-700 text-white px-5 py-3 font-black flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar
            </button>
          </div>
        </div>

        {filteredFindings.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-8 text-slate-500 font-bold">
            No hay hallazgos para este filtro.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFindings.map((finding) => (
              <motion.div
                key={finding.finding_id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] border border-slate-100 bg-slate-50 p-5"
              >
                <div className="flex flex-col 2xl:flex-row 2xl:items-start justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="rounded-full bg-slate-950 text-white px-3 py-1 text-xs font-black">
                        Punto {finding.codigo_punto || 'S/C'}
                      </span>

                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${getCriticidadStyle(finding.criticidad)}`}>
                        {finding.criticidad || 'sin criticidad'}
                      </span>

                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${getEstadoStyle(finding.estado)}`}>
                        {finding.estado || 'sin estado'}
                      </span>

                      <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-black text-slate-600">
                        Calificación: {finding.calificacion_origen}
                      </span>

                      {finding.automatico && (
                        <span className="rounded-full bg-cyan-50 border border-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
                          Automático
                        </span>
                      )}

                      {finding.proceso && (
                        <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          Proceso: {finding.proceso}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-slate-950 leading-snug">
                      {finding.descripcion}
                    </h3>

                    <p className="text-slate-500 font-semibold mt-3">
                      Auditoría: {finding.auditoria || 'N/A'}
                    </p>
                  </div>

                  <div className="2xl:w-64 bg-white rounded-3xl p-4 border border-slate-100">
                    <div className="text-xs uppercase tracking-widest text-slate-400 font-black">
                      Tipo
                    </div>
                    <div className="font-black text-slate-950 mt-1">
                      {finding.tipo || 'hallazgo'}
                    </div>

                    <div className="text-xs uppercase tracking-widest text-slate-400 font-black mt-4">
                      Fecha
                    </div>
                    <div className="font-black text-slate-950 mt-1">
                      {finding.created_at
                        ? new Date(finding.created_at).toLocaleDateString('es-MX')
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ActionsView() {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('activas')
  const [attachments, setAttachments] = useState([])
  const [uploadingId, setUploadingId] = useState(null)
  const [commentDrafts, setCommentDrafts] = useState({})

  const normalizeAction = (action) => {
    const textoBase = `${action.descripcion || ''} ${action.titulo || ''}`
    const procesoDetectado =
      action.proceso ||
      action.proceso_auditado ||
      action.responsable_proceso ||
      extractProcesoFromText(textoBase)

    return {
      ...action,
      action_id: action.action_id || action.id,
      finding_id: action.finding_id || action.hallazgo_id || null,
      codigo_punto:
        action.codigo_punto ||
        action.codigo ||
        action.punto ||
        extractCodigoPuntoFromText(textoBase),
      titulo: action.titulo || 'Acción correctiva derivada de hallazgo FCCA',
      descripcion: action.descripcion || action.detalle || 'Acción correctiva generada desde hallazgo FCCA.',
      responsable:
        action.responsable ||
        action.responsable_nombre ||
        procesoDetectado ||
        'Responsable de Acción',
      estado: action.estado || 'pendiente',
      prioridad: action.prioridad || 'media',
      semaforo: action.semaforo || action.estado_validacion || 'a_tiempo',
      proceso: procesoDetectado,
    }
  }

  const loadActions = async () => {
    setLoading(true)

    const { data: viewData, error: viewError } = await supabase
      .from('v_fcca_actions')
      .select('*')
      .order('fecha_compromiso', { ascending: true })

    if (viewError) {
      console.error(viewError)
    }

    const { data: baseData, error: baseError } = await supabase
      .from('actions')
      .select('*')
      .order('fecha_compromiso', { ascending: true })

    if (baseError) {
      console.warn('No se pudieron cargar acciones desde tabla base:', baseError.message)
    }

    const merged = [...(viewData || []), ...(baseData || [])]
      .map(normalizeAction)
      .filter((action) => action.action_id)

    const unique = Array.from(
      new Map(merged.map((action) => [action.action_id, action])).values(),
    ).sort((a, b) => {
      const aDate = a.fecha_compromiso || '9999-12-31'
      const bDate = b.fecha_compromiso || '9999-12-31'
      return String(aDate).localeCompare(String(bDate))
    })

    setActions(unique)
    setLoading(false)
  }

  const loadAttachments = async () => {
    const { data, error } = await supabase
      .from('v_action_attachments')
      .select('*')

    if (error) {
      console.error(error)
      return
    }

    setAttachments(data || [])
  }

  useEffect(() => {
    loadActions()
    loadAttachments()

    const channel = supabase
      .channel('fcca-actions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'actions',
        },
        () => {
          loadActions()
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attachments',
        },
        () => {
          loadAttachments()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const uploadEvidence = async (action) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx'

    input.onchange = async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      setUploadingId(action.action_id)

      const fileExt = file.name.split('.').pop()
      const safeName = file.name
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '')

      const filePath = `acciones/${action.action_id}/${Date.now()}_${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('evidencias')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error(uploadError)
        alert(`Error al subir evidencia: ${uploadError.message}`)
        setUploadingId(null)
        return
      }

      const { data: userData } = await supabase.auth.getUser()

      const { error: insertError } = await supabase
        .from('attachments')
        .insert({
          company_id: null,
          audit_id: action.audit_id,
          response_id: action.response_id,
          finding_id: action.finding_id,
          action_id: action.action_id,
          nombre_archivo: file.name,
          storage_path: filePath,
          tipo_archivo: file.type || fileExt,
          descripcion: 'Evidencia de acción correctiva',
          modulo: 'acciones',
          uploaded_by: userData?.user?.id || null,
        })

      if (insertError) {
        console.error(insertError)
        alert(`La evidencia se subió, pero no se registró en la tabla: ${insertError.message}`)
        setUploadingId(null)
        return
      }

      setUploadingId(null)
      await loadAttachments()
      alert('Evidencia cargada correctamente')
    }

    input.click()
  }

  const updateActionStatus = async (action, estado) => {
    const actionAttachments = attachments.filter(
      (att) => att.action_id === action.action_id,
    )

    const comentarioActual = commentDrafts[action.action_id] ?? action.comentarios

    if (estado === 'cerrada' && actionAttachments.length === 0) {
      alert('No puedes cerrar la acción sin cargar al menos una evidencia.')
      return
    }

    if (estado === 'cerrada' && !comentarioActual) {
      alert('No puedes cerrar la acción sin agregar un comentario de cierre o seguimiento.')
      return
    }

    const payload = {
      estado,
      updated_at: new Date().toISOString(),
    }

    if (estado === 'cerrada') {
      payload.fecha_cierre = new Date().toISOString().slice(0, 10)
    }

    if (estado !== 'cerrada') {
      payload.fecha_cierre = null
    }

    const { error } = await supabase
      .from('actions')
      .update(payload)
      .eq('id', action.action_id)

    if (error) {
      console.error(error)
      alert(`Error al actualizar acción: ${error.message}`)
      return
    }

    await loadActions()
  }

  const filteredActions = actions.filter((action) => {
    if (filter === 'todas') return true

    if (filter === 'activas') {
      return ['pendiente', 'en_proceso'].includes(action.estado)
    }

    if (filter === 'pendientes') {
      return action.estado === 'pendiente'
    }

    if (filter === 'en_proceso') {
      return action.estado === 'en_proceso'
    }

    if (filter === 'pendiente_validacion') {
      return (
        action.estado === 'cerrada' &&
        action.estado_validacion === 'pendiente_validacion'
      )
    }

    if (filter === 'validadas') {
      return (
        action.estado === 'cerrada' &&
        action.estado_validacion === 'validada'
      )
    }

    if (filter === 'rechazadas') {
      return action.estado_validacion === 'rechazada'
    }

    if (filter === 'cerradas') {
      return action.estado === 'cerrada'
    }

    if (filter === 'vencidas') {
      return action.semaforo === 'vencida'
    }

    if (filter === 'por_vencer') {
      return action.semaforo === 'por_vencer'
    }

    return true
  })

  const stats = {
    total: actions.length,
    pendientes: actions.filter((a) => a.estado === 'pendiente').length,
    proceso: actions.filter((a) => a.estado === 'en_proceso').length,
    cerradas: actions.filter((a) => a.estado === 'cerrada').length,
    vencidas: actions.filter((a) => a.semaforo === 'vencida').length,
    porVencer: actions.filter((a) => a.semaforo === 'por_vencer').length,
  }

  const getSemaforoStyle = (semaforo) => {
    if (semaforo === 'vencida') return 'bg-red-100 text-red-700 border-red-200'
    if (semaforo === 'por_vencer') return 'bg-amber-100 text-amber-700 border-amber-200'
    if (semaforo === 'pendiente_validacion') return 'bg-violet-100 text-violet-700 border-violet-200'
    if (semaforo === 'cerrada_validada') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (semaforo === 'cerrada') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    return 'bg-cyan-100 text-cyan-700 border-cyan-200'
  }

  const getPriorityStyle = (prioridad) => {
    if (prioridad === 'alta') return 'bg-red-100 text-red-700 border-red-200'
    if (prioridad === 'media') return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const updateActionComment = async (actionId) => {
    const comentario = commentDrafts[actionId]

    const { error } = await supabase
      .from('actions')
      .update({
        comentarios: comentario || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', actionId)

    if (error) {
      console.error(error)
      alert(`Error al guardar comentario: ${error.message}`)
      return
    }

    await loadActions()
  }

  const validateActionClosure = async (action, status) => {
    const comentario = window.prompt(
      status === 'validada'
        ? 'Comentario de validación SGI:'
        : 'Motivo del rechazo SGI:',
      status === 'validada'
        ? 'Evidencia revisada y cierre aceptado.'
        : 'Se requiere complementar evidencia o corregir la acción.',
    )

    if (comentario === null) return

    const { error } = await supabase.rpc('validate_action_closure', {
      target_action_id: action.action_id,
      validation_status: status,
      validation_comment: comentario,
    })

    if (error) {
      console.error(error)
      alert(`Error al validar acción: ${error.message}`)
      return
    }

    await loadActions()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[34px] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
        <p className="text-slate-500 font-bold">Cargando acciones correctivas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-6 gap-5">
        <KpiCard title="Total" value={stats.total} subtitle="Acciones creadas" icon={<Target className="w-7 h-7" />} tone="slate" />
        <KpiCard title="Pendientes" value={stats.pendientes} subtitle="Sin iniciar" icon={<Clock className="w-7 h-7" />} tone="amber" />
        <KpiCard title="En proceso" value={stats.proceso} subtitle="En atención" icon={<RefreshCw className="w-7 h-7" />} tone="cyan" />
        <KpiCard title="Cerradas" value={stats.cerradas} subtitle="Concluidas" icon={<CheckCircle2 className="w-7 h-7" />} tone="green" />
        <KpiCard title="Vencidas" value={stats.vencidas} subtitle="Fuera de plazo" icon={<XCircle className="w-7 h-7" />} tone="red" />
        <KpiCard title="Por vencer" value={stats.porVencer} subtitle="Próximas 15 días" icon={<AlertTriangle className="w-7 h-7" />} tone="violet" />
      </div>

      <div className="bg-white rounded-[34px] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-950">
              Acciones correctivas
            </h2>
            <p className="text-slate-500 font-semibold">
              Acciones generadas desde hallazgos FCCA abiertos. Plazo base: 90 días.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 font-bold"
            >
              <option value="activas">Activas</option>
              <option value="pendientes">Pendientes</option>
              <option value="en_proceso">En proceso</option>
              <option value="pendiente_validacion">Pendiente validación</option>
              <option value="validadas">Validadas</option>
              <option value="rechazadas">Rechazadas</option>
              <option value="cerradas">Cerradas</option>
              <option value="vencidas">Vencidas</option>
              <option value="por_vencer">Por vencer</option>
              <option value="todas">Todas</option>
            </select>

            <button
              onClick={loadActions}
              className="rounded-2xl bg-slate-950 hover:bg-cyan-700 text-white px-5 py-3 font-black flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar
            </button>
          </div>
        </div>

        {filteredActions.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-8 text-slate-500 font-bold">
            No hay acciones correctivas para este filtro.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredActions.map((action) => {
              const actionFiles = attachments.filter(
                (att) => att.action_id === action.action_id,
              )

              return (
                <motion.div
                  key={action.action_id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[30px] border border-slate-100 bg-white p-5 md:p-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-5">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="rounded-full bg-slate-950 text-white px-3 py-1 text-xs font-black">
                        Punto {action.codigo_punto || 'S/C'}
                      </span>

                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${getPriorityStyle(action.prioridad)}`}>
                        Prioridad {action.prioridad || 'media'}
                      </span>

                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${getSemaforoStyle(action.semaforo)}`}>
                        {action.semaforo || 'sin semáforo'}
                      </span>

                      <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-black text-slate-600">
                        Estado: {action.estado || 'pendiente'}
                      </span>

                      {action.proceso && (
                        <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          Proceso: {action.proceso}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-slate-950 leading-snug">
                      {action.titulo}
                    </h3>

                    <p className="text-slate-600 font-semibold mt-3 leading-relaxed">
                      {action.descripcion}
                    </p>

                    <p className="text-slate-500 font-semibold mt-3">
                      Responsable: {action.responsable || 'Sin asignar'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_300px] gap-4 items-start">
                    <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-slate-400 font-black">
                            Seguimiento / comentario
                          </div>
                          <div className="text-sm text-slate-500 font-semibold">
                            Describe avance, corrección o cierre.
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateActionComment(action.action_id)}
                            className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 flex items-center justify-center"
                            title="Guardar comentario"
                          >
                            <Save className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setCommentDrafts((prev) => ({
                                ...prev,
                                [action.action_id]: action.comentarios || '',
                              }))
                            }
                            className="w-9 h-9 rounded-xl bg-white hover:bg-cyan-50 text-slate-600 border border-slate-200 flex items-center justify-center"
                            title="Editar comentario"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={commentDrafts[action.action_id] ?? action.comentarios ?? ''}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [action.action_id]: event.target.value,
                          }))
                        }
                        placeholder="Describe el avance, corrección realizada o comentario de cierre..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 min-h-[120px] outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400"
                      />
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-slate-400 font-black">
                            Evidencias
                          </div>
                          <div className="text-sm text-slate-500 font-semibold">
                            Adjunta soporte antes de cerrar.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => uploadEvidence(action)}
                          disabled={uploadingId === action.action_id}
                          className="rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 font-black disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          {uploadingId === action.action_id ? 'Subiendo...' : 'Subir'}
                        </button>
                      </div>

                      {actionFiles.length === 0 ? (
                        <div className="bg-white rounded-2xl p-4 text-slate-400 font-bold text-sm border border-slate-100">
                          Sin evidencias cargadas.
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {actionFiles.map((att) => (
                            <div
                              key={att.attachment_id}
                              className="flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-2xl bg-white border border-slate-100 px-4 py-3"
                            >
                              <div className="min-w-0">
                                <div className="font-black text-slate-900 truncate">
                                  {att.nombre_archivo}
                                </div>
                                <div className="text-xs text-slate-500 font-semibold">
                                  Cargado por {att.usuario || 'usuario'} ·{' '}
                                  {att.created_at
                                    ? new Date(att.created_at).toLocaleDateString('es-MX')
                                    : 'N/A'}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={async () => {
                                  const { data, error } = await supabase.storage
                                    .from('evidencias')
                                    .createSignedUrl(att.storage_path, 60)

                                  if (error) {
                                    alert(`No se pudo abrir evidencia: ${error.message}`)
                                    return
                                  }

                                  window.open(data.signedUrl, '_blank')
                                }}
                                className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:bg-cyan-50"
                              >
                                Ver archivo
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
                      <div className="text-xs uppercase tracking-widest text-slate-400 font-black">
                        Fecha compromiso
                      </div>

                      <div className="font-black text-slate-950 mt-1">
                        {action.fecha_compromiso || 'N/A'}
                      </div>

                      <div className="text-xs uppercase tracking-widest text-slate-400 font-black mt-4">
                        Cambiar estado
                      </div>

                      <select
                        value={action.estado || 'pendiente'}
                        onChange={(event) => updateActionStatus(action, event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 font-bold"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En proceso</option>
                        <option value="cerrada">Cerrada</option>
                      </select>

                      {action.estado === 'cerrada' && action.estado_validacion !== 'validada' && (
                        <div className="mt-4 grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={() => validateActionClosure(action, 'validada')}
                            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 font-black"
                          >
                            Validar cierre SGI
                          </button>

                          <button
                            type="button"
                            onClick={() => validateActionClosure(action, 'rechazada')}
                            className="rounded-2xl bg-red-600 hover:bg-red-700 text-white px-4 py-3 font-black"
                          >
                            Rechazar cierre
                          </button>
                        </div>
                      )}

                      {action.estado_validacion && (
                        <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-3">
                          <div className="text-xs uppercase tracking-widest text-slate-400 font-black">
                            Validación SGI
                          </div>

                          <div className={`inline-flex mt-2 rounded-full px-3 py-1 text-xs font-black border ${
                            action.estado_validacion === 'validada'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : action.estado_validacion === 'rechazada'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>
                            {action.estado_validacion}
                          </div>

                          {action.comentario_validacion && (
                            <p className="text-sm text-slate-500 font-semibold mt-3">
                              {action.comentario_validacion}
                            </p>
                          )}

                          {action.validado_por_nombre && (
                            <p className="text-xs text-slate-400 font-bold mt-2">
                              Validado por: {action.validado_por_nombre}
                            </p>
                          )}

                          {action.fecha_validacion && (
                            <p className="text-xs text-slate-400 font-bold mt-1">
                              Fecha validación:{' '}
                              {new Date(action.fecha_validacion).toLocaleDateString('es-MX')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ComingSoon({ title }) {
  return (
    <div className="bg-white rounded-[34px] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
      <div className="w-16 h-16 rounded-3xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5">
        <Wrench className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-black text-slate-950">
        {title}
      </h2>
      <p className="text-slate-500 font-semibold mt-2 max-w-2xl">
        Este módulo ya está contemplado dentro de la arquitectura de NOR. Se activará en las siguientes fases del desarrollo.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-3xl p-5">
          <div className="font-black text-slate-900">Estado</div>
          <div className="text-slate-500 text-sm mt-1">En construcción</div>
        </div>
        <div className="bg-slate-50 rounded-3xl p-5">
          <div className="font-black text-slate-900">Prioridad</div>
          <div className="text-slate-500 text-sm mt-1">Fase posterior al MVP FCCA</div>
        </div>
        <div className="bg-slate-50 rounded-3xl p-5">
          <div className="font-black text-slate-900">Base</div>
          <div className="text-slate-500 text-sm mt-1">Supabase + React</div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ dashboard, onOpenAudit, loading }) {
  const first = dashboard?.[0]
  const [detailRows, setDetailRows] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [processDashboardRows, setProcessDashboardRows] = useState([])

  useEffect(() => {
    if (!first?.audit_id) return

    let active = true

    const loadDashboardDetail = async () => {
      setDetailLoading(true)

      const { data, error } = await supabase
        .from('v_fcca_audit_detail')
        .select('*')
        .eq('audit_id', first.audit_id)
        .order('orden', { ascending: true })

      if (error) {
        console.error(error)
        if (active) setDetailLoading(false)
        return
      }

      const { data: processDataResult, error: processError } = await supabase
        .from('v_fcca_process_dashboard')
        .select('*')
        .eq('audit_id', first.audit_id)
        .order('score_proceso', { ascending: false })

      if (!active) return

      setDetailRows(data || [])

      if (processError) {
        console.warn('Dashboard por proceso no disponible todavía:', processError.message)
        setProcessDashboardRows([])
      } else {
        setProcessDashboardRows(processDataResult || [])
      }

      setDetailLoading(false)
    }

    loadDashboardDetail()

    const refreshDashboardDetail = () => {
      loadDashboardDetail()
    }

    const channel = supabase
      .channel(`dashboard-live-${first.audit_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_responses',
          filter: `audit_id=eq.${first.audit_id}`,
        },
        refreshDashboardDetail,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_process_responses',
          filter: `audit_id=eq.${first.audit_id}`,
        },
        refreshDashboardDetail,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'findings',
          filter: `audit_id=eq.${first.audit_id}`,
        },
        refreshDashboardDetail,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'actions',
          filter: `audit_id=eq.${first.audit_id}`,
        },
        refreshDashboardDetail,
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [first?.audit_id])

  const getNumericScore = (value) => {
    if (value === '3') return 3
    if (value === '2') return 2
    if (value === '1') return 1
    if (value === '0') return 0
    return null
  }

  const isEvaluableQuestion = (row) => {
    return (
      row.tipo_item === 'pregunta' &&
      row.response_id &&
      row.calificacion !== null &&
      row.calificacion !== undefined &&
      row.calificacion !== 'NA'
    )
  }

  const chartData = first
    ? [
        { name: 'Verde', value: Number(first.puntos_verdes || 0), fill: chartPalette.green },
        { name: 'Amarillo', value: Number(first.puntos_amarillos || 0), fill: chartPalette.amber },
        { name: 'Rojo', value: Number(first.puntos_rojos || 0), fill: chartPalette.red },
        { name: 'Gris', value: Number(first.puntos_grises || 0), fill: chartPalette.slate },
        { name: 'Pendiente', value: Number(first.puntos_pendientes || 0), fill: '#020617' },
      ]
    : []

  const sectionData = fccaSectionWeights.map((sectionItem, index) => {
    const sectionRows = detailRows.filter((row) => {
      const code = String(row.codigo_punto || '')
      return (
        row.tipo_item === 'pregunta' &&
        code.startsWith(`${sectionItem.section}.`) &&
        !code.endsWith('.0')
      )
    })

    const evaluatedRows = sectionRows.filter(isEvaluableQuestion)

    const scoreSum = evaluatedRows.reduce((acc, row) => {
      const score = getNumericScore(row.calificacion)
      return acc + (score ?? 0)
    }, 0)

    const maxScore = evaluatedRows.length * 3
    const scoreCompliance = maxScore > 0 ? Math.round((scoreSum / maxScore) * 100) : 0
    const progress = sectionRows.length > 0
      ? Math.round((evaluatedRows.length / sectionRows.length) * 100)
      : 0
    const contribution = Number(((scoreCompliance * sectionItem.weight) / 100).toFixed(1))

    return {
      ...sectionItem,
      total: sectionRows.length,
      evaluated: evaluatedRows.length,
      pending: sectionRows.length - evaluatedRows.length,
      compliance: progress,
      scoreCompliance,
      contribution,
      fill: [
        chartPalette.cyan,
        chartPalette.blue,
        chartPalette.violet,
        chartPalette.green,
        chartPalette.amber,
        chartPalette.red,
        chartPalette.slate,
      ][index],
    }
  })

  const weightedScore = Number(
    sectionData.reduce((acc, sectionItem) => acc + sectionItem.contribution, 0).toFixed(1),
  )

  const weightedDonutData = [
    {
      name: 'Cumplimiento ponderado',
      value: weightedScore,
      fill: chartPalette.cyan,
    },
    {
      name: 'Pendiente ponderado',
      value: Math.max(100 - weightedScore, 0),
      fill: '#e2e8f0',
    },
  ]

  const fallbackProcessData = procesosBase
    .map((processName) => {
      const rows = detailRows.filter((row) => {
        if (row.tipo_item !== 'pregunta') return false

        const procesosEvaluados = Array.isArray(row.procesos_evaluados)
          ? row.procesos_evaluados
          : []

        return procesosEvaluados.includes(processName)
      })

      const evaluatedRows = rows.filter(isEvaluableQuestion)

      const scoreSum = evaluatedRows.reduce((acc, row) => {
        const score = getNumericScore(row.calificacion)
        return acc + (score ?? 0)
      }, 0)

      const maxScore = evaluatedRows.length * 3
      const compliance = maxScore > 0 ? Math.round((scoreSum / maxScore) * 100) : 0

      return {
        name: processName,
        cumplimiento: compliance,
        puntos: rows.length,
        evaluados: evaluatedRows.length,
      }
    })
    .filter((item) => item.puntos > 0)
    .sort((a, b) => b.cumplimiento - a.cumplimiento)

  const processRealData = processDashboardRows
    .map((row) => ({
      name: row.proceso,
      cumplimiento: Number(row.score_proceso || 0),
      puntos: Number(row.total_respuestas_proceso || 0),
      evaluados: Number(row.puntos_evaluados || 0),
      pendientes: Number(row.puntos_pendientes || 0),
      verdes: Number(row.puntos_verdes || 0),
      amarillos: Number(row.puntos_amarillos || 0),
      rojos: Number(row.puntos_rojos || 0),
      na: Number(row.puntos_na || 0),
    }))
    .filter((item) => item.puntos > 0)
    .sort((a, b) => b.cumplimiento - a.cumplimiento)

  const hasRealProcessData = processRealData.length > 0

  const processData = hasRealProcessData ? processRealData : fallbackProcessData

  const processTotals = processRealData.reduce(
    (acc, item) => ({
      procesos: acc.procesos + 1,
      puntos: acc.puntos + item.puntos,
      evaluados: acc.evaluados + item.evaluados,
      pendientes: acc.pendientes + item.pendientes,
      rojos: acc.rojos + item.rojos,
      amarillos: acc.amarillos + item.amarillos,
      verdes: acc.verdes + item.verdes,
    }),
    {
      procesos: 0,
      puntos: 0,
      evaluados: 0,
      pendientes: 0,
      rojos: 0,
      amarillos: 0,
      verdes: 0,
    },
  )

  const processAdvance = processTotals.puntos > 0
    ? Math.round((processTotals.evaluados / processTotals.puntos) * 100)
    : 0

  const processScoreAverage = processRealData.length > 0
    ? Math.round(
        processRealData.reduce((acc, item) => acc + item.cumplimiento, 0) /
          processRealData.length,
      )
    : 0

  const processStatusData = processRealData.map((item) => ({
    name: item.name,
    Verde: item.verdes,
    Amarillo: item.amarillos,
    Rojo: item.rojos,
    Pendiente: item.pendientes,
  }))

  const criticalRows = detailRows.filter(
    (row) => row.tipo_item === 'pregunta' && row.es_critico,
  )

  const criticalEvaluated = criticalRows.filter(isEvaluableQuestion)

  const criticalCompliant = criticalEvaluated.filter((row) =>
    ['1', '2', '3'].includes(row.calificacion),
  )

  const criticalNonCompliant = criticalEvaluated.filter(
    (row) => row.calificacion === '0',
  )

  const criticalPending = criticalRows.length - criticalEvaluated.length

  const criticalCompliance =
    criticalEvaluated.length > 0
      ? Math.round((criticalCompliant.length / criticalEvaluated.length) * 100)
      : 0

  const criticalChartData = [
    {
      name: 'Cumple',
      value: criticalCompliant.length,
      fill: chartPalette.green,
    },
    {
      name: 'No cumple',
      value: criticalNonCompliant.length,
      fill: chartPalette.red,
    },
    {
      name: 'Pendiente',
      value: criticalPending,
      fill: chartPalette.amber,
    },
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-8 shadow-xl text-slate-500 font-bold">
        Cargando dashboard FCCA...
      </div>
    )
  }

  if (!first) {
    return (
      <div className="bg-white rounded-[32px] p-8 shadow-xl">
        <h2 className="text-2xl font-black text-slate-950">
          No hay auditorías FCCA disponibles
        </h2>
        <p className="text-slate-500 mt-2">
          Verifica que la auditoría inicial esté creada en Supabase.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <KpiCard
          title="Score global"
          value={`${first.score_global || 0}%`}
          subtitle="Cumplimiento FCCA"
          icon={<Gauge className="w-7 h-7" />}
          tone="green"
        />

        <KpiCard
          title="Score ponderado"
          value={`${weightedScore}%`}
          subtitle="Según ponderación FCCA"
          icon={<BarChart3 className="w-7 h-7" />}
          tone="cyan"
        />

        <KpiCard
          title="Total puntos"
          value={first.total_respuestas || 0}
          subtitle="Checklist FCCA"
          icon={<ClipboardCheck className="w-7 h-7" />}
          tone="cyan"
        />

        <KpiCard
          title="Pendientes"
          value={first.puntos_pendientes || 0}
          subtitle="Sin calificar"
          icon={<Clock className="w-7 h-7" />}
          tone="amber"
        />

        <KpiCard
          title="No cumple"
          value={first.puntos_rojos || 0}
          subtitle="Calificación 0"
          icon={<XCircle className="w-7 h-7" />}
          tone="red"
        />

        <KpiCard
          title="Críticos"
          value={`${criticalCompliance}%`}
          subtitle={`${criticalNonCompliant.length} no cumplen`}
          icon={<AlertTriangle className="w-7 h-7" />}
          tone={criticalNonCompliant.length > 0 ? 'red' : 'green'}
        />
      </div>

      {/* FILA EJECUTIVA */}
      <div className="grid grid-cols-1 2xl:grid-cols-[1.25fr_0.75fr] gap-5">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[30px] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 rounded-full px-3 py-1 text-xs font-black mb-3">
                <ClipboardList className="w-4 h-4" />
                Auditoría activa
              </div>

              <h2 className="text-2xl font-black text-slate-950">
                {first.auditoria}
              </h2>

              <p className="text-slate-500 font-semibold">
                {first.empresa} · {first.planta}
              </p>
            </div>

            <button
              onClick={() => onOpenAudit(first.audit_id)}
              className="rounded-2xl bg-slate-950 hover:bg-cyan-700 text-white px-5 py-3 font-black flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Abrir auditoría
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Auditor
              </div>
              <div className="text-slate-950 font-black text-base">
                {first.auditor || 'Sin asignar'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Responsable
              </div>
              <div className="text-slate-950 font-black text-base">
                {first.responsable || 'Sin asignar'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Fecha inicio
              </div>
              <div className="text-slate-950 font-black text-base">
                {first.fecha_inicio || 'N/A'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Fecha compromiso
              </div>
              <div className="text-slate-950 font-black text-base">
                {first.fecha_compromiso || 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 rounded-[30px] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)] border border-white/10 text-white"
        >
          <div className="absolute -top-20 -right-16 w-52 h-52 bg-cyan-400/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-16 w-52 h-52 bg-violet-400/20 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h2 className="text-xl font-black mb-1">
              Score ponderado FCCA
            </h2>

            <p className="text-cyan-100 font-semibold text-sm mb-2">
              Basado en ponderación oficial por sección.
            </p>

            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weightedDonutData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={84}
                    paddingAngle={4}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {weightedDonutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center mt-12">
                <div className="text-4xl font-black">
                  {weightedScore}%
                </div>
                <div className="text-[10px] uppercase tracking-widest text-cyan-100 font-black">
                  Ponderado
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RESULTADOS REALES POR PROCESO */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[30px] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Resultados reales por proceso
            </h2>
            <p className="text-slate-500 font-semibold text-sm">
              Basado en evaluaciones guardadas en la vista Por proceso.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 min-w-0 lg:min-w-[520px]">
            <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-3 text-center">
              <div className="text-xl font-black text-cyan-700">
                {processTotals.procesos}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black text-cyan-700">
                Procesos
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
              <div className="text-xl font-black text-slate-950">
                {processAdvance}%
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black text-slate-500">
                Avance
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <div className="text-xl font-black text-emerald-700">
                {processScoreAverage}%
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black text-emerald-700">
                Score prom.
              </div>
            </div>

            <div className="rounded-2xl bg-red-50 border border-red-100 p-3 text-center">
              <div className="text-xl font-black text-red-700">
                {processTotals.rojos}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black text-red-700">
                No cumple
              </div>
            </div>
          </div>
        </div>

        {hasRealProcessData ? (
          <div className="grid grid-cols-1 2xl:grid-cols-[1fr_1fr] gap-5">
            <div className="grid gap-2">
              {processRealData.slice(0, 8).map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl bg-slate-50 border border-slate-100 p-3"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="font-black text-slate-950 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-bold">
                        {item.evaluados}/{item.puntos} evaluados · {item.pendientes} pendientes
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-slate-950">
                        {item.cumplimiento}%
                      </div>
                      <div className="text-[11px] font-black text-red-600">
                        Rojos {item.rojos}
                      </div>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-white overflow-hidden border border-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      style={{
                        width: `${item.puntos > 0 ? Math.round((item.evaluados / item.puntos) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processStatusData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 11, fontWeight: 700 }}
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                  <Bar dataKey="Verde" stackId="a" fill={chartPalette.green} barSize={24} />
                  <Bar dataKey="Amarillo" stackId="a" fill={chartPalette.amber} barSize={24} />
                  <Bar dataKey="Rojo" stackId="a" fill={chartPalette.red} barSize={24} />
                  <Bar dataKey="Pendiente" stackId="a" fill="#020617" barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 text-slate-500 font-bold">
            Aún no hay evaluaciones guardadas en la vista Por proceso. Cuando evalúes Mezclas, Almacén MP u otro proceso, este panel mostrará resultados reales por área.
          </div>
        )}
      </motion.div>

      {/* FILA SECCIONES Y CRITICOS */}
      <div className="grid grid-cols-1 2xl:grid-cols-[1.15fr_0.85fr] gap-5">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[30px] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Cumplimiento por sección FCCA
              </h2>

              <p className="text-slate-500 font-semibold text-sm">
                Avance del total de puntos evaluados por sección.
              </p>
            </div>

            {detailLoading && (
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-400">
                Actualizando...
              </span>
            )}
          </div>

          <div className="grid gap-2">
            {sectionData.map((sectionItem) => (
              <div
                key={sectionItem.code}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-3"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-full bg-slate-950 text-white px-2.5 py-1 text-[10px] font-black">
                        {sectionItem.code}
                      </span>

                      <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-600">
                        Total {sectionItem.total}
                      </span>
                    </div>

                    <div className="font-black text-slate-950 text-sm truncate">
                      {sectionItem.title}
                    </div>

                    <div className="text-[11px] text-slate-500 font-bold">
                      {sectionItem.evaluated}/{sectionItem.total} puntos evaluados
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-slate-950">
                      {sectionItem.compliance}%
                    </div>

                    <div className="text-[11px] text-cyan-700 font-black">
                      Pend. {sectionItem.pending}
                    </div>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-white overflow-hidden border border-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_8px_20px_rgba(8,145,178,0.35)]"
                    style={{ width: `${sectionItem.compliance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[30px] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white"
        >
          <h2 className="text-xl font-black text-slate-950 mb-1">
            Críticos FCCA
          </h2>

          <p className="text-slate-500 font-semibold text-sm mb-3">
            Seguimiento especial de puntos críticos.
          </p>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={criticalChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={82}
                  paddingAngle={4}
                >
                  {criticalChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={24}
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="rounded-2xl bg-emerald-50 p-3 text-center">
              <div className="text-xl font-black text-emerald-700">
                {criticalCompliant.length}
              </div>
              <div className="text-[11px] font-black text-emerald-700">
                Cumplen
              </div>
            </div>

            <div className="rounded-2xl bg-red-50 p-3 text-center">
              <div className="text-xl font-black text-red-700">
                {criticalNonCompliant.length}
              </div>
              <div className="text-[11px] font-black text-red-700">
                No cumplen
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-3 text-center">
              <div className="text-xl font-black text-amber-700">
                {criticalPending}
              </div>
              <div className="text-[11px] font-black text-amber-700">
                Pendientes
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FILA GRAFICAS COMPACTAS */}
      <div className="grid grid-cols-1 2xl:grid-cols-[0.9fr_1.1fr] gap-5">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[30px] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white"
        >
          <h2 className="text-xl font-black text-slate-950 mb-1">
            Distribución general
          </h2>

          <p className="text-slate-500 font-semibold text-sm mb-3">
            Estado por calificación.
          </p>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={42}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {processData.length > 0 && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[30px] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white"
          >
            <h2 className="text-xl font-black text-slate-950 mb-1">
              {hasRealProcessData ? 'Score por proceso auditado' : 'Cumplimiento por proceso'}
            </h2>

            <p className="text-slate-500 font-semibold text-sm mb-3">
              {hasRealProcessData
                ? 'Calculado con evaluaciones reales de la vista Por proceso.'
                : 'Calculado con base en los procesos seleccionados en la auditoría.'}
            </p>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 11, fontWeight: 700 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="cumplimiento"
                    radius={[0, 10, 10, 0]}
                    name="Cumplimiento"
                    barSize={28}
                  >
                    {processData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.cumplimiento >= 90
                            ? chartPalette.green
                            : entry.cumplimiento >= 70
                              ? chartPalette.amber
                              : chartPalette.red
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function AuditDetail({ auditId, onBack, onRefreshDashboard }) {
  const [items, setItems] = useState([])
  const [processResponses, setProcessResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [processLoading, setProcessLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [selectedProcess, setSelectedProcess] = useState('todos')
  const [auditMode, setAuditMode] = useState('general')
  const [processAudit, setProcessAudit] = useState('Mezclas')
  const [collapsedSections, setCollapsedSections] = useState({})
  const [commentDrafts, setCommentDrafts] = useState({})
  const [editingComments, setEditingComments] = useState({})

  const isSectionItem = (item) => {
    const codigo = String(item.codigo_punto || '').trim()

    if (item.tipo_item === 'seccion') return true
    if (item.tipo_item === 'subtitulo') return true
    if (item.es_seccion === true) return true
    if (/^[0-9]+\.0$/.test(codigo)) return true

    return false
  }

  const getItemProcesses = (item) => {
    if (Array.isArray(item.procesos_aplicables)) {
      return item.procesos_aplicables
    }

    if (Array.isArray(item.procesos_evaluados)) {
      return item.procesos_evaluados
    }

    if (typeof item.procesos_aplicables === 'string') {
      return item.procesos_aplicables
        .split(';')
        .map((p) => p.trim())
        .filter(Boolean)
    }

    return []
  }

  const getSectionKeyFromItem = (item, currentSectionKey = null) => {
    const codigo = String(item.codigo_punto || '').trim()

    if (/^[0-9]+\.0$/.test(codigo)) return codigo

    if (/^[0-9]+\.[0-9]+$/.test(codigo)) {
      return `${codigo.split('.')[0]}.0`
    }

    return currentSectionKey
  }

  const toggleSection = (sectionKey) => {
    if (!sectionKey) return

    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const loadDetail = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('v_fcca_audit_detail')
      .select('*')
      .eq('audit_id', auditId)
      .order('orden', { ascending: true })

    if (error) {
      console.error(error)
      alert(`Error al cargar auditoría: ${error.message}`)
      setLoading(false)
      return
    }

    setItems(data || [])
    setLoading(false)
  }

  const loadProcessResponses = async () => {
    if (!auditId || !processAudit) return

    setProcessLoading(true)

    const { data, error } = await supabase
      .from('audit_process_responses')
      .select('*')
      .eq('audit_id', auditId)
      .eq('proceso', processAudit)

    if (error) {
      console.error(error)
      alert(`Error al cargar evaluación por proceso: ${error.message}`)
      setProcessLoading(false)
      return
    }

    setProcessResponses(data || [])
    setProcessLoading(false)
  }

  useEffect(() => {
    loadDetail()

    const channel = supabase
      .channel(`audit-detail-${auditId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_responses',
          filter: `audit_id=eq.${auditId}`,
        },
        () => {
          loadDetail()
          onRefreshDashboard()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [auditId])

  useEffect(() => {
    loadProcessResponses()

    const channel = supabase
      .channel(`audit-process-detail-${auditId}-${processAudit}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_process_responses',
          filter: `audit_id=eq.${auditId}`,
        },
        () => {
          loadProcessResponses()
          onRefreshDashboard()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [auditId, processAudit])

  const processResponseMap = useMemo(() => {
    const map = new Map()

    processResponses.forEach((response) => {
      map.set(response.template_item_id, response)
    })

    return map
  }, [processResponses])

  const getProcessResponse = (item) => {
    return processResponseMap.get(item.template_item_id)
  }

  const getItemRating = (item) => {
    if (auditMode === 'proceso') {
      return getProcessResponse(item)?.calificacion || null
    }

    return item.calificacion
  }

  const getItemComment = (item) => {
    if (auditMode === 'proceso') {
      return getProcessResponse(item)?.comentarios || ''
    }

    return item.comentarios || ''
  }

  const getCommentKey = (item) => {
    if (auditMode === 'proceso') {
      return `proceso-${item.template_item_id}-${processAudit}`
    }

    return `general-${item.response_id}`
  }

  const getSavingKey = (item) => {
    if (auditMode === 'proceso') {
      return `proceso-${item.template_item_id}-${processAudit}`
    }

    return item.response_id
  }

  const filteredItems = useMemo(() => {
    let currentSectionKey = null
    const targetProcess = auditMode === 'proceso' ? processAudit : selectedProcess

    return items.filter((item) => {
      if (
        item.tipo_item === 'seccion' ||
        /^[0-9]+\.0$/.test(String(item.codigo_punto || '').trim())
      ) {
        currentSectionKey = getSectionKeyFromItem(item)
      }

      const sectionKey = getSectionKeyFromItem(item, currentSectionKey)
      const sectionCollapsed = sectionKey ? collapsedSections[sectionKey] : false

      const matchesSearch =
        !search ||
        String(item.criterio || '').toLowerCase().includes(search.toLowerCase()) ||
        String(item.codigo_punto || '').toLowerCase().includes(search.toLowerCase())

      if (!matchesSearch) return false

      if (isSectionItem(item)) return true
      if (sectionCollapsed) return false

      const itemProcesses = getItemProcesses(item)

      const matchesProcess =
        targetProcess === 'todos' ||
        itemProcesses.includes(targetProcess) ||
        (Array.isArray(item.procesos_evaluados) &&
          item.procesos_evaluados.includes(targetProcess))

      if (!matchesProcess) return false

      const itemRating = auditMode === 'proceso'
        ? processResponseMap.get(item.template_item_id)?.calificacion
        : item.calificacion

      const matchesFilter =
        filter === 'todos'
          ? true
          : (filter === 'pendientes' && !itemRating) ||
            (filter === 'criticos' && item.es_critico) ||
            (filter === 'rojos' && itemRating === '0') ||
            (filter === 'amarillos' && ['1', '2'].includes(itemRating)) ||
            (filter === 'verdes' && itemRating === '3') ||
            (filter === 'na' && itemRating === 'NA')

      return matchesFilter
    })
  }, [items, filter, search, selectedProcess, processAudit, auditMode, collapsedSections, processResponseMap])

  const updateRating = async (responseId, value) => {
    if (!responseId) return

    setSavingId(responseId)

    const requiereAccion = ['0', '1', '2'].includes(value)

    setItems((prev) =>
      prev.map((row) =>
        row.response_id === responseId
          ? {
              ...row,
              calificacion: value,
              requiere_accion: requiereAccion,
              color_visual:
                value === '3'
                  ? 'verde'
                  : value === '2' || value === '1'
                    ? 'amarillo'
                    : value === '0'
                      ? 'rojo'
                      : value === 'NA'
                        ? 'gris'
                        : null,
            }
          : row,
      ),
    )

    const { error } = await supabase
      .from('audit_responses')
      .update({
        calificacion: value,
        requiere_accion: requiereAccion,
        updated_at: new Date().toISOString(),
      })
      .eq('id', responseId)

    if (error) {
      console.error(error)
      alert(`Error al guardar calificación: ${error.message}`)
      await loadDetail()
    }

    setSavingId(null)
    await onRefreshDashboard()
  }

  const syncProcessFindingAction = async (item, value, processResponseId = null) => {
    if (!item?.template_item_id || !processAudit) return

    const isFindingValue = ['0', '1', '2'].includes(value)
    const baseDescription = `Punto FCCA ${item.codigo_punto || 'S/C'} - ${processAudit} con calificación ${value}. Criterio: ${item.criterio || 'Sin criterio registrado'}`
    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(today.getDate() + 90)

    const findingPayload = {
      company_id: null,
      audit_id: auditId,
      response_id: null,
      template_item_id: item.template_item_id,
      process_response_id: processResponseId || null,
      proceso: processAudit,
      descripcion: baseDescription,
      tipo:
        value === '0'
          ? 'no_cumplimiento'
          : 'cumplimiento_condicionado',
      criticidad: item.es_critico || value === '0' ? 'critica' : 'menor',
      estado: isFindingValue ? 'abierto' : 'cerrado',
      calificacion_origen: value,
      automatico: true,
      updated_at: new Date().toISOString(),
    }

    const actionTitle = `Acción correctiva - ${processAudit} - Punto ${item.codigo_punto || 'S/C'}`
    const actionDescription = `Proceso: ${processAudit}. ${baseDescription}`

    const findExistingProcessFinding = async () => {
      let query = supabase
        .from('findings')
        .select('*')
        .eq('audit_id', auditId)
        .eq('template_item_id', item.template_item_id)
        .eq('proceso', processAudit)
        .eq('automatico', true)
        .limit(1)

      const { data, error } = await query

      if (error) {
        console.warn('No se pudo buscar hallazgo por proceso:', error.message)
        return null
      }

      return data?.[0] || null
    }

    const findExistingProcessAction = async (findingId) => {
      if (!findingId) return null

      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('finding_id', findingId)
        .limit(1)

      if (error) {
        console.warn('No se pudo buscar acción por proceso:', error.message)
        return null
      }

      return data?.[0] || null
    }

    const insertFindingSafely = async (payload) => {
      const attempts = [
        payload,
        {
          ...payload,
          process_response_id: undefined,
        },
        {
          ...payload,
          process_response_id: undefined,
          proceso: undefined,
        },
      ]

      for (const attempt of attempts) {
        const cleanPayload = Object.fromEntries(
          Object.entries(attempt).filter(([, val]) => val !== undefined),
        )

        const { data, error } = await supabase
          .from('findings')
          .insert(cleanPayload)
          .select('*')
          .single()

        if (!error) return { data, error: null }

        const message = String(error.message || '').toLowerCase()
        const recoverable =
          message.includes('column') ||
          message.includes('duplicate key') ||
          message.includes('idx_findings_unique_response_auto')

        if (!recoverable) return { data: null, error }
      }

      return {
        data: null,
        error: {
          message:
            'No se pudo insertar hallazgo por proceso después de intentar payloads compatibles.',
        },
      }
    }

    const updateFindingSafely = async (findingId, payload) => {
      const attempts = [
        payload,
        {
          ...payload,
          process_response_id: undefined,
        },
        {
          ...payload,
          process_response_id: undefined,
          proceso: undefined,
        },
      ]

      for (const attempt of attempts) {
        const cleanPayload = Object.fromEntries(
          Object.entries(attempt).filter(([, val]) => val !== undefined),
        )

        const { data, error } = await supabase
          .from('findings')
          .update(cleanPayload)
          .eq('id', findingId)
          .select('*')
          .single()

        if (!error) return { data, error: null }

        const message = String(error.message || '').toLowerCase()
        const recoverable = message.includes('column')
        if (!recoverable) return { data: null, error }
      }

      return { data: null, error: { message: 'No se pudo actualizar hallazgo.' } }
    }

    const insertActionSafely = async (findingId) => {
      const basePayload = {
        company_id: null,
        audit_id: auditId,
        response_id: null,
        finding_id: findingId,
        template_item_id: item.template_item_id,
        process_response_id: processResponseId || null,
        proceso: processAudit,
        titulo: actionTitle,
        descripcion: actionDescription,
        tipo: 'correctiva',
        estado: 'pendiente',
        prioridad: item.es_critico || value === '0' ? 'alta' : 'media',
        fecha_inicio: today.toISOString().slice(0, 10),
        fecha_compromiso: dueDate.toISOString().slice(0, 10),
        comentarios: null,
        origen: 'proceso',
        automatico: true,
        updated_at: new Date().toISOString(),
      }

      const attempts = [
        basePayload,
        {
          ...basePayload,
          process_response_id: undefined,
        },
        {
          ...basePayload,
          process_response_id: undefined,
          proceso: undefined,
        },
        {
          ...basePayload,
          process_response_id: undefined,
          proceso: undefined,
          origen: undefined,
        },
      ]

      for (const attempt of attempts) {
        const cleanPayload = Object.fromEntries(
          Object.entries(attempt).filter(([, val]) => val !== undefined),
        )

        const { data, error } = await supabase
          .from('actions')
          .insert(cleanPayload)
          .select('*')
          .single()

        if (!error) return { data, error: null }

        const message = String(error.message || '').toLowerCase()
        const recoverable =
          message.includes('column') ||
          message.includes('duplicate key') ||
          message.includes('unique')

        if (!recoverable) return { data: null, error }
      }

      return { data: null, error: { message: 'No se pudo insertar acción.' } }
    }

    const updateActionSafely = async (actionId) => {
      const payload = {
        titulo: actionTitle,
        descripcion: actionDescription,
        prioridad: item.es_critico || value === '0' ? 'alta' : 'media',
        estado: 'pendiente',
        fecha_cierre: null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('actions')
        .update(payload)
        .eq('id', actionId)

      if (error) {
        console.warn('No se pudo actualizar acción por proceso:', error.message)
      }
    }

    const removeAutomaticProcessFindingAction = async (existingFinding) => {
      if (!existingFinding?.id) return

      const existingAction = await findExistingProcessAction(existingFinding.id)

      if (existingAction?.id) {
        const { data: actionFiles, error: filesError } = await supabase
          .from('attachments')
          .select('id')
          .eq('action_id', existingAction.id)
          .limit(1)

        if (filesError) {
          console.warn('No se pudo validar evidencia antes de quitar acción:', filesError.message)
        }

        const hasFiles = Array.isArray(actionFiles) && actionFiles.length > 0
        const hasComment = Boolean(String(existingAction.comentarios || '').trim())
        const isAutomaticProcessAction = existingAction.automatico !== false

        if (!hasFiles && !hasComment && isAutomaticProcessAction) {
          const { error: deleteActionError } = await supabase
            .from('actions')
            .delete()
            .eq('id', existingAction.id)

          if (deleteActionError) {
            console.warn('No se pudo quitar acción automática por proceso:', deleteActionError.message)
            return
          }
        } else {
          console.warn(
            'La acción automática por proceso ya tiene seguimiento/evidencia; no se cerrará automáticamente desde el checklist.',
          )
          return
        }
      }

      const { data: remainingActions, error: remainingError } = await supabase
        .from('actions')
        .select('id')
        .eq('finding_id', existingFinding.id)
        .limit(1)

      if (remainingError) {
        console.warn('No se pudo validar si quedan acciones ligadas al hallazgo:', remainingError.message)
        return
      }

      if (!remainingActions || remainingActions.length === 0) {
        const { error: deleteFindingError } = await supabase
          .from('findings')
          .delete()
          .eq('id', existingFinding.id)

        if (deleteFindingError) {
          console.warn('No se pudo quitar hallazgo automático por proceso:', deleteFindingError.message)
        }
      }
    }

    try {
      const rpcPayload = {
        target_audit_id: auditId,
        target_template_item_id: item.template_item_id,
        target_response_id: null,
        target_process_response_id: processResponseId,
        target_proceso: processAudit,
        target_calificacion: value,
        target_codigo_punto: item.codigo_punto || null,
        target_criterio: item.criterio || null,
        target_es_critico: Boolean(item.es_critico),
      }

      const { error: rpcError } = await supabase.rpc(
        'sync_process_finding_action',
        rpcPayload,
      )

      if (rpcError) {
        console.warn(
          'RPC sync_process_finding_action no completó; se usará sincronización directa:',
          rpcError.message,
        )
      }

      const existingFinding = await findExistingProcessFinding()

      if (!isFindingValue) {
        if (existingFinding?.id) {
          await removeAutomaticProcessFindingAction(existingFinding)
        }

        return
      }

      let findingRecord = existingFinding

      if (findingRecord?.id) {
        const { data, error } = await updateFindingSafely(
          findingRecord.id,
          findingPayload,
        )

        if (error) {
          console.warn('No se pudo actualizar hallazgo por proceso:', error.message)
        } else {
          findingRecord = data || findingRecord
        }
      } else {
        const { data, error } = await insertFindingSafely(findingPayload)

        if (error) {
          console.warn('No se pudo crear hallazgo por proceso:', error.message)
          return
        }

        findingRecord = data
      }

      if (!findingRecord?.id) return

      const existingAction = await findExistingProcessAction(findingRecord.id)

      if (existingAction?.id) {
        await updateActionSafely(existingAction.id)
      } else {
        const { error } = await insertActionSafely(findingRecord.id)

        if (error) {
          console.warn('No se pudo crear acción por proceso:', error.message)
        }
      }
    } catch (error) {
      console.warn('No se pudo sincronizar hallazgo/acción por proceso:', error.message)
    }
  }

  const updateProcessRating = async (item, value) => {
    if (!item?.template_item_id || !processAudit) return

    const savingKey = getSavingKey(item)
    setSavingId(savingKey)

    const commentKey = getCommentKey(item)
    const comentarios = commentDrafts[commentKey] ?? getItemComment(item) ?? null

    const { data, error } = await supabase.rpc('save_audit_process_response', {
      target_audit_id: auditId,
      target_template_item_id: item.template_item_id,
      target_proceso: processAudit,
      target_calificacion: value,
      target_comentarios: comentarios || null,
      target_response_id: item.response_id || null,
    })

    if (error) {
      console.error(error)
      alert(`Error al guardar calificación por proceso: ${error.message}`)
      setSavingId(null)
      return
    }

    setProcessResponses((prev) => {
      const exists = prev.some((row) => row.template_item_id === item.template_item_id)
      const updatedRow = {
        id: data,
        audit_id: auditId,
        template_item_id: item.template_item_id,
        response_id: item.response_id || null,
        proceso: processAudit,
        calificacion: value,
        comentarios: comentarios || null,
        updated_at: new Date().toISOString(),
      }

      if (exists) {
        return prev.map((row) =>
          row.template_item_id === item.template_item_id
            ? { ...row, ...updatedRow }
            : row,
        )
      }

      return [...prev, updatedRow]
    })

    await syncProcessFindingAction(item, value, data)

    setSavingId(null)
    await onRefreshDashboard()
  }

  const clearRating = async (responseId) => {
    if (!responseId) return

    setSavingId(responseId)

    setItems((prev) =>
      prev.map((row) =>
        row.response_id === responseId
          ? {
              ...row,
              calificacion: null,
              requiere_accion: false,
              color_visual: null,
            }
          : row,
      ),
    )

    const { error } = await supabase
      .from('audit_responses')
      .update({
        calificacion: null,
        requiere_accion: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', responseId)

    if (error) {
      console.error(error)
      alert(`Error al limpiar calificación: ${error.message}`)
      await loadDetail()
    }

    setSavingId(null)
    await onRefreshDashboard()
  }

  const clearProcessRating = async (item) => {
    if (!item?.template_item_id || !processAudit) return

    const savingKey = getSavingKey(item)
    setSavingId(savingKey)

    const { data, error } = await supabase.rpc('save_audit_process_response', {
      target_audit_id: auditId,
      target_template_item_id: item.template_item_id,
      target_proceso: processAudit,
      target_calificacion: null,
      target_comentarios: null,
      target_response_id: item.response_id || null,
    })

    if (error) {
      console.error(error)
      alert(`Error al limpiar calificación por proceso: ${error.message}`)
      setSavingId(null)
      return
    }

    setProcessResponses((prev) => {
      const exists = prev.some((row) => row.template_item_id === item.template_item_id)
      const updatedRow = {
        id: data,
        audit_id: auditId,
        template_item_id: item.template_item_id,
        response_id: item.response_id || null,
        proceso: processAudit,
        calificacion: null,
        comentarios: getProcessResponse(item)?.comentarios || null,
        updated_at: new Date().toISOString(),
      }

      if (exists) {
        return prev.map((row) =>
          row.template_item_id === item.template_item_id
            ? { ...row, ...updatedRow }
            : row,
        )
      }

      return [...prev, updatedRow]
    })

    await syncProcessFindingAction(item, null, data)

    setSavingId(null)
    await onRefreshDashboard()
  }

  const updateComments = async (responseId, comentarios) => {
    if (!responseId) return

    const { error } = await supabase
      .from('audit_responses')
      .update({
        comentarios,
        updated_at: new Date().toISOString(),
      })
      .eq('id', responseId)

    if (error) {
      console.error(error)
      alert(`Error al guardar comentario: ${error.message}`)
      return
    }

    setItems((prev) =>
      prev.map((row) =>
        row.response_id === responseId ? { ...row, comentarios } : row,
      ),
    )

    setEditingComments((prev) => ({
      ...prev,
      [`general-${responseId}`]: false,
    }))
  }

  const updateProcessComments = async (item, comentarios) => {
    if (!item?.template_item_id || !processAudit) return

    const { data, error } = await supabase.rpc('save_audit_process_comment', {
      target_audit_id: auditId,
      target_template_item_id: item.template_item_id,
      target_proceso: processAudit,
      target_comentarios: comentarios,
      target_response_id: item.response_id || null,
    })

    if (error) {
      console.error(error)
      alert(`Error al guardar comentario por proceso: ${error.message}`)
      return
    }

    setProcessResponses((prev) => {
      const exists = prev.some((row) => row.template_item_id === item.template_item_id)
      const updatedRow = {
        id: data,
        audit_id: auditId,
        template_item_id: item.template_item_id,
        response_id: item.response_id || null,
        proceso: processAudit,
        calificacion: getProcessResponse(item)?.calificacion || null,
        comentarios,
        updated_at: new Date().toISOString(),
      }

      if (exists) {
        return prev.map((row) =>
          row.template_item_id === item.template_item_id
            ? { ...row, ...updatedRow }
            : row,
        )
      }

      return [...prev, updatedRow]
    })

    setEditingComments((prev) => ({
      ...prev,
      [getCommentKey(item)]: false,
    }))
  }

  const toggleProceso = async (item, proceso) => {
    if (!item.response_id || auditMode === 'proceso') return

    const actuales = Array.isArray(item.procesos_evaluados)
      ? item.procesos_evaluados
      : []

    const nuevos = actuales.includes(proceso)
      ? actuales.filter((p) => p !== proceso)
      : [...actuales, proceso]

    const { error } = await supabase
      .from('audit_responses')
      .update({
        procesos_evaluados: nuevos,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.response_id)

    if (error) {
      console.error(error)
      alert(`Error al actualizar procesos: ${error.message}`)
      return
    }

    setItems((prev) =>
      prev.map((row) =>
        row.response_id === item.response_id
          ? { ...row, procesos_evaluados: nuevos }
          : row,
      ),
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-8 shadow-xl text-slate-500 font-bold">
        Cargando puntos FCCA...
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[32px] p-5 md:p-6 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white sticky top-4 z-20">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="text-cyan-700 font-black mb-3 hover:underline"
            >
              ← Volver al dashboard
            </button>
            <h2 className="text-3xl font-black text-slate-950">
              Auditoría FCCA
            </h2>
            <p className="text-slate-500 font-semibold">
              {auditMode === 'general'
                ? 'Vista general del checklist maestro. El filtro por proceso funciona como navegación.'
                : `Evaluación específica del proceso: ${processAudit}. Los hallazgos futuros quedarán ligados al proceso.`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadDetail()
              loadProcessResponses()
            }}
            className="rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 font-black flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Actualizar
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mt-5">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200 w-fit">
            <button
              type="button"
              onClick={() => setAuditMode('general')}
              className={`rounded-xl px-4 py-2 text-sm font-black transition-all ${
                auditMode === 'general'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              General
            </button>

            <button
              type="button"
              onClick={() => setAuditMode('proceso')}
              className={`rounded-xl px-4 py-2 text-sm font-black transition-all ${
                auditMode === 'proceso'
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              Por proceso
            </button>
          </div>

          {auditMode === 'proceso' && (
            <div className="rounded-2xl bg-cyan-50 border border-cyan-100 px-4 py-2 text-cyan-800 font-bold text-sm flex items-center">
              Evaluación independiente por área: {processAudit}
              {processLoading ? ' · cargando...' : ''}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px_260px] gap-4 mt-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por punto o criterio..."
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400"
          />

          {auditMode === 'general' ? (
            <select
              value={selectedProcess}
              onChange={(event) => setSelectedProcess(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 font-bold"
            >
              <option value="todos">Todos los procesos</option>
              {procesosBase.map((proceso) => (
                <option key={proceso} value={proceso}>
                  {proceso}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={processAudit}
              onChange={(event) => setProcessAudit(event.target.value)}
              className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 font-black text-cyan-900"
            >
              {procesosBase.map((proceso) => (
                <option key={proceso} value={proceso}>
                  {proceso}
                </option>
              ))}
            </select>
          )}

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 font-bold"
          >
            <option value="todos">Todos</option>
            <option value="pendientes">Pendientes</option>
            <option value="criticos">Críticos</option>
            <option value="rojos">No cumple</option>
            <option value="amarillos">Condicionados</option>
            <option value="verdes">Cumple total</option>
            <option value="na">No aplica</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => {
          if (
            item.tipo_item === 'seccion' ||
            /^[0-9]+\.0$/.test(String(item.codigo_punto || '').trim())
          ) {
            const sectionKey = getSectionKeyFromItem(item)
            const isCollapsed = collapsedSections[sectionKey]

            return (
              <motion.div
                key={item.template_item_id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[30px] bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 text-white p-6 md:p-8 shadow-[0_16px_50px_rgba(15,23,42,0.18)] border border-white/20"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
                >
                  <div className="flex flex-col gap-3">
                    <span className="inline-flex w-fit rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
                      Sección {item.codigo_punto}
                    </span>

                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      {item.criterio}
                    </h2>
                  </div>

                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    {isCollapsed ? (
                      <ChevronRight className="w-6 h-6 text-cyan-200" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-cyan-200" />
                    )}
                  </div>
                </button>
              </motion.div>
            )
          }

          if (item.tipo_item === 'subtitulo') {
            return (
              <motion.div
                key={item.template_item_id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[24px] bg-cyan-50 border border-cyan-100 text-cyan-900 px-6 py-4"
              >
                <div className="text-xs uppercase tracking-[0.18em] font-black text-cyan-600 mb-1">
                  Subtítulo
                </div>

                <h3 className="text-xl font-black">
                  {item.criterio}
                </h3>
              </motion.div>
            )
          }

          const currentRating = getItemRating(item)
          const rating = getRatingConfig(currentRating)
          const procesos = Array.isArray(item.procesos_evaluados)
            ? item.procesos_evaluados
            : []
          const itemProcesses = getItemProcesses(item)
          const commentKey = getCommentKey(item)
          const savingKey = getSavingKey(item)
          const currentComment = getItemComment(item)

          return (
            <motion.div
              key={auditMode === 'proceso' ? `${item.template_item_id}-${processAudit}` : item.response_id || item.template_item_id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-[30px] p-5 md:p-6 border shadow-[0_14px_40px_rgba(15,23,42,0.08)] ${
                rating ? rating.soft : 'border-white'
              }`}
            >
              <div className="flex flex-col 2xl:flex-row gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-full bg-slate-950 text-white px-3 py-1 text-xs font-black">
                      Punto {item.codigo_punto || item.orden}
                    </span>

                    {auditMode === 'proceso' && (
                      <span className="rounded-full bg-cyan-100 text-cyan-800 px-3 py-1 text-xs font-black border border-cyan-200">
                        Evaluando: {processAudit}
                      </span>
                    )}

                    {item.es_critico && (
                      <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-black flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Crítico
                      </span>
                    )}

                    {item.es_adicional && (
                      <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-black">
                        Adicional
                      </span>
                    )}

                    {rating && (
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${rating.text} bg-white border`}>
                        {rating.description}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-black text-slate-950 leading-snug">
                    {item.criterio}
                  </h3>

                  {item.tips && (
                    <details className="mt-3 bg-slate-50 rounded-2xl p-4">
                      <summary className="font-black text-slate-700 cursor-pointer">
                        Ver tip de ayuda
                      </summary>
                      <p className="text-slate-600 mt-2">
                        {item.tips}
                      </p>
                    </details>
                  )}

                  <div className="mt-5">
                    <div className="text-xs uppercase tracking-widest font-black text-slate-400 mb-2">
                      {auditMode === 'proceso' ? 'Procesos aplicables' : 'Procesos evaluados'}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
                      {procesosBase.map((proceso) => {
                        const active = auditMode === 'proceso'
                          ? proceso === processAudit && itemProcesses.includes(proceso)
                          : procesos.includes(proceso)
                        const applicable = itemProcesses.includes(proceso)

                        return (
                          <button
                            key={proceso}
                            type="button"
                            disabled={auditMode === 'proceso'}
                            onClick={() => toggleProceso(item, proceso)}
                            className={`min-h-[40px] rounded-2xl px-3 py-2 text-[11px] font-black border transition-all text-center leading-tight flex items-center justify-center ${
                              active
                                ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                                : applicable
                                  ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            {proceso}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <div className="text-xs uppercase tracking-widest font-black text-slate-400">
                          Observaciones / evidencia textual
                        </div>
                        {auditMode === 'proceso' && (
                          <div className="text-xs font-bold text-cyan-700 mt-1">
                            Este comentario pertenece solo a {processAudit}.
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const value = commentDrafts[commentKey] ?? currentComment ?? ''
                            if (auditMode === 'proceso') {
                              updateProcessComments(item, value)
                            } else {
                              updateComments(item.response_id, value)
                            }
                          }}
                          className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 flex items-center justify-center"
                          title="Guardar comentario"
                        >
                          <Save className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditingComments((prev) => ({
                              ...prev,
                              [commentKey]: true,
                            }))
                          }
                          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-cyan-50 text-slate-600 border border-slate-200 flex items-center justify-center"
                          title="Editar comentario"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={commentDrafts[commentKey] ?? currentComment ?? ''}
                      onChange={(event) =>
                        setCommentDrafts((prev) => ({
                          ...prev,
                          [commentKey]: event.target.value,
                        }))
                      }
                      disabled={
                        Boolean(currentComment) &&
                        editingComments[commentKey] !== true
                      }
                      placeholder="Comentarios u observaciones del auditor..."
                      className={`w-full rounded-2xl border px-4 py-3 min-h-[90px] outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 ${
                        Boolean(currentComment) && editingComments[commentKey] !== true
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="2xl:w-72">
                  <div className="text-xs uppercase tracking-widest font-black text-slate-400 mb-3">
                    {auditMode === 'proceso'
                      ? `Calificación · ${processAudit}`
                      : 'Calificación FCCA'}
                  </div>

                  <div className="grid grid-cols-5 2xl:grid-cols-1 gap-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        disabled={savingId === savingKey}
                        onClick={() => {
                          if (auditMode === 'proceso') {
                            updateProcessRating(item, option.value)
                          } else {
                            updateRating(item.response_id, option.value)
                          }
                        }}
                        className={`rounded-2xl px-4 py-3 font-black border transition-all flex items-center justify-center 2xl:justify-between gap-2 ${
                          currentRating === option.value
                            ? `${option.color} text-white border-transparent shadow-lg`
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="hidden 2xl:inline text-xs opacity-80">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={savingId === savingKey || !currentRating}
                    onClick={() => {
                      if (auditMode === 'proceso') {
                        clearProcessRating(item)
                      } else {
                        clearRating(item.response_id)
                      }
                    }}
                    className={`mt-3 w-full rounded-2xl px-4 py-3 font-black border transition-all ${
                      currentRating
                        ? 'bg-white hover:bg-red-50 text-red-600 border-red-200'
                        : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                    }`}
                  >
                    Limpiar calificación
                  </button>

                  {savingId === savingKey && (
                    <div className="text-xs text-slate-500 font-bold mt-3">
                      Guardando...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [dashboard, setDashboard] = useState([])
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  const [selectedAuditId, setSelectedAuditId] = useState(null)
  const [activeView, setActiveView] = useState('dashboard')

  const loadProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nombre, email, puesto')
      .eq('id', userId)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setProfile(data)
  }

  const loadDashboard = async () => {
    setLoadingDashboard(true)

    const { data, error } = await supabase
      .from('v_fcca_dashboard')
      .select('*')
      .order('fecha_inicio', { ascending: false })

    if (error) {
      console.error(error)
      alert(`Error al cargar dashboard: ${error.message}`)
      setLoadingDashboard(false)
      return
    }

    setDashboard(data || [])
    setLoadingDashboard(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)

      if (data.session?.user?.id) {
        loadProfile(data.session.user.id)
        loadDashboard()
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)

      if (currentSession?.user?.id) {
        loadProfile(currentSession.user.id)
        loadDashboard()
      } else {
        setProfile(null)
        setDashboard([])
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel('fcca-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_responses',
        },
        () => {
          loadDashboard()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSelectedAuditId(null)
    setSession(null)
    setProfile(null)
  }

  const currentMenuLabel = menuItems.find((item) => item.id === activeView)?.label || 'Dashboard'

  if (!session) {
    return <LoginScreen onLogin={setSession} />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff_0,transparent_35%),radial-gradient(circle_at_bottom_right,#f1e8ff_0,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff,#eef8ff)] p-4">
      <div className="w-full max-w-none mx-auto flex gap-5">
        <Sidebar activeView={activeView} setActiveView={(view) => {
          setSelectedAuditId(null)
          setActiveView(view)
        }} />

        <main className="flex-1 min-w-0">
          <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 rounded-[34px] p-6 md:p-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.20)] mb-6">
            <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-bold mb-4">
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  Sistema de Gestión Integral
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  {selectedAuditId ? 'Auditoría FCCA' : currentMenuLabel}
                </h1>

                <p className="text-cyan-100 text-lg mt-2">
                  NOR · Auditorías · Acciones · Cumplimiento · Dashboard ejecutivo
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="bg-white/10 border border-white/15 rounded-3xl px-5 py-3">
                  <div className="text-xs uppercase tracking-widest text-cyan-100 font-black">
                    Usuario
                  </div>
                  <div className="flex items-center gap-2 font-black">
                    <UserRound className="w-4 h-4" />
                    {profile?.nombre || session.user.email}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-white text-slate-950 hover:bg-cyan-50 px-5 py-4 font-black flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Salir
                </button>
              </div>
            </div>
          </header>

          {selectedAuditId ? (
            <AuditDetail
              auditId={selectedAuditId}
              onBack={() => setSelectedAuditId(null)}
              onRefreshDashboard={loadDashboard}
            />
          ) : activeView === 'dashboard' || activeView === 'fcca' ? (
            <Dashboard
              dashboard={dashboard}
              loading={loadingDashboard}
              onOpenAudit={setSelectedAuditId}
            />
          ) : activeView === 'hallazgos' ? (
            <FindingsView />
          ) : activeView === 'acciones' ? (
            <ActionsView />
          ) : (
            <ComingSoon title={currentMenuLabel} />
          )}
        </main>
      </div>
    </div>
  )
}

