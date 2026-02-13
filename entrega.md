## 1. Definición y Flujo

```
Actúa como un Senior Product Manager. Quiero desarrollar una aplicación que resuelva el siguiente problema: Muchas personas se les complica hacer pagos de impuestos, les toma mucho tiempo ir al banco o coordinar con su contador para poder resolver estos problemas.. Por favor, genera:

- Un User Flow detallado desde el registro hasta la acción principal.

- Un listado de Funcionalidades Mínimas Viables (MVP) divididas en: Autenticación, Core Business y Perfil.

- Una estructura de datos inicial en formato JSON que represente las entidades principales de la app para poder usarlas como mock data.

- Una lista de 5 rutas (endpoints/páginas) necesarias.
```
## 2. Fase Frontend

```
Construye el frontend de una aplicación de Tax App usando Next.js, Tailwind CSS y componentes de Shadcn UI. Requisitos técnicos:

•	No uses el CDN de Tailwind; implementa los estilos mediante configuración de archivos local.
•	Crea un sistema de Local Data: utiliza archivos JSON locales para emular una base de datos. Toda la lógica de lectura y escritura debe impactar en estos objetos en memoria o localStorage.
•	Implementa un layout moderno y responsive.
•	Incluye un flujo de Login y Registro (mockeado) que proteja las rutas privadas.

Páginas a crear:

•	Onboarding: El usuario descarga la app y ve un splash screen con la propuesta de valor (adiós filas, hola tiempo libre).

•	Registro/Auth: Email, contraseña y validación de identidad (KYC biométrico si es posible, por seguridad financiera).

•	Vinculación Fiscal: El usuario ingresa su Identificación Fiscal (RUC, RFC, NIT, etc.) y las credenciales de la entidad tributaria.

•	Dashboard Principal: La app sincroniza con el gobierno y muestra un resumen: "Tienes $X por pagar este mes".

•	Selección de Impuesto: El usuario toca la deuda pendiente.

•	Método de Pago: Selecciona tarjeta de crédito/débito o billetera digital previamente guardada.

•	Confirmación y Pago: Procesamiento mediante pasarela de pagos.

•	Cierre de Ciclo: Generación de comprobante legal (PDF) y envío automático al contador (vía email/WhatsApp).

Aquí tienes el ejemplo de la estructura de datos que espero:
{
  "user": {
    "id": "u-98765",
    "full_name": "Valeria Jiménez",
    "tax_id": "VJIM880101-ABC",
    "email": "valeria.j@example.com",
    "linked_accounts": [
      {
        "bank": "NeoBank",
        "last_four": "4422",
        "type": "credit"
      }
    ]
  },
  "tax_records": [
    {
      "id": "tax-001",
      "type": "IVA Mensual",
      "period": "Enero 2026",
      "amount": 450.00,
      "currency": "USD",
      "due_date": "2026-02-20",
      "status": "pending"
    },
    {
      "id": "tax-002",
      "type": "Impuesto a la Renta",
      "period": "Anual 2025",
      "amount": 1200.50,
      "currency": "USD",
      "due_date": "2026-03-15",
      "status": "paid",
      "receipt_url": "https://cdn.taxeasy.com/receipts/r-112233.pdf"
    }
  ]
}.
```
