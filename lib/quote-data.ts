export const quoteData = {
  cliente: "Raclette México",
  configuracion_global: {
    moneda: "MXN",
    password_acceso: "LaRaclette",
    poliza_mensual: 6500,
    bono_integracion: -15000,
  },
  servicios: [
    {
      id: "core",
      nombre: "Aplicación Móvil para Clientes (iOS y Android)",
      precio: 115000,
      obligatorio: true,
      descripcion:
        "El núcleo del proyecto. Indispensable para cualquier escenario.",
      funcionalidades: [
        { nombre: "Menú Digital e Infraestructura Base", tags: ["*", "**"] },
        {
          nombre: "Personalización Avanzada de Platillos",
          tags: ["*", "**"],
        },
        { nombre: "Selector de Sucursal Inteligente", tags: ["*", "**"] },
        { nombre: "Billetera y Pagos Seguros", tags: ["*", "**"] },
        { nombre: "Seguimiento en Tiempo Real", tags: ["*"] },
      ],
    },
    {
      id: "repartidores",
      nombre: "Aplicación para Repartidores (Logística Propia)",
      precio: 45000,
      obligatorio: false,
      descripcion:
        "Módulo opcional para gestión de equipo de entregas propio.",
      funcionalidades: [
        { nombre: "Gestión de Pedidos", tags: ["*"] },
        { nombre: "Monitoreo GPS en tiempo real", tags: ["*"] },
        { nombre: "Historial y Liquidación", tags: ["**"] },
      ],
    },
    {
      id: "admin",
      nombre: "Panel Administrador Web (Gestión y Control)",
      precio: 85000,
      obligatorio: false,
      descripcion:
        "El cerebro del negocio para control total de la operación.",
      funcionalidades: [
        { nombre: "Tablero de Analíticas y Reportes", tags: ["**"] },
        {
          nombre: "Gestión de Sucursales e Inventario",
          tags: ["*", "**"],
        },
        {
          nombre: "Base de Datos de Clientes (Marketing)",
          tags: ["*", "**"],
        },
        { nombre: "Editor de Contenido CMS", tags: ["**"] },
        { nombre: "Módulo de Gestión de Catering", tags: ["**"] },
      ],
    },
  ],
  notas_pie: {
    garantia: "90 días naturales contra errores de código.",
    soporte: "1 mes de acompañamiento y capacitación gratuita.",
    infraestructura:
      "El costo del servidor está incluido en la póliza de mantenimiento mensual.",
  },
} as const

export type Servicio = (typeof quoteData.servicios)[number]
export type Funcionalidad = Servicio["funcionalidades"][number]
