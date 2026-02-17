"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { quoteData } from "@/lib/quote-data"

export function LoginGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === quoteData.configuracion_global.password_acceso) {
      onAuthenticated()
    } else {
      setError(true)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 600)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3 text-balance">
            Propuesta Tecnológica
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide uppercase">
            {quoteData.cliente}
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-xl p-8"
        >
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Ingresa la clave de acceso para ver la cotización
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                placeholder="Clave de acceso"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Clave incorrecta. Intenta de nuevo.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Acceder a la Propuesta
            </motion.button>
          </form>
        </motion.div>

        {/* Footer subtle text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-muted-foreground/50 text-xs mt-8"
        >
          Documento confidencial. Uso exclusivo para {quoteData.cliente}.
        </motion.p>
      </motion.div>
    </div>
  )
}
