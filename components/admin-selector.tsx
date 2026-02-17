"use client"

import { motion } from "framer-motion"
import { Monitor, Globe } from "lucide-react"

export type AdminType = "actual" | "custom" | null

interface AdminSelectorProps {
  value: AdminType
  onChange: (value: AdminType) => void
  hasAdmin: boolean
}

export function AdminSelector({ value, onChange, hasAdmin }: AdminSelectorProps) {
  if (!hasAdmin) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border"
    >
      <p className="text-sm text-muted-foreground mb-3">
        Selecciona el tipo de panel administrador:
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => onChange(value === "actual" ? null : "actual")}
          className={`flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all ${
            value === "actual"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/50"
          }`}
        >
          <Monitor className={`w-5 h-5 ${value === "actual" ? "text-primary" : ""}`} />
          <div className="text-left">
            <p className="text-sm font-medium">Admin Actual</p>
            <p className="text-xs text-muted-foreground">
              Funcionalidades marcadas con (*)
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange(value === "custom" ? null : "custom")}
          className={`flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all ${
            value === "custom"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/50"
          }`}
        >
          <Globe className={`w-5 h-5 ${value === "custom" ? "text-primary" : ""}`} />
          <div className="text-left">
            <p className="text-sm font-medium">Admin Web Custom</p>
            <p className="text-xs text-muted-foreground">
              Funcionalidades marcadas con (**)
            </p>
          </div>
        </button>
      </div>
    </motion.div>
  )
}
