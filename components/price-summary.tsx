"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Receipt, Sparkles, TrendingDown } from "lucide-react"
import { quoteData } from "@/lib/quote-data"

interface PriceSummaryProps {
  selectedIds: string[]
  hasIntegrationBonus: boolean
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function PriceSummary({
  selectedIds,
  hasIntegrationBonus,
}: PriceSummaryProps) {
  const selectedServices = quoteData.servicios.filter((s) =>
    selectedIds.includes(s.id)
  )

  const subtotal = selectedServices.reduce((sum, s) => sum + s.precio, 0)
  const bonus = hasIntegrationBonus
    ? quoteData.configuracion_global.bono_integracion
    : 0
  const total = subtotal + bonus

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-5 md:p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <Receipt className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-lg text-foreground">
            Resumen de Inversión
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Propuesta para {quoteData.cliente}
        </p>
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-3">
        {selectedServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            layout
            className="flex items-center justify-between"
          >
            <span className="text-sm text-foreground/80 truncate pr-4">
              {service.nombre.length > 35
                ? service.nombre.slice(0, 35) + "..."
                : service.nombre}
            </span>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {formatPrice(service.precio)}
            </span>
          </motion.div>
        ))}

        <AnimatePresence>
          {hasIntegrationBonus && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between pt-2 border-t border-border/50"
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">
                  Bono de Integración
                </span>
              </div>
              <span className="text-sm font-bold text-green-400">
                {formatPrice(bonus)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-border pt-4 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal Estimado</span>
            <span className="text-sm text-muted-foreground">
              {formatPrice(subtotal)}
            </span>
          </div>
          {hasIntegrationBonus && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Descuento</span>
              <span className="text-sm text-green-400">
                {formatPrice(bonus)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="font-medium text-foreground">Total Estimado</span>
            <motion.span
              key={total}
              initial={{ scale: 1.2, color: "#F4D03F" }}
              animate={{ scale: 1, color: "#FDFEFE" }}
              transition={{ duration: 0.5 }}
              className="font-serif text-2xl text-foreground"
            >
              {formatPrice(total)}
            </motion.span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hasIntegrationBonus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 md:mx-6 mb-5 md:mb-6 px-4 py-3 rounded-lg bg-primary/5 border border-primary/10"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-primary">
                  Paquete Integral Activado
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Al seleccionar los 3 módulos principales, se aplica el bono de
                  integración tecnológica de{" "}
                  {formatPrice(
                    Math.abs(quoteData.configuracion_global.bono_integracion)
                  )}
                  .
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly maintenance */}
      <div className="px-5 md:px-6 py-4 bg-secondary/30 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Póliza de Mantenimiento Mensual
            </p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Incluye servidores e infraestructura
            </p>
          </div>
          <span className="text-sm font-medium text-foreground">
            {formatPrice(quoteData.configuracion_global.poliza_mensual)}/mes
          </span>
        </div>
      </div>
    </div>
  )
}
