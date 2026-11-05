# Comunicados FPV con Claude (web + conector)

Conector MCP para que **el Claude de cada piloto** (su plan Pro/Max) prepare la comunicación previa de vuelo de dron
al Ministerio del Interior (`drones.ses.mir.es`) con **Claude in Chrome**. El piloto solo revisa el resumen, dice
**"firma"** y acepta en AutoFirma.

- La IA la paga la suscripción de cada piloto. El servidor es una función de Netlify (plan gratuito).
- **Fase 1: el conector no guarda datos personales.** El perfil del piloto vive en su Proyecto de claude.ai.
- Funciona igual en Mac y Windows: todo ocurre en Chrome.

> ⚠️ Proyecto personal, sin relación con el Ministerio del Interior, AESA ni ENAIRE. El piloto es responsable de lo
> que presenta y de cumplir la normativa (Reglamento UE 2019/947, RD 517/2024). Revisa siempre el resumen antes de firmar.

## Herramientas del conector (`/mcp`)
| Herramienta | Qué hace |
|---|---|
| `instrucciones_comunicado` | Recetas actualizadas del formulario de Interior (`src/recetas.md`) |
| `plantilla_perfil` | Plantilla `perfil.yaml` (`proyecto/perfil.ejemplo.yaml`) |
| `crear_zona(lat, lon, radio_m)` | Zona circular en el formato del formulario (`src/zona.ts`) |
| `comprobar_plazo(fecha)` | ≥ 5 días naturales, hora de España (`src/plazo.ts`) |

## Instalación para un piloto
Requisitos: Chrome, certificado FNMT y AutoFirma instalados; plan de Claude con conectores personalizados.
1. **Claude in Chrome:** instala la extensión "Claude" (Anthropic) en Chrome e inicia sesión con tu cuenta de Claude.
2. **Conector:** claude.ai → Configuración → Conectores → *Añadir conector personalizado* → URL
   `https://<sitio>.netlify.app/mcp`.
3. **Skill:** descarga `https://<sitio>.netlify.app/descargas/comunicado-vuelo.zip` (se genera al desplegar) y súbela en claude.ai → Configuración → Capacidades → Skills.
4. **Proyecto:** crea un Proyecto "Comunicados FPV" y sube tu `perfil.yaml` (o pide a Claude "configúrame" dentro del
   Proyecto y te ayuda a crearlo a partir de tus PDF de AESA).
5. Dentro del Proyecto: *"comunicado el 20 en Genalguacil"*.

## Desarrollo
```bash
nvm use            # Node 22
npm install
npm test           # tests del conector (initialize, tools, zona, plazo)
npx netlify-cli dev   # http://localhost:8888/mcp
```
Las recetas se editan en `src/recetas.md`; `npm run build` las empaqueta en `src/textos.gen.ts` y genera
`public/descargas/` (skill en .zip y plantilla de perfil). Netlify lo hace solo al desplegar.

Todo lo que ve el piloto (web, skill, recetas, mensajes de error) va en **español**.
`docs/propuesta.html` es la propuesta interna con los diagramas (no se publica).

## Licencia
MIT
