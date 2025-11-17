# Documentación de Logs - Generador de Propuestas Odoo

## Descripción General

Se han agregado logs detallados en todo el flujo de parseo y procesamiento de cotizaciones para facilitar el debugging y rastrear el origen de cada valor mostrado en las propuestas generadas.

## Ubicación de los Logs

Los logs están implementados en tres niveles principales:

### 1. API Route (`src/app/api/fetch-quotation/route.ts`)

**Logs de entrada:**
- `[API] Solicitud recibida con URLs:` - Muestra las URLs enviadas en la solicitud
- `[API] URLs validadas:` - Muestra las URLs después de la validación con Zod

**Logs de procesamiento:**
- `[fetchQuotation] Iniciando fetch para URL {index}:` - Al iniciar el fetch de cada URL
- `[fetchQuotation] HTML recibido para URL {index}. Longitud:` - Confirma la recepción del HTML
- `[fetchQuotation] Cotización parseada para URL {index}:` - Muestra el resultado completo del parseo en formato JSON

**Logs de resultado:**
- `[API] Todas las cotizaciones procesadas exitosamente. Total:` - Cuando todas las cotizaciones se procesan correctamente

**Logs de error:**
- `[fetchQuotation] Error en respuesta para URL {index}. Status:` - Si hay error en el fetch
- `[API] Error al procesar cotizaciones:` - Error general en el endpoint

### 2. Parser de Odoo (`src/lib/parsers/odoo-parser.ts`)

**Logs de inicio:**
- `[Parser] Iniciando parseo de cotización {index}` - Al comenzar el parseo
- `[Parser] Tabla de suscripción encontrada:` - Si se encontró la tabla de información

**Logs de campos extraídos:**
- `[Parser] Plan encontrado:` - Valor del campo Plan
- `[Parser] Nombre de orden encontrado:` - Valor del campo Order
- `[Parser] Fecha de orden encontrada:` - Valor del campo Date
- `[Parser] Fecha de expiración encontrada:` - Valor del campo Expiration
- `[Parser] Referencia encontrada:` - Valor del campo Reference

**Logs de montos:**
- `[Parser] Total span encontrado:` - Si se encontró el elemento del total
- `[Parser] Información monetaria total:` - Objeto con text, value y symbol del total
- `[Parser] Símbolo de moneda a usar:` - Símbolo de moneda final (con fallback a €)

**Logs de líneas de producto:**
- `[Parser] Líneas de producto encontradas:` - Cantidad de líneas encontradas
- `[Parser] Línea {n}:` - Detalle de cada línea (nombre, cantidad, precio unitario, monto, moneda)
- `[Parser] Líneas positivas: X, Líneas de descuento: Y` - Distribución de líneas

**Logs de cálculos:**
- `[Parser] Línea principal seleccionada:` - Qué línea se usó como principal
- `[Parser] Ahorros totales calculados:` - Valor numérico de los ahorros
- `[Parser] Texto de ahorros totales:` - Formato de texto de los ahorros
- `[Parser] Términos de pago encontrados:` - Texto de términos de pago
- `[Parser] Duración derivada:` - Duración calculada del plan

**Logs de resultado:**
- `[Parser] Resultado final de parseo para cotización {index}:` - Resumen del resultado (título, subtítulo, monto total, producto, cantidad de líneas)

### 3. Errores Traducidos

Todos los mensajes de error ahora están en español:
- `"La URL no coincide con el patrón esperado de Odoo."`
- `"La solicitud a Odoo devolvió el estado {status}."`
- `"No se encontraron líneas de productos para esta cotización."`
- `"Hubo un problema al procesar las cotizaciones en el servidor."`

## Cómo Usar los Logs

### Para Debugging en Desarrollo

1. **Abrir la consola del navegador** (F12 o Cmd+Option+I)
2. **Ir a la pestaña Console**
3. **Generar una propuesta** con las URLs de cotización
4. **Observar el flujo completo** de logs desde la API hasta el resultado final

### Para Rastrear un Valor Específico

Si necesitas saber de dónde viene un valor específico, busca en los logs:

**Ejemplo: Rastrear el precio total**
```
[Parser] Información monetaria total: {
  text: "1,234.56 €",
  value: 1234.56,
  symbol: "€"
}
```

**Ejemplo: Rastrear descuentos**
```
[Parser] Líneas positivas: 2, Líneas de descuento: 1
[Parser] Ahorros totales calculados: 150.50
[Parser] Texto de ahorros totales: 150,50 €
```

**Ejemplo: Rastrear producto principal**
```
[Parser] Línea 1: {
  nombre: "Odoo Enterprise - 1 año",
  cantidad: "10,00 Usuarios",
  precioUnitario: "123,45 €",
  monto: "1.234,50 €",
  moneda: "€"
}
[Parser] Línea principal seleccionada: Odoo Enterprise - 1 año
```

### Filtrar Logs por Categoría

En la consola del navegador, puedes filtrar por prefijo:
- `[API]` - Para ver solo logs del endpoint
- `[fetchQuotation]` - Para ver el proceso de fetch
- `[Parser]` - Para ver el proceso de parseo

## Recomendaciones

1. **En producción**: Considera usar una librería de logging como `winston` o `pino` para tener mejor control sobre qué logs se muestran según el entorno.

2. **Para debugging específico**: Puedes agregar `console.group()` y `console.groupEnd()` para agrupar logs relacionados.

3. **Para análisis**: Los logs en formato JSON (`JSON.stringify(result, null, 2)`) facilitan copiar y analizar los datos en herramientas externas.

## Ejemplos de Flujo Completo

```
[API] Solicitud recibida con URLs: ["https://www.odoo.com/my/orders/123..."]
[API] URLs validadas: ["https://www.odoo.com/my/orders/123..."]
[fetchQuotation] Iniciando fetch para URL 1: https://www.odoo.com/my/orders/123...
[fetchQuotation] HTML recibido para URL 1. Longitud: 45678
[Parser] Iniciando parseo de cotización 1
[Parser] Tabla de suscripción encontrada: true
[Parser] Plan encontrado: Enterprise 1 año
[Parser] Nombre de orden encontrado: S123456
... (más logs detallados)
[Parser] Resultado final de parseo para cotización 1: {...}
[fetchQuotation] Cotización parseada para URL 1: {...}
[API] Todas las cotizaciones procesadas exitosamente. Total: 1
```

## Cambios Realizados

### Archivos Modificados

1. **src/app/api/fetch-quotation/route.ts**
   - Logs de entrada, procesamiento y errores
   - Mensajes de error en español

2. **src/lib/parsers/odoo-parser.ts**
   - Logs detallados de cada etapa del parseo
   - Logs de campos individuales y cálculos
   - Logs de resultado final con resumen

3. **src/lib/validators/url-validator.ts**
   - Mensaje de error en español

## Interfaz en Español

Todos los textos de la interfaz ahora están en español, incluyendo:
- Títulos y descripciones
- Etiquetas de formularios
- Mensajes de estado
- Botones y acciones
- Plantillas de email
- Metadatos de la página

