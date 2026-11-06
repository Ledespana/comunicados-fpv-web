# Comunicados FPV con Claude (web + conector)

Conector MCP para que **el Claude de cada piloto** (su plan Pro/Max) prepare la comunicación previa de vuelo de dron
al Ministerio del Interior (`drones.ses.mir.es`) con **Claude in Chrome**. El piloto solo revisa el resumen, dice
**"firma"** y acepta en AutoFirma.

- La IA la paga la suscripción de cada piloto. El servidor es una función de Netlify (plan gratuito).
- **Sin configuración ni datos personales:** no hay perfil, Proyecto ni skill. Los datos del piloto ya están en su
  cuenta de la sede de Interior (operador precargado con el certificado, "Mis pilotos", comunicaciones anteriores que
  se clonan); lo que falte la primera vez, Claude lo pregunta en el chat.
- Funciona igual en Mac y Windows: todo ocurre en Chrome.

> ⚠️ Proyecto personal, sin relación con el Ministerio del Interior, AESA ni ENAIRE. El piloto es responsable de lo
> que presenta y de cumplir la normativa (Reglamento UE 2019/947, RD 517/2024). Revisa siempre el resumen antes de firmar.

## Herramientas del conector (`/mcp`)
| Herramienta | Qué hace |
|---|---|
| `instrucciones_comunicado` | Recetas actualizadas del formulario de Interior (`src/recetas.md`) |
| `crear_zona(lat, lon, radio_m)` | Zona circular en el formato del formulario (`src/zona.ts`) |
| `comprobar_plazo(fecha)` | ≥ 5 días naturales, hora de España (`src/plazo.ts`) |

Las tres son de solo lectura. Las instrucciones del servidor le dicen a Claude que llame a `instrucciones_comunicado`
antes de nada, así que no hace falta skill.

## Instalación para un piloto (2 pasos)
Requisitos: Chrome, certificado FNMT y AutoFirma; plan de Claude de pago.
1. **Claude in Chrome:** instala la extensión "Claude" (Anthropic) en Chrome e inicia sesión con tu cuenta de Claude.
2. **Conector:** app de Claude → Configuración → Personalizar → Conectores → *+ Añadir* → *Añadir conector
   personalizado* (sin inicio de sesión) → URL `https://comunicados-fpv.netlify.app/mcp` → *Conectar*.

Uso: *"quiero volar el 20 en Genalguacil"*. La primera vez Claude pide permiso para el conector (*Permitir siempre*)
y, si no hay comunicaciones anteriores en la sede, el teléfono, el dron y los números de AESA.

## Desarrollo
```bash
nvm use            # Node 22
npm install
npm test           # tests del conector (initialize, tools, zona, plazo)
npx netlify-cli dev   # http://localhost:8888/mcp
```
Las recetas se editan en `src/recetas.md`; `npm run build` las empaqueta en `src/textos.gen.ts` (Netlify lo hace
solo al desplegar).

Todo lo que ve el piloto (web, skill, recetas, mensajes de error) va en **español** y en lenguaje para gente no
técnica: nada de "MCP" o "YAML" en la portada ni en lo que Claude le dice.
`docs/propuesta.html` es la propuesta interna con los diagramas (no se publica).

## Licencia
MIT
