import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  Gauge,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
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

function getRatingConfig(value) {
  return ratingOptions.find((item) => item.value === value)
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-white/80 backdrop-blur-xl rounded-[36px] shadow-[0_30px_100px_rgba(15,23,42,0.18)] overflow-hidden border border-white"
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

function KpiCard({ title, value, subtitle, icon, tone = 'cyan' }) {
  const tones = {
    cyan: 'text-cyan-700 bg-cyan-50',
    green: 'text-emerald-700 bg-emerald-50',
    amber: 'text-amber-700 bg-amber-50',
    red: 'text-red-700 bg-red-50',
    slate: 'text-slate-700 bg-slate-50',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
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

function Dashboard({ dashboard, onOpenAudit, loading }) {
  const first = dashboard?.[0]

  const chartData = first
    ? [
        { name: 'Verde', value: Number(first.puntos_verdes || 0) },
        { name: 'Amarillo', value: Number(first.puntos_amarillos || 0) },
        { name: 'Rojo', value: Number(first.puntos_rojos || 0) },
        { name: 'Gris', value: Number(first.puntos_grises || 0) },
        { name: 'Pendiente', value: Number(first.puntos_pendientes || 0) },
      ]
    : []

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <KpiCard
          title="Score global"
          value={`${first.score_global || 0}%`}
          subtitle="Cumplimiento FCCA"
          icon={<Gauge className="w-7 h-7" />}
          tone="green"
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
          title="N/A"
          value={first.puntos_grises || 0}
          subtitle="No aplica"
          icon={<FileText className="w-7 h-7" />}
          tone="slate"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white rounded-[32px] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {first.auditoria}
              </h2>
              <p className="text-slate-500 font-semibold">
                {first.empresa} · {first.planta}
              </p>
            </div>
            <button
              onClick={() => onOpenAudit(first.audit_id)}
              className="rounded-2xl bg-slate-950 hover:bg-cyan-700 text-white px-5 py-3 font-black flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Abrir auditoría
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Auditor
              </div>
              <div className="text-slate-950 font-black text-lg">
                {first.auditor || 'Sin asignar'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Responsable
              </div>
              <div className="text-slate-950 font-black text-lg">
                {first.responsable || 'Sin asignar'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Fecha inicio
              </div>
              <div className="text-slate-950 font-black text-lg">
                {first.fecha_inicio || 'N/A'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-slate-400 font-black uppercase tracking-widest">
                Fecha compromiso
              </div>
              <div className="text-slate-950 font-black text-lg">
                {first.fecha_compromiso || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
          <h2 className="text-2xl font-black text-slate-950 mb-1">
            Distribución
          </h2>
          <p className="text-slate-500 font-semibold mb-5">
            Estado por calificación
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuditDetail({ auditId, onBack, onRefreshDashboard }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')

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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        String(item.criterio || '').toLowerCase().includes(search.toLowerCase()) ||
        String(item.codigo_punto || '').toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'todos' ||
        (filter === 'pendientes' && !item.calificacion) ||
        (filter === 'criticos' && item.es_critico) ||
        (filter === 'rojos' && item.calificacion === '0') ||
        (filter === 'amarillos' && ['1', '2'].includes(item.calificacion)) ||
        (filter === 'verdes' && item.calificacion === '3') ||
        (filter === 'na' && item.calificacion === 'NA')

      return matchesSearch && matchesFilter
    })
  }, [items, filter, search])

  const updateRating = async (responseId, value) => {
    setSavingId(responseId)

    const requiereAccion = ['0', '1', '2'].includes(value)

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
    }

    setSavingId(null)
    await loadDetail()
    await onRefreshDashboard()
  }

  const updateComments = async (responseId, comentarios) => {
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
    }
  }

  const toggleProceso = async (item, proceso) => {
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
      <div className="bg-white rounded-[32px] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)] border border-white">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="text-cyan-700 font-black mb-3 hover:underline"
            >
              ← Volver al dashboard
            </button>
            <h2 className="text-3xl font-black text-slate-950">
              Auditoría FCCA
            </h2>
            <p className="text-slate-500 font-semibold">
              Califica cada punto con 0, 1, 2, 3 o NA.
            </p>
          </div>

          <button
            onClick={loadDetail}
            className="rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 font-black flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4 mt-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por punto o criterio..."
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400"
          />

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
          const rating = getRatingConfig(item.calificacion)
          const procesos = Array.isArray(item.procesos_evaluados)
            ? item.procesos_evaluados
            : []

          return (
            <motion.div
              key={item.response_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-[30px] p-5 border shadow-[0_14px_40px_rgba(15,23,42,0.08)] ${
                rating ? rating.soft : 'border-white'
              }`}
            >
              <div className="flex flex-col xl:flex-row gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-full bg-slate-950 text-white px-3 py-1 text-xs font-black">
                      Punto {item.codigo_punto || item.orden}
                    </span>

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

                  <h3 className="text-lg font-black text-slate-950 leading-snug">
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

                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-widest font-black text-slate-400 mb-2">
                      Procesos evaluados
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {procesosBase.map((proceso) => {
                        const active = procesos.includes(proceso)

                        return (
                          <button
                            key={proceso}
                            onClick={() => toggleProceso(item, proceso)}
                            className={`rounded-full px-3 py-1.5 text-xs font-black border transition-all ${
                              active
                                ? 'bg-cyan-600 text-white border-cyan-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-cyan-50'
                            }`}
                          >
                            {proceso}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <textarea
                    defaultValue={item.comentarios || ''}
                    onBlur={(event) => updateComments(item.response_id, event.target.value)}
                    placeholder="Comentarios u observaciones del auditor..."
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 min-h-[90px] outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400"
                  />
                </div>

                <div className="xl:w-64">
                  <div className="text-xs uppercase tracking-widest font-black text-slate-400 mb-3">
                    Calificación FCCA
                  </div>

                  <div className="grid grid-cols-5 xl:grid-cols-1 gap-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.value}
                        disabled={savingId === item.response_id}
                        onClick={() => updateRating(item.response_id, option.value)}
                        className={`rounded-2xl px-4 py-3 font-black border transition-all flex items-center justify-center xl:justify-between gap-2 ${
                          item.calificacion === option.value
                            ? `${option.color} text-white border-transparent shadow-lg`
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="hidden xl:inline text-xs opacity-80">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>

                  {savingId === item.response_id && (
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

  if (!session) {
    return <LoginScreen onLogin={setSession} />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff_0,transparent_35%),radial-gradient(circle_at_bottom_right,#f1e8ff_0,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff,#eef8ff)] p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 rounded-[34px] p-6 md:p-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.20)] mb-6">
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-bold mb-4">
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                Sistema de Gestión Integral
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                NOR
              </h1>

              <p className="text-cyan-100 text-lg mt-2">
                Auditoría FCCA · Dashboard ejecutivo · Calificación en vivo
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
                className="rounded-2xl bg-white text-slate-950 hover:bg-cyan-50 px-5 py-4 font-black flex items-center gap-2"
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
        ) : (
          <Dashboard
            dashboard={dashboard}
            loading={loadingDashboard}
            onOpenAudit={setSelectedAuditId}
          />
        )}
      </div>
    </div>
  )
}