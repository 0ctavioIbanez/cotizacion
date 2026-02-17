"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Circle,
  Lock,
  Smartphone,
  Truck,
  Layout,
  Download,
  FileText,
  AlertTriangle,
  Info,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  core: Smartphone,
  repartidores: Truck,
  admin: Layout,
}

const DATA = {
  config: {
    password: "LaRaclette",
    bono: -15000,
    poliza: 6500,
  },
  servicios: [
    {
      id: "core",
      nombre: "Aplicacion Movil para Clientes",
      precio: 115000,
      obligatorio: true,
      desc: "El nucleo del proyecto. iOS y Android nativo.",
      funcionalidades: [
        { n: "Menu Digital e Infraestructura Base", tags: ["*", "**"] },
        { n: "Personalizacion Avanzada de Platillos", tags: ["*", "**"] },
        { n: "Selector de Sucursal Inteligente", tags: ["*", "**"] },
        { n: "Billetera y Pagos Seguros", tags: ["*", "**"] },
        { n: "Seguimiento en Tiempo Real", tags: ["*"] },
      ],
    },
    {
      id: "repartidores",
      nombre: "App para Repartidores",
      precio: 45000,
      obligatorio: false,
      desc: "Logistica propia y monitoreo en tiempo real.",
      funcionalidades: [
        { n: "Gestion de Pedidos", tags: ["*"] },
        { n: "Monitoreo GPS en tiempo real", tags: ["*"] },
        { n: "Historial y Liquidacion", tags: ["**"] },
      ],
    },
    {
      id: "admin",
      nombre: "Panel Administrador Web",
      precio: 85000,
      obligatorio: false,
      desc: "Gestion total de la operacion y contenidos.",
      funcionalidades: [
        { n: "Tablero de Analiticas y Reportes", tags: ["**"] },
        { n: "Gestion de Sucursales e Inventario", tags: ["*", "**"] },
        { n: "Base de Datos de Clientes (CRM)", tags: ["*", "**"] },
        { n: "Editor de Contenido CMS", tags: ["**"] },
        { n: "Modulo de Catering", tags: ["**"] },
      ],
    },
  ],
}

type SubItemState = Record<string, Record<number, boolean>>

function buildInitialSubItems(): SubItemState {
  const state: SubItemState = {}
  DATA.servicios.forEach((s) => {
    state[s.id] = {}
    s.funcionalidades.forEach((_, idx) => {
      state[s.id][idx] = true
    })
  })
  return state
}

export default function CotizadorRaclette() {
  const [isAuth, setIsAuth] = useState(false)
  const [pass, setPass] = useState("")
  const [adminType, setAdminType] = useState<"actual" | "custom">("custom")
  const [selected, setSelected] = useState(["core", "admin"])
  const [error, setError] = useState(false)
  const [subItems, setSubItems] = useState<SubItemState>(buildInitialSubItems)
  const [includePoliza, setIncludePoliza] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

  const SYNC_COST = 27000

  const getVisibleFuncCount = (serviceId: string) => {
    const s = DATA.servicios.find((srv) => srv.id === serviceId)
    if (!s) return { total: 0, checked: 0 }
    const total = s.funcionalidades.length
    const checked = s.funcionalidades.filter(
      (_, idx) => subItems[serviceId]?.[idx] !== false
    ).length
    return { total, checked }
  }

  const getScopeDiscount = (serviceId: string): number => {
    const { total, checked } = getVisibleFuncCount(serviceId)
    if (total === 0) return 0
    const uncheckedRatio = (total - checked) / total
    if (uncheckedRatio > 0.5) {
      const basePrice =
        serviceId === "admin"
          ? adminType === "custom"
            ? 85000
            : SYNC_COST
          : DATA.servicios.find((s) => s.id === serviceId)?.precio ?? 0
      return Math.round(basePrice * -0.1)
    }
    return 0
  }

  const pricing = useMemo(() => {
    const lines: { label: string; amount: number; sub?: string }[] = []
    let subtotal = 0

    selected.forEach((id) => {
      const s = DATA.servicios.find((srv) => srv.id === id)
      if (!s) return

      if (id === "admin") {
        if (adminType === "custom") {
          lines.push({
            label: s.nombre,
            amount: s.precio,
            sub: "Desarrollo completo del panel de administracion",
          })
          subtotal += s.precio
        } else {
          lines.push({
            label: "Servicio de Sincronizacion e Integracion",
            amount: SYNC_COST,
            sub: "Puente de datos con tu Admin Actual",
          })
          subtotal += SYNC_COST
        }
      } else {
        lines.push({ label: s.nombre, amount: s.precio })
        subtotal += s.precio
      }

      const discount = getScopeDiscount(id)
      if (discount < 0) {
        lines.push({
          label: `Optimizacion de Alcance (${s.nombre})`,
          amount: discount,
        })
        subtotal += discount
      }
    })

    const bonoApplies = adminType === "actual"

    if (bonoApplies) {
      lines.push({ label: "Bono de Integracion", amount: DATA.config.bono })
      subtotal += DATA.config.bono
    }

    return { lines, total: subtotal, bonoApplies }
  }, [selected, adminType, subItems])

  const toggleSubItem = (serviceId: string, idx: number) => {
    setSubItems((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [idx]: !prev[serviceId][idx],
      },
    }))
  }

  const generatePDF = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()

    const addPageIfNeeded = (currentY: number, needed: number) => {
      if (currentY + needed > 270) {
        doc.addPage()
        return 25
      }
      return currentY
    }

    // --- HEADER ---
    doc.setFillColor(26, 26, 26)
    doc.rect(0, 0, pageW, 45, "F")
    doc.setTextColor(244, 208, 63)
    doc.setFontSize(24)
    doc.text("Raclette Mexico", 20, 22)
    doc.setFontSize(11)
    doc.setTextColor(255, 255, 255)
    doc.text("Propuesta Tecnologica para Raclette Mexico", 20, 32)
    doc.setFontSize(9)
    doc.setTextColor(180, 180, 180)
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-MX")}`, pageW - 20, 22, { align: "right" })
    doc.text(
      `Admin: ${adminType === "custom" ? "Web Custom (**)" : "Actual (*)"}`,
      pageW - 20,
      30,
      { align: "right" }
    )

    // --- MODULES ---
    let y = 58
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(14)
    doc.text("Modulos Seleccionados", 20, y)
    y += 3
    doc.setDrawColor(244, 208, 63)
    doc.setLineWidth(0.5)
    doc.line(20, y, pageW - 20, y)
    y += 10

    selected.forEach((id) => {
      const s = DATA.servicios.find((srv) => srv.id === id)
      if (!s) return

      y = addPageIfNeeded(y, 12)

      const moduleLabel =
        id === "admin"
          ? adminType === "custom"
            ? s.nombre
            : "Servicio de Sincronizacion e Integracion"
          : s.nombre
      const moduleCost =
        id === "admin"
          ? adminType === "custom"
            ? s.precio
            : SYNC_COST
          : s.precio

      doc.setFontSize(12)
      doc.setTextColor(30, 30, 30)
      doc.setFont("helvetica", "bold")
      doc.text(moduleLabel, 22, y)
      doc.text(`$${moduleCost.toLocaleString()} MXN`, pageW - 22, y, {
        align: "right",
      })
      y += 7

      // Sub-items
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      s.funcionalidades.forEach((f, idx) => {
        y = addPageIfNeeded(y, 6)
        const isChecked = subItems[id]?.[idx] !== false
        doc.setTextColor(isChecked ? 80 : 170, isChecked ? 80 : 170, isChecked ? 80 : 170)
        const marker = isChecked ? "[x]" : "[ ]"
        doc.text(`  ${marker}  ${f.n}`, 26, y)
        y += 5
      })

      // Scope discount
      const discount = getScopeDiscount(id)
      if (discount < 0) {
        y = addPageIfNeeded(y, 7)
        doc.setTextColor(220, 120, 0)
        doc.setFontSize(10)
        doc.text(
          `  Optimizacion de Alcance: $${discount.toLocaleString()} MXN`,
          26,
          y
        )
        y += 7
      }
      y += 5
    })

    // Bono
    if (pricing.bonoApplies) {
      y = addPageIfNeeded(y, 10)
      doc.setTextColor(0, 150, 0)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(
        `Bono de Integracion: $${DATA.config.bono.toLocaleString()} MXN`,
        22,
        y
      )
      y += 10
    }

    // --- TOTAL ---
    y = addPageIfNeeded(y, 20)
    doc.setFillColor(244, 208, 63)
    doc.roundedRect(18, y - 2, pageW - 36, 16, 3, 3, "F")
    doc.setTextColor(26, 26, 26)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("TOTAL ESTIMADO", 24, y + 9)
    doc.text(`$${pricing.total.toLocaleString()} MXN`, pageW - 24, y + 9, {
      align: "right",
    })
    y += 28

    // --- CONDICIONES ---
    y = addPageIfNeeded(y, 70)
    doc.setFontSize(13)
    doc.setTextColor(60, 60, 60)
    doc.setFont("helvetica", "bold")
    doc.text("Terminos y Condiciones", 20, y)
    y += 3
    doc.setDrawColor(244, 208, 63)
    doc.line(20, y, pageW - 20, y)
    y += 10

    const terms = [
      {
        title: "Garantia",
        text: "90 dias naturales contra errores de codigo.",
      },
      {
        title: "Soporte",
        text: "1 mes de acompanamiento y capacitacion gratuita para el equipo.",
      },
      {
        title: "Mantenimiento",
        text: includePoliza
          ? `Poliza mensual de $${DATA.config.poliza.toLocaleString()} MXN (incluye servidores en la nube, actualizaciones de seguridad y soporte tecnico).`
          : "Los costos de operacion (servidores, actualizaciones y soporte) corren por cuenta de La Raclette.",
      },
      {
        title: "Propiedad Intelectual",
        text: "La propiedad intelectual del codigo fuente pertenece al cliente al liquidar el proyecto.",
      },
    ]

    doc.setFontSize(10)
    terms.forEach((t) => {
      y = addPageIfNeeded(y, 14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(30, 30, 30)
      doc.text(`${t.title}:`, 22, y)
      y += 5
      doc.setFont("helvetica", "normal")
      doc.setTextColor(90, 90, 90)
      const split = doc.splitTextToSize(t.text, pageW - 50)
      doc.text(split, 22, y)
      y += split.length * 5 + 4
    })

    // --- FOOTER ---
    y = addPageIfNeeded(y, 15)
    doc.setFontSize(8)
    doc.setTextColor(170, 170, 170)
    doc.text(
      "Este documento es una propuesta comercial generada automaticamente. Precios en MXN. Vigencia: 30 dias naturales.",
      pageW / 2,
      y + 5,
      { align: "center" }
    )

    doc.save(`Propuesta_Raclette_${new Date().getTime()}.pdf`)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pass === DATA.config.password) setIsAuth(true)
    else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  const toggleService = (id: string) => {
    if (id === "core") return
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 text-[#FDFEFE]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#242424] p-10 rounded-3xl border border-white/5 shadow-2xl"
        >
          <div className="flex justify-center mb-6 text-[#F4D03F]">
            <Lock size={50} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-center mb-2">
            Acceso Privado
          </h1>
          <p className="text-center text-white/40 mb-8 text-sm">
            Ingresa la clave para visualizar la propuesta tecnica.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contrasena del proyecto"
              className={`w-full bg-[#1a1a1a] border ${error ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-4 text-[#FDFEFE] outline-none focus:border-[#F4D03F] transition-all text-center tracking-widest`}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-[#F4D03F] text-[#1a1a1a] font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(244,208,63,0.3)] transition-all"
            >
              Desbloquear Cotizacion
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#FDFEFE] font-sans pb-20">
      <header className="py-16 px-6 text-center bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif font-bold mb-4"
        >
          Ecosistema Digital
        </motion.h1>
        <p className="text-white/40 max-w-xl mx-auto text-lg">
          Personaliza tu plataforma tecnologica y descarga el presupuesto
          oficial.
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 p-6">
        <div className="lg:col-span-8 space-y-8">
          {/* Selector de Admin */}
          <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5">
            <h2 className="text-sm uppercase tracking-widest font-bold mb-6 text-[#F4D03F]">
              01. Configuracion de Gestion
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAdminType("actual")}
                className={`p-6 rounded-2xl border text-left transition-all ${adminType === "actual" ? "border-[#F4D03F] bg-[#F4D03F]/5" : "border-white/5 hover:bg-white/5"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${adminType === "actual" ? "bg-[#F4D03F] text-[#1a1a1a]" : "bg-white/10 text-white/40"}`}
                  >
                    *
                  </span>
                  <div className="text-lg font-bold">Panel Actual</div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed mt-3 ml-11">
                  Sincronizacion tecnica con tu sistema de renta vigente.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setAdminType("custom")}
                className={`p-6 rounded-2xl border text-left transition-all ${adminType === "custom" ? "border-[#F4D03F] bg-[#F4D03F]/5" : "border-white/5 hover:bg-white/5"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${adminType === "custom" ? "bg-[#F4D03F] text-[#1a1a1a]" : "bg-white/10 text-white/40"}`}
                  >
                    **
                  </span>
                  <div className="text-lg font-bold">Admin Custom</div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed mt-3 ml-11">
                  Desarrollo desde cero para independencia total de rentas.
                </p>
              </button>
            </div>
          </div>

          <h2 className="text-sm uppercase tracking-widest font-bold text-[#F4D03F] px-2">
            02. Seleccion de Modulos
          </h2>
          {DATA.servicios.map((s) => {
            const IconComp = ICON_MAP[s.id]
            const isSelected = selected.includes(s.id)
            const scopeDiscount = isSelected ? getScopeDiscount(s.id) : 0
            const { total: visFuncTotal, checked: visFuncChecked } =
              getVisibleFuncCount(s.id)

            return (
              <motion.div
                key={s.id}
                className={`rounded-3xl border transition-all duration-500 ${isSelected ? "bg-[#1a1a1a] border-[#F4D03F] shadow-[0_0_30px_rgba(244,208,63,0.05)]" : "bg-transparent border-white/5 opacity-50"}`}
              >
                {/* Clickable header */}
                <div
                  onClick={() => toggleService(s.id)}
                  className="p-8 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex gap-5 items-center">
                      <div
                        className={`p-4 rounded-2xl ${isSelected ? "bg-[#F4D03F] text-[#1a1a1a]" : "bg-white/5"}`}
                      >
                        {IconComp && <IconComp className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{s.nombre}</h3>
                        <p className="text-white/40 text-sm mt-1">{s.desc}</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-serif font-bold">
                        $
                        {s.id === "admin"
                          ? (adminType === "custom"
                              ? s.precio
                              : SYNC_COST
                            ).toLocaleString()
                          : s.precio.toLocaleString()}
                      </div>
                      {s.id === "admin" && adminType === "actual" && (
                        <span className="text-[10px] text-white/40 mt-1 block">
                          Sincronizacion e Integracion
                        </span>
                      )}
                      {s.id === "admin" && adminType === "custom" && (
                        <span className="text-[10px] text-[#F4D03F]/60 mt-1 block">
                          Desarrollo completo
                        </span>
                      )}
                      {s.obligatorio && (
                        <span className="text-[10px] text-[#F4D03F] border border-[#F4D03F] px-2 py-0.5 rounded-md uppercase font-bold mt-2 inline-block">
                          Modulo Base
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-items - always visible */}
                {isSelected && (
                  <div className="px-8 pb-8">
                    {/* Scope discount warning */}
                    {scopeDiscount < 0 && (
                      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-5">
                        <AlertTriangle
                          size={16}
                          className="text-amber-400 shrink-0"
                        />
                        <span className="text-xs text-amber-300">
                          Optimizacion de Alcance activa: 10% de descuento
                          aplicado ({visFuncChecked}/{visFuncTotal}{" "}
                          funcionalidades seleccionadas)
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 pt-6 border-t border-white/5">
                      {s.funcionalidades.map((f, idx) => {
                        const isChecked = subItems[s.id]?.[idx] !== false
                        const tagLabel = f.tags.join(" ")

                        return (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSubItem(s.id, idx)
                            }}
                            className={`flex items-center justify-between py-2 cursor-pointer rounded-lg px-2 -mx-2 transition-all hover:bg-white/5 ${isChecked ? "opacity-100" : "opacity-40"}`}
                          >
                            <div className="flex items-center gap-3 text-sm">
                              {isChecked ? (
                                <CheckCircle
                                  size={16}
                                  className="text-[#F4D03F] shrink-0"
                                />
                              ) : (
                                <Circle
                                  size={16}
                                  className="text-white/30 shrink-0"
                                />
                              )}
                              <span
                                className={
                                  isChecked ? "" : "line-through text-white/40"
                                }
                              >
                                {f.n}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold ml-3 shrink-0 text-[#F4D03F]">
                              {tagLabel}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Sidebar Sticky */}
        <div className="lg:col-span-4">
          <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 sticky top-10">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <FileText size={22} className="text-[#F4D03F]" /> Tu Inversion
            </h2>

            <div className="space-y-4 mb-8">
              {pricing.lines.map((line, i) => {
                const isDiscount = line.amount < 0
                return (
                  <motion.div
                    key={`${line.label}-${i}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div
                      className={`flex justify-between text-sm ${
                        isDiscount
                          ? line.label.includes("Bono")
                            ? "text-[#58d68d] font-bold py-2 border-y border-white/5"
                            : "text-amber-400 font-medium"
                          : ""
                      }`}
                    >
                      <span className={isDiscount ? "" : "text-white/50"}>
                        {line.label}
                      </span>
                      <span className="font-mono">
                        {isDiscount ? "-" : ""}$
                        {Math.abs(line.amount).toLocaleString()}
                      </span>
                    </div>
                    {line.sub && (
                      <span className="text-[10px] text-white/30 mt-1 block">
                        {line.sub}
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase font-bold text-white/30 tracking-widest">
                  Total Estimado
                </span>
                <motion.span
                  key={pricing.total}
                  initial={{ scale: 1.1, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-serif font-bold text-[#F4D03F] tracking-tighter"
                >
                  ${pricing.total.toLocaleString()}
                </motion.span>
              </div>
            </div>

            <button
              type="button"
              onClick={generatePDF}
              className="w-full bg-[#F4D03F] text-[#1a1a1a] font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#f7dc6f] hover:shadow-[0_0_30px_rgba(244,208,63,0.4)] transition-all mb-6 group text-lg"
            >
              <Download
                size={22}
                className="group-hover:translate-y-1 transition-transform"
              />
              Descargar Propuesta PDF
            </button>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIncludePoliza(!includePoliza)}
                    className="shrink-0"
                  >
                    {includePoliza ? (
                      <CheckCircle size={18} className="text-[#F4D03F]" />
                    ) : (
                      <Circle size={18} className="text-white/30" />
                    )}
                  </button>
                  <span className={`text-sm ${includePoliza ? "text-white" : "text-white/40"}`}>
                    Mantenimiento Mensual
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="text-white/30 hover:text-[#F4D03F] transition-colors"
                    >
                      <Info size={14} />
                    </button>
                    {showTooltip && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#242424] border border-white/10 rounded-xl p-4 shadow-2xl z-50">
                        <div className="space-y-2 text-[11px] text-white/70 leading-relaxed">
                          <p>
                            <span className="text-[#F4D03F] font-bold">Servidores y Base de Datos:</span>{" "}
                            Costo de alojamiento en la nube (AWS/Google Cloud).
                          </p>
                          <p>
                            <span className="text-[#F4D03F] font-bold">Actualizaciones Obligatorias:</span>{" "}
                            Mantenimiento para que la app siga siendo compatible con las nuevas versiones de iPhone y Android.
                          </p>
                          <p>
                            <span className="text-[#F4D03F] font-bold">Soporte Tecnico:</span>{" "}
                            Asistencia continua para dudas y estabilidad del sistema.
                          </p>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-[#242424]" />
                      </div>
                    )}
                  </div>
                </div>
                <span className={`font-mono font-bold text-sm ${includePoliza ? "text-[#F4D03F]" : "text-white/30"}`}>
                  ${DATA.config.poliza.toLocaleString()}
                </span>
              </div>
              {includePoliza ? (
                <p className="text-[10px] text-white/30 leading-relaxed italic pl-8">
                  Incluye infraestructura en la nube, actualizaciones de seguridad
                  y soporte tecnico.
                </p>
              ) : (
                <p className="text-[10px] text-amber-400/70 leading-relaxed italic pl-8">
                  Los costos de operacion corren por cuenta de La Raclette.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
