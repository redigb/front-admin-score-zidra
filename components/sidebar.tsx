"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Shield,
  BarChart3,
  History,
  Smartphone,
  Map,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  allowedSections?: string[]
  currentModule?: "evaluacion" | "gps"
}

export function Sidebar({ activeSection, onSectionChange, allowedSections = [], currentModule }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const menuSections = [
    {
      id: "evaluacion",
      label: "Casos de Evaluación",
      icon: FileText,
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "ingesta", icon: FileText, label: "Ingesta & Clasificación" },
        { id: "validacion", icon: Shield, label: "Validación & Pre-score" },
        { id: "evaluacion-ml", icon: BarChart3, label: "Evaluación ML" },
        { id: "riesgo", icon: Shield, label: "Riesgo & ModelOps" },
        { id: "auditoria", icon: History, label: "Auditoría" },
      ],
    },
    {
      id: "iot",
      label: "IoT & GPS",
      icon: MapPin,
      items: [
        { id: "dispositivos", icon: Smartphone, label: "Dispositivos" },
        { id: "mapa-tiempo-real", icon: Map, label: "Mapa en Tiempo Real" },
        { id: "detalle-dispositivo", icon: MapPin, label: "Detalle del Dispositivo" },
      ],
    },
  ]

  const getDirectItems = () => {
    if (currentModule === "gps") {
      return menuSections.find((section) => section.id === "iot")?.items || []
    }
    return []
  }

  const getVisibleSections = () => {
    if (currentModule === "evaluacion") {
      return menuSections.filter((section) => section.id === "evaluacion")
    } else if (currentModule === "gps") {
      return [] // No mostrar secciones anidadas en GPS
    }
    return menuSections
  }

  const visibleSections = getVisibleSections()
  const directItems = getDirectItems()

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionId) ? prevSections.filter((id) => id !== sectionId) : [...prevSections, sectionId],
    )
  }

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          </div>
        </div>

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-gray-500 hover:text-gray-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="px-3 py-2 border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 mx-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}

      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        {directItems.length > 0 ? (
          <div className="px-3 space-y-1">
            {directItems.map((item) => {
              const ItemIcon = item.icon
              const isActive = activeSection === item.id

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "transition-all duration-200 rounded-lg flex items-center gap-3",
                    isCollapsed ? "w-10 h-10 p-0 justify-center" : "w-full h-10 px-3 justify-start",
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      : "text-gray-700 hover:text-gray-900 hover:bg-blue-50",
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <ItemIcon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                </Button>
              )
            })}
          </div>
        ) : (
          visibleSections.map((section) => {
            const SectionIcon = section.icon
            const isExpanded = expandedSections.includes(section.id)

            const filteredItems = section.items.filter(
              (item) => allowedSections.length === 0 || allowedSections.includes(item.id),
            )

            return (
              <div key={section.id} className="px-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "transition-all duration-200 rounded-lg flex items-center gap-3 mb-1",
                    isCollapsed ? "w-10 h-10 p-0 justify-center" : "w-full h-10 px-3 justify-between",
                    "text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium",
                  )}
                  onClick={() => {
                    if (isCollapsed) {
                      setIsCollapsed(false)
                      setExpandedSections([section.id])
                    } else {
                      toggleSection(section.id)
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <SectionIcon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm truncate">{section.label}</span>}
                  </div>
                  {!isCollapsed &&
                    (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                </Button>

                {!isCollapsed && isExpanded && (
                  <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
                    {filteredItems.map((item) => {
                      const ItemIcon = item.icon
                      const isActive = activeSection === item.id

                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full h-9 px-3 justify-start transition-all duration-200 rounded-lg",
                            isActive
                              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
                          )}
                          onClick={() => onSectionChange(item.id)}
                        >
                          <ItemIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span className="text-sm truncate">{item.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "justify-start")}>
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="/user-avatar.png" />
            <AvatarFallback className="bg-gray-200 text-gray-600">U</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Usuario</p>
              <p className="text-xs text-gray-500 truncate">usuario@ejemplo.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
