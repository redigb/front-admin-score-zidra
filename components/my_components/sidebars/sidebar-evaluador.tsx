"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, FileText, LayoutDashboard, BarChart3, Hammer } from "lucide-react"
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
    const [isMobile, setIsMobile] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
        const checkMobile = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (mobile) setIsCollapsed(true)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!mounted) return null

    const menuItems = [
        { id: "solicitudes", icon: LayoutDashboard, label: "Solicitudes", href: "/evaluador/dashboard" },
        { id: "ingesta", icon: FileText, label: "Solicitudes de crédito", href: "/evaluador/solicitudes" },
        { id: "modelo_actual", icon: BarChart3, label: "ML Actual", href: "/evaluador/modelo" },
        { id: "historial_models", icon: Hammer, label: "Construcion del modelo", href: "/evaluador/construcion_modelo" },
    ]

    const sidebarVariants = {
        desktopOpen: { width: 256, x: 0 },
        desktopClosed: { width: 80, x: 0 },
        mobileOpen: { width: 280, x: 0 },
        mobileClosed: { width: 280, x: "-100%" },
    }

    return (
        <TooltipProvider delayDuration={150}>
            <>
                {/* BACKDROP (Solo Móvil) */}
                <AnimatePresence>
                    {isMobile && !isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCollapsed(true)}
                            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* ASIDE PRINCIPAL */}
                <motion.aside
                    initial={false}
                    animate={
                        isMobile
                            ? (isCollapsed ? "mobileClosed" : "mobileOpen")
                            : (isCollapsed ? "desktopClosed" : "desktopOpen")
                    }
                    variants={sidebarVariants}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                        "flex flex-col bg-neutral-900 text-neutral-100 z-50",
                        "border-r border-neutral-800 shadow-2xl", 
                        // NOTA IMPORTANTE: AQUÍ YA NO HAY 'overflow-hidden'. 
                        // Esto permite que el botón viva "afuera" sin cortarse.
                        
                        // Lógica de posición:
                        isMobile 
                            ? "fixed top-0 bottom-0 left-0 h-[100dvh] rounded-none" 
                            : "relative h-[95vh] my-4 ml-4 rounded-2xl border"
                    )}
                >
                    
                    {/* BOTÓN TOGGLE (Fuera del wrapper de contenido, pero dentro del aside) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center",
                            "bg-neutral-900 border-y border-r border-neutral-800 text-emerald-400",
                            "hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer",
                            // ESTILOS ESPECÍFICOS:
                            isMobile 
                                ? "w-8 h-16 -right-8 rounded-r-xl shadow-[4px_0_15px_rgba(0,0,0,0.5)] border-l-0" // Móvil: Pestaña saliente
                                : "w-10 h-10 -right-5 rounded-full border border-emerald-700 shadow-lg" // Escritorio: Círculo flotante
                        )}
                    >
                        {isCollapsed ? <ChevronRight size={isMobile ? 18 : 16} /> : <ChevronLeft size={isMobile ? 18 : 16} />}
                    </button>

                    {/* WRAPPER INTERNO (Aquí sí aplicamos overflow-hidden para el scroll y textos) */}
                    <div className={cn(
                        "flex flex-col w-full h-full overflow-hidden", 
                        // Heredamos el borde redondeado en escritorio para que el contenido no se salga de las esquinas
                        !isMobile && "rounded-2xl"
                    )}>
                        
                        {/* Header */}
                        <div className="h-16 flex-shrink-0 flex items-center justify-center border-b border-neutral-800 bg-neutral-900">
                            <div className="w-9 h-9 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-inner">
                                <span className="w-3 h-3 bg-white rounded-sm" />
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 py-6 px-3 space-y-3 overflow-y-auto overflow-x-hidden bg-neutral-900">
                            {menuItems.map((item) => {
                                const ItemIcon = item.icon
                                const isActive = pathname === item.href
                                const isDesktopCollapsed = isCollapsed && !isMobile

                                return (
                                    <Tooltip key={item.id}>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={item.href}
                                                onClick={() => isMobile && setIsCollapsed(true)}
                                                className={cn(
                                                    "flex items-center rounded-lg py-3 text-sm font-medium transition-colors min-h-[44px]",
                                                    // Alineación de iconos corregida
                                                    isDesktopCollapsed ? "justify-center px-2" : "justify-start px-4 gap-3",
                                                    isActive ? "bg-emerald-600 text-white" : "text-neutral-300 hover:bg-neutral-800 hover:text-emerald-400"
                                                )}
                                            >
                                                <ItemIcon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-emerald-400")} />
                                                
                                                <motion.span
                                                    animate={{ 
                                                        opacity: isDesktopCollapsed ? 0 : 1,
                                                        width: isDesktopCollapsed ? 0 : "auto",
                                                        display: isDesktopCollapsed ? "none" : "block"
                                                    }}
                                                    className="whitespace-nowrap overflow-hidden"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            </Link>
                                        </TooltipTrigger>
                                        {isDesktopCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                                    </Tooltip>
                                )
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="h-16 flex-shrink-0 flex items-center justify-center border-t border-neutral-800 bg-neutral-900">
                            {(!isCollapsed || isMobile) ? (
                                <span className="text-xs text-neutral-500">Zidra Score ©</span>
                            ) : (
                                <span className="text-xs text-neutral-600 font-bold">Z</span>
                            )}
                        </div>
                    </div>

                </motion.aside>
            </>
        </TooltipProvider>
    )
}