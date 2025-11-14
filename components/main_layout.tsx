"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { LoginForm } from "./login-form"
import { ModuleSelection } from "./module-selection"
import { EvaluacionDashboard } from "./evaluacion-dashboard"
import { IngestaClasificacion } from "./ingesta-clasificacion"
import { ValidacionPrescore } from "./validacion-prescore"
import { EvaluacionML } from "./evaluacion-ml"
import { RiesgoModelOps } from "./riesgo-modelops"
import { Auditoria } from "./auditoria"
import { Button } from "@/components/ui/button"
import { Settings, Github, ArrowLeft } from "lucide-react"
import { DispositivosTabla } from "./dispositivos-tabla"
import { MapaTiempoReal } from "./mapa-tiempo-real"
import { DetalleDispositivo } from "./detalle-dispositivo"
import { LocationsDashboard } from "./my_components/location-dashboard"

type AppState = "login" | "module-selection" | "evaluacion" | "gps"

export function MainLayout() {
    const [appState, setAppState] = useState<AppState>("login")
    const [activeSection, setActiveSection] = useState("dashboard")

    const handleLogin = (credentials: { email: string; password: string }) => {
        // Simular validación de login
        console.log("[v0] Login attempt:", credentials.email)
        setAppState("module-selection")
    }

    const handleModuleSelection = (module: "evaluacion" | "gps") => {
        console.log("[v0] Module selected:", module)
        setAppState(module)
        // Establecer sección por defecto según el módulo
        if (module === "evaluacion") {
            setActiveSection("dashboard")
        } else {
            setActiveSection("dispositivos")
        }
    }

    const handleLogout = () => {
        console.log("[v0] User logged out")
        setAppState("login")
        setActiveSection("dashboard")
    }

    const handleBackToSelection = () => {
        setAppState("module-selection")
    }

    if (appState === "login") {
        return <LoginForm onLogin={handleLogin} />
    }

    if (appState === "module-selection") {
        return <ModuleSelection onSelectModule={handleModuleSelection} onLogout={handleLogout} />
    }

    // Layout completo con sidebar solo para módulos específicos
    const getFilteredSections = () => {
        if (appState === "evaluacion") {
            return ["dashboard", "ingesta", "validacion", "evaluacion-ml", "riesgo", "auditoria"]
        } else if (appState === "gps") {
            return ["dispositivos", "mapa-tiempo-real", "detalle-dispositivo"]
        }
        return []
    }

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <EvaluacionDashboard />
            case "ingesta":
                return <IngestaClasificacion />
            case "validacion":
                return <ValidacionPrescore />
            case "evaluacion-ml":
                return <EvaluacionML />
            case "riesgo":
                return <RiesgoModelOps />
            case "auditoria":
                return <Auditoria />
            case "dispositivos":
                return <DispositivosTabla />
            case "mapa-tiempo-real":
                return <LocationsDashboard /> ///<MapaTiempoReal />
            case "detalle-dispositivo":
                return <DetalleDispositivo />
            default:
                return (
                    <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="text-center">
                            <h2 className="text-4xl font-light text-gray-400">In progress</h2>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                allowedSections={getFilteredSections()}
                currentModule={appState}
            />

            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white flex items-center justify-between px-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToSelection}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Cambiar módulo
                    </Button>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full bg-gray-100 hover:bg-gray-200">
                            <Settings className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full bg-black hover:bg-gray-800">
                            <Github className="w-4 h-4 text-white" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden">{renderContent()}</main>
            </div>
        </div>
    )
}
