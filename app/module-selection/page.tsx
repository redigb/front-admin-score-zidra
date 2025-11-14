"use client"
//server
import { useRouter } from "next/navigation"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity } from "lucide-react"



export default function ModuleSelection() {
    
    const router = useRouter();

    const handleModuleSelection = (module: "evaluacion" | "gps") => {
        if (module === "evaluacion") {
            router.replace("/evaluador/solicitudes");
        } else {
            router.replace("/iotigps/dashboard");
        }
    }

    //const clear = useAuthStore((s) => s.clear);
    const onLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        //clear(); // solo UI
        router.replace("/login");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-12 animate-fade-in">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg animate-float">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="text-center mb-12 animate-slide-up animation-delay-300">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Hola 👋</h1>
                    <p className="text-gray-600 text-lg">Elige el módulo que te gustaría usar.</p>
                </div>

                <div className="space-y-4 mb-12">
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-blue-300 group animate-slide-up animation-delay-500"
                        onClick={() => handleModuleSelection("evaluacion")}
                    >
                        <CardHeader className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-gray-900 mb-1">Casos de Evaluación</CardTitle>
                                    <CardDescription className="text-gray-500">Análisis crediticio y ML</CardDescription>
                                </div>
                                <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </CardHeader>
                    </Card>
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-blue-300 group animate-slide-up animation-delay-700"
                        onClick={() => handleModuleSelection("gps")}
                    >
                        <CardHeader className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-gray-900 mb-1">IoT & GPS</CardTitle>
                                    <CardDescription className="text-gray-500">Monitoreo en tiempo real</CardDescription>
                                </div>
                                <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <div className="text-center mb-8 animate-fade-in animation-delay-900">
                    <Button variant="ghost" onClick={onLogout} className="text-gray-600 hover:text-gray-900 px-4 py-2">
                        Cerrar sesión
                    </Button>
                </div>

                <footer className="text-center text-gray-400 text-sm animate-fade-in animation-delay-1100">
                    © RenzoRd_dev 2025
                </footer>
            </div>
        </div>
    )
}
