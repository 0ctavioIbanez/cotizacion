"use client"

import { motion } from "framer-motion"
import { Utensils } from "lucide-react"
import { quoteData } from "@/lib/quote-data"

export function QuoteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-lg text-foreground leading-tight">
              {quoteData.cliente}
            </h1>
            <p className="text-xs text-muted-foreground tracking-wide uppercase">
              Ecosistema Digital
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-muted-foreground">Propuesta Tecnológica</p>
          <p className="text-xs text-primary font-medium">2026</p>
        </div>
      </div>
    </motion.header>
  )
}
