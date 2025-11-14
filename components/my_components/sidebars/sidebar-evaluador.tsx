"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Smartphone, Map, MapPin, ChevronLeft, ChevronRight, FileText, LayoutDashboard, Shield, BarChart3, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
export function SidebarEvaluador() {
    const [isCollapsed, setIsCollapsed] = useState(true)
    const pathname = usePathname()

    const menuItems = [
        { id: "solicitudes", icon: LayoutDashboard, label: "Solicitudes", href: "/evaluador/dashboard" },
        { id: "ingesta", icon: FileText, label: "Ingesta & Clasificación", href: "/evaluador/solicitudes" },
        { id: "validacion", icon: Shield, label: "Validación & Pre-score", href: "/evaluador/" },
        { id: "evaluacion-ml", icon: BarChart3, label: "Evaluación ML", href: "/evaluador/" },
        { id: "riesgo", icon: Shield, label: "Riesgo & ModelOps", href: "/evaluador/" },
        { id: "auditoria", icon: History, label: "Auditoría", href: "/evaluador/" },
    ]


    return (
        <TooltipProvider delayDuration={150}>
            <div className="relative">
                {/* Sidebar */}
                <motion.aside
                    initial={{ width: isCollapsed ? 80 : 256 }}   // 👈 ahora arranca según el estado real
                    animate={{ width: isCollapsed ? 80 : 256 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={cn(
                        "relative h-[95vh] my-4 ml-4 flex flex-col bg-neutral-900 text-neutral-200",
                        "border border-neutral-800 shadow-2xl rounded-2xl overflow-hidden"
                    )}
                >
                    {/* Header */}
                    <div className="h-16 flex items-center justify-center border-b border-neutral-800">
                        <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-sm" />
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 py-6 px-3 space-y-3">
                        {menuItems.map((item) => {
                            const ItemIcon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Tooltip key={item.id}>
                                    <TooltipTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                                    isCollapsed ? "justify-center" : "justify-start",
                                                    isActive
                                                        ? "bg-blue-600 text-white"
                                                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                                )}
                                            >
                                                <ItemIcon className="w-5 h-5 flex-shrink-0" />
                                                <AnimatePresence>
                                                    {!isCollapsed && (
                                                        <motion.span
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {item.label}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </Link>
                                        </motion.div>
                                    </TooltipTrigger>
                                    {isCollapsed && (
                                        <TooltipContent side="right">{item.label}</TooltipContent>
                                    )}
                                </Tooltip>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="h-16 flex items-center justify-center border-t border-neutral-800">
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-xs text-neutral-500"
                                >
                                    © RenzoRd 2025
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.aside>

                {/* Botón toggle fuera del aside */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-1/2 -right-6 -translate-y-1/2 
            w-12 h-12 rounded-full flex items-center justify-center 
            shadow-lg border border-neutral-700 
            bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </motion.button>
            </div>
        </TooltipProvider>
    )
}
