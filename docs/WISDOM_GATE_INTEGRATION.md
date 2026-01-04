# Integración con Wisdom Gate API (Gemini Models)

Este documento detalla cómo utilizar los modelos de Gemini a través de la API de **Wisdom Gate** en el proyecto X-Studio. Esta integración es necesaria para funcionalidades de generación de texto e imágenes avanzadas.

## 📋 Configuración Básica

### Endpoint Base
La URL base para todas las llamadas a la API de Wisdom Gate es:
`https://wisdom-gate.juheapi.com`

### Autenticación
Se utiliza una API Key en el header `x-goog-api-key`.
Esta clave debe estar configurada en el archivo `.env.local` (o `.env` en producción).

```env
WISDOM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Nota:** El sistema también soporta `WISDOM_GATE_KEY` como fallback.

---

## 🖼️ Generación de Imágenes (Imagen 3)

Para generar imágenes utilizando el modelo Gemini Imagen 3, se debe realizar una petición `POST` al endpoint de generación.

**Modelo Soportado:** `gemini-3-pro-image-preview`

### Implementación (`src/lib/gemini.ts`)
La función `generateWisdomImage` utiliza el endpoint nativo:
`/v1beta/models/{model}:generateContent`

```typescript
const result = await generateWisdomImage(parts, "gemini-3-pro-image-preview", "16:9");
```

---

## 📝 Generación de Texto y Multimodal

La generación de texto ha sido unificada para usar también el **formato nativo de Gemini** (anteriormente OpenAI-compatible).

**Endpoints:** `/v1beta/models/{model}:generateContent`

**Modelos:**
- **Primario:** `gemini-3-pro-preview` (o `gemini-3-pro`)
- **Fallback:** `gemini-2.5-flash`

### Estrategia de Fallback
Debido a posibles inestabilidades ("System busy" o "Channel failed") con los modelos más nuevos en Wisdom Gate:
1. El sistema intenta usar el modelo solicitado (ej. `gemini-3-pro`).
2. Implementa **Exponential Backoff** (1s, 2s, 4s) para errores de "busy".
3. Si falla persistentemente o el canal no responde, **se reintenta automáticamente con `gemini-2.5-flash`**, que es más estable.

### Implementación (`src/lib/gemini.ts`)
La función `generateWisdomText` maneja esta lógica transparente para el consumidor.

```typescript
const text = await generateWisdomText("Prompt...", "gemini-3-pro");
// Si gemini-3 falla, retornará resultado de gemini-2.5-flash automágicamente.
```

---

## ⚠️ Solución de Problemas Comunes

1.  **Error "System busy" / "get_channel_failed"**:
    *   Indica sobrecarga en el proveedor o problemas de mapeo de canales.
    *   **Solución:** El sistema ya maneja esto internamente haciendo fallback a `gemini-2.5-flash`.

2.  **Error 401 Unauthorized**:
    *   Verifica que `WISDOM_API_KEY` esté correcta en `.env.local`.

3.  **Error 404 Not Found**:
    *   Verifica que la URL base está correcta (`https://wisdom-gate.juheapi.com`) y el endpoint incluye `/v1beta/models/...`.

---

## 🧪 Scripts de Prueba

Existen scripts independientes para validar la conexión y generación:

```bash
# Prueba de Imágenes
npx tsx scripts/test-wisdom-api.ts

# Prueba de Texto (validación de endpoint nativo y fallback)
npx tsx scripts/test-wisdom-text.ts
```
