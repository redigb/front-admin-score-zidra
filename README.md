# 🌐 ZidraScore & IoT Platform

**Plataforma Inteligente de Monitoreo y Análisis.**

Solución integral que combina la evaluación avanzada de riesgo crediticio con el
rastreo IoT & GPS en tiempo real para artefactos. Garantizamos un control seguro,
preciso y centralizado de los activos.

---

## 🚀 Conceptos del Panel Admin

### 1. ZidraScore (Scoring de Riesgo)
Motor analítico diseñado para evaluar y predecir el comportamiento
de riesgo crediticio. Procesa datos para ofrecer una calificación 
precisa que respalda la toma de decisiones financieras y operativas.

### 2. Plataforma Inteligente (IoT & GPS)
Sistema de telemetría en tiempo real para la gestión y seguridad
de artefactos vinculados. Permite la supervisión remota, alertas
de estado y recuperación de activos mediante tecnología GPS.

---

## 💻 Vistas y Funcionalidades del Sistema

La plataforma cuenta con una interfaz moderna **"Blue Tech"**,
optimizada para alta densidad de datos y experiencia de usuario (UX) fluida.

### 🔹 Panel de Control de Flota (Dashboard)
Centro de administración de hardware GPS.
* **Estado en Tiempo Real:** Visualización inmediata de conectividad (Online/Offline), nivel de batería y calidad de señal mediante indicadores visuales.
* **Gestión de Ciclo de Vida:** Registro, edición y eliminación segura de dispositivos con validaciones y alertas de confirmación.
* **Búsqueda Inteligente:** Filtrado rápido por IMEI, Modelo o Estado.

### 🔹 Centro de Monitoreo Geoespacial (Mapa)
Interfaz inmersiva para el rastreo de activos.
* **Telemetría en Vivo (WebSockets):** Actualización de ubicación y sensores sin recargas de página.
* **HUD Flotante (Glassmorphism):** Panel de control superpuesto que muestra datos críticos (velocidad, voltaje, operador) sobre el mapa sin obstruir la visión.
* **Visualización de Ruta:** Marcadores dinámicos sobre cartografía vectorial de alta precisión.

### 🔹 Gestión de Vínculos (Artefactos)
Módulo lógico que conecta el mundo físico con el financiero.
* **Asignación Dinámica:** Vinculación entre un Dispositivo GPS y un Artefacto (activo financiado/garantía).
* **Historial de Trazabilidad:** Diferenciación visual clara entre vínculos **ACTIVOS** (en monitoreo) y vínculos **FINALIZADOS** (historial), permitiendo auditoría completa del activo.

---

## 🛠️ Stack Tecnológico

Arquitectura moderna, escalable y de alto rendimiento:

* **Frontend:** [Next.js 15](https://nextjs.org/) (App Router)
* **Lenguaje:** TypeScript
* **UI & Estilos:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
* **Mapas:** [React Leaflet](https://react-leaflet.js.org/)
* **Comunicación:** WebSockets (Tiempo real) & REST API
* **Estado:** Zustand & TanStack Query
* **Animaciones:** Framer Motion

---

## 📦 Despliegue Local

1.  **Clonar el repositorio:**

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar entorno:**
    Crea un archivo `.env.local` con las credenciales de API y Mapas.

4.  **Iniciar servidor:**
    ```bash
    npm run dev
    ```
---