"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { quoteData } from "@/lib/quote-data"
import { QuoteHeader } from "@/components/quote-header"
import { ServiceCard } from "@/components/service-card"
import { AdminSelector, type AdminType } from "@/components/admin-selector"
import { PriceSummary } from "@/components/price-summary"
import { QuoteFooter } from "@/components/quote-footer"

export function QuoteBuilder() {
  // Core is always selected (mandatory)
  const [selectedIds, setSelectedIds] = useState<string[]>(["core"])
  const [adminType, setAdminType] = useState<AdminType>(null)

  const hasAdmin = selectedIds.includes("admin")

  // Check if all 3 main modules are selected for integration bonus
  const hasIntegrationBonus = useMemo(() => {
    return (
      selectedIds.includes("core") &&
      selectedIds.includes("repartidores") &&
      selectedIds.includes("admin")
    )
  }, [selectedIds])

  const toggleService = (id: string) => {
    if (id === "core") return // Cannot unselect core

    setSelectedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]

      // If admin is being deselected, reset adminType
      if (id === "admin" && prev.includes(id)) {
        setAdminType(null)
      }

      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <QuoteHeader />

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-xs text-primary tracking-widest uppercase mb-4">
            Propuesta Tecnológica
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
            Ecosistema Digital
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Selecciona los módulos que necesitas para construir tu plataforma
            ideal. El precio se actualiza en tiempo real.
          </p>
        </motion.div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Service cards */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Admin type selector - shown at the top when admin is selected */}
            {hasAdmin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/20 bg-card p-5 md:p-6"
              >
                <p className="text-sm font-medium text-foreground mb-1">
                  Tipo de Panel Administrador
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Selecciona cómo deseas gestionar tu negocio. Las funcionalidades
                  visibles se filtrarán según tu elección.
                </p>
                <AdminSelector
                  value={adminType}
                  onChange={setAdminType}
                  hasAdmin={hasAdmin}
                />
              </motion.div>
            )}

            {quoteData.servicios.map((servicio, index) => (
              <ServiceCard
                key={servicio.id}
                id={servicio.id}
                nombre={servicio.nombre}
                precio={servicio.precio}
                obligatorio={servicio.obligatorio}
                descripcion={servicio.descripcion}
                funcionalidades={servicio.funcionalidades}
                selected={selectedIds.includes(servicio.id)}
                onToggle={() => toggleService(servicio.id)}
                adminType={adminType}
                index={index}
              />
            ))}
          </div>

          {/* Right: Sticky price summary */}
          <div className="lg:w-96">
            <div className="lg:sticky lg:top-24">
              <PriceSummary
                selectedIds={selectedIds}
                hasIntegrationBonus={hasIntegrationBonus}
              />

              {/* Tag legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 p-4 rounded-xl border border-border bg-card/50"
              >
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  Leyenda de etiquetas
                </p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary/70 w-8">
                      (*)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Disponible con Admin Actual
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary/70 w-8">
                      (**)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Disponible con Admin Web Custom
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <QuoteFooter />
    </div>
  )
}
