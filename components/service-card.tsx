"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Smartphone,
  Truck,
  LayoutDashboard,
  Check,
  Lock,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react"
import { useState } from "react"
import type { AdminType } from "@/components/admin-selector"

interface Funcionalidad {
  nombre: string
  tags: readonly string[]
}

interface ServiceCardProps {
  id: string
  nombre: string
  precio: number
  obligatorio: boolean
  descripcion: string
  funcionalidades: readonly Funcionalidad[]
  selected: boolean
  onToggle: () => void
  adminType: AdminType
  index: number
}

function getIcon(id: string) {
  switch (id) {
    case "core":
      return Smartphone
    case "repartidores":
      return Truck
    case "admin":
      return LayoutDashboard
    default:
      return Smartphone
  }
}

function shouldShowFeature(
  tags: readonly string[],
  adminType: AdminType
): boolean {
  if (adminType === "actual") return tags.includes("*")
  if (adminType === "custom") return tags.includes("**")
  // If no admin type selected, show all features
  return true
}

function getTagBadge(
  tags: readonly string[],
  adminType: AdminType
): string | null {
  if (adminType === null) {
    if (tags.includes("*") && tags.includes("**")) return "* / **"
    if (tags.includes("*")) return "*"
    if (tags.includes("**")) return "**"
    return null
  }
  if (adminType === "actual" && tags.includes("*")) return "*"
  if (adminType === "custom" && tags.includes("**")) return "**"
  return null
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function ServiceCard({
  id,
  nombre,
  precio,
  obligatorio,
  descripcion,
  funcionalidades,
  selected,
  onToggle,
  adminType,
  index,
}: ServiceCardProps) {
  const [expanded, setExpanded] = useState(true)
  const Icon = getIcon(id)

  const visibleFeatures = funcionalidades.filter((f) =>
    shouldShowFeature(f.tags, adminType)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        selected
          ? "border-primary/40 bg-card shadow-lg shadow-primary/5"
          : "border-border bg-card/50 opacity-60"
      }`}
    >
      {/* Card header */}
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                selected
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-secondary border border-border"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  selected ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-lg text-foreground leading-snug">
                  {nombre}
                </h3>
                {obligatorio && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                    <Lock className="w-3 h-3" />
                    Obligatorio
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{descripcion}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="font-serif text-xl md:text-2xl text-foreground">
              {formatPrice(precio)}
            </span>
            {!obligatorio && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onToggle}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {selected ? "Incluido" : "Agregar"}
              </motion.button>
            )}
            {obligatorio && (
              <span className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                Incluido
              </span>
            )}
          </div>
        </div>

        {/* Repartidores sync badge */}
        {id === "repartidores" && selected && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10"
          >
            <Info className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              (*) Requiere sincronización con Admin Actual o Admin Web Custom
            </p>
          </motion.div>
        )}
      </div>

      {/* Features list */}
      {selected && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-6 py-2 bg-secondary/30 border-t border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>
              {visibleFeatures.length} funcionalidad
              {visibleFeatures.length !== 1 ? "es" : ""}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <ul className="px-6 py-4 flex flex-col gap-2">
                  {visibleFeatures.map((feat, i) => {
                    const badge = getTagBadge(feat.tags, adminType)
                    return (
                      <motion.li
                        key={feat.nombre}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80">
                          {feat.nombre}
                        </span>
                        {badge && (
                          <span className="text-xs text-primary/70 font-mono ml-auto">
                            ({badge})
                          </span>
                        )}
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}
