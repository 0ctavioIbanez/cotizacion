"use client"

import { motion } from "framer-motion"
import { Shield, Headphones, Server } from "lucide-react"
import { quoteData } from "@/lib/quote-data"

const footerItems = [
  {
    icon: Shield,
    title: "Garantía de Código",
    description: quoteData.notas_pie.garantia,
  },
  {
    icon: Headphones,
    title: "Soporte Post-Venta",
    description: quoteData.notas_pie.soporte,
  },
  {
    icon: Server,
    title: "Infraestructura",
    description: quoteData.notas_pie.infraestructura,
  },
]

export function QuoteFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="border-t border-border bg-card/30"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h3 className="font-serif text-xl text-foreground mb-8 text-center">
          Condiciones y Soporte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {footerItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-secondary/30 border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground/50">
            Documento generado exclusivamente para {quoteData.cliente}. Todos
            los precios están expresados en {quoteData.configuracion_global.moneda}{" "}
            y no incluyen IVA.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
