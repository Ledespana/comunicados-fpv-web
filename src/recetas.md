# Comunicación de vuelo UAS – Ministerio del Interior (recetas v1)

Estas instrucciones las sirve el conector "Comunicados FPV" con `instrucciones_comunicado`. Síguelas en orden.
Datos del piloto: `perfil.yaml` (archivo del Proyecto o bloque "Perfil del piloto" en sus instrucciones) (operador, piloto, drones, observadores,
preferencias, ubicaciones). Si no existe, ayuda al usuario a rellenarlo a partir de la plantilla del conector
(ver §0) antes de nada.

Reglas fijas:
- Usa SIEMPRE Claude in Chrome (el Chrome del usuario): el certificado FNMT, la autoselección de certificado y
  AutoFirma están ahí.
- Nunca pulses "Firmar y presentar" sin un "firma" explícito del usuario para esa comunicación.
- Nunca escribas contraseñas ni elijas certificados por el usuario.
- Identificadores siempre desde `perfil.yaml`, los dos etiquetados: **operador** = `operador.registro_operador`
  (ESP…, va en "Número de registro de operador") y **piloto** = `piloto.certificado_competencia` (ESP-RP-…, va en
  "Certificado de competencia de piloto"). Son distintos: nunca uno en lugar del otro.
- Teléfono del operador SIEMPRE en "Datos del Operador > Teléfono de contacto" (lo pide la Guardia Civil).
- Habla siempre en español, claro y sin tecnicismos: el usuario puede no saber nada de informática. No le digas
  palabras como YAML, JSON, conector, MCP, skill, JavaScript, PrimeFaces o ajax; di "tus datos", "el formulario",
  "la web de Interior". Si algo falla, explícale qué tiene que hacer él, en una o dos frases.

## 0. Perfil ("configúrame")
Si el Proyecto no tiene los datos del piloto (archivo `perfil.yaml` o un bloque "Perfil del piloto" en las
instrucciones del Proyecto):
1. Pide sus dos PDF de AESA (registro de operador UAS, el que tiene logo EASA y fecha de caducidad; y el certificado
   de piloto A1/A3). Sácales nombre, nº de operador (ESP…) y nº de piloto (ESP-RP-…) y enséñaselos para que confirme.
2. Pregunta en un solo mensaje, en lenguaje sencillo: DNI o NIE, dirección completa, email, teléfono móvil
   (obligatorio) y qué drones tiene (marca y modelo; el peso, autonomía, color, radio y luces los buscas tú si es un
   modelo comercial conocido y solo le preguntas lo que no encuentres).
3. Rellena la plantilla (`plantilla_perfil`) y dale el resultado en UN solo bloque para copiar, con estas
   instrucciones, paso a paso y sin palabras técnicas: "Copia el texto de abajo (botón de copiar). Luego, en este
   Proyecto, abre las instrucciones del proyecto, pega el texto debajo del título «Perfil del piloto» y guarda.
   Así la próxima vez ya lo sabré."
Dron de construcción propia de 250 g o más → solo puede volar lejos de personas y de zonas urbanas (categoría A3):
explícalo con esas palabras y no lo incluyas en comunicaciones de vuelo urbano.

## 1. Datos del vuelo: valores por defecto, NO preguntes
El usuario quiere decir una frase ("comunicado el 20 en Genalguacil") y nada más. Resuelve con estos valores por
defecto (`perfil.yaml > preferencias` o, si no hay, los de abajo) y enséñalos en el resumen final:
- **Fecha:** "el 20" = el próximo día 20. Llama a `comprobar_plazo` con la fecha (AAAA-MM-DD); si no cumple, avísalo
  y no sigas (es lo único que para).
- **Horario:** si no lo dice → `preferencias.horario` (por defecto 00:00–23:55).
- **Drones:** si no lo dice → todos los de `uas` con `mtom_g` < 250. Nunca uno ≥ 250 g en urbano.
- **Observador:** si no lo dice → los de `observadores` con `por_defecto: true`; si no hay, ninguno.
- **Altura** 120 m, **VLOS**.

## 2. Zona de vuelo (sitio nuevo)
1. Coordenadas: si el usuario da coordenadas o enlace de Maps, úsalas. Si da un nombre, búscalo en Google Maps
   (Claude in Chrome): lugar concreto → ese punto, radio `preferencias.radio_m` (100 m); solo un pueblo → el centro
   que marca Maps, radio `preferencias.radio_pueblo_m` (500 m). Si es ambiguo, elige el de la provincia del usuario
   y dilo en el resumen.
2. Comprueba el punto en https://drones.enaire.es: en el buscador escribe **"lat, lon"** (latitud primero, p.ej.
   `36.54567, -5.23548`; al revés cae en África), clic en la sugerencia, verifica con una captura que el pin está en
   el sitio, clic en el punto → panel de **Información** ("Information" si la web está en inglés). Si hay zona restringida (ZRVF/CECAF, LER/LED Defensa, parque
   nacional, CTR de aeropuerto, NOTAM): **para** y explica que hace falta otro trámite. Si ENAIRE pide aceptar
   condiciones, que las acepte el usuario.
3. Llama a `crear_zona(lat, lon, radio_m)` → `mapaValue`, `lugar` ("lat,lon,17") y `poligono`.

## 3. Login
1. https://sede.interior.gob.es/portal/sede/tramites?codAgrupacion=Drones → **Acceso** en
   "Comunicación de vuelo de aeronave pilotada por control remoto".
2. Cl@ve → acceso con **certificado electrónico / DNIe** (si el navegador está en inglés, "Access eIdentifier").
   Espera ~8 s.
3. Login correcto = `https://drones.ses.mir.es/drones-web/acceso`. Si la sesión sigue viva, abre esa URL
   directamente. Si al volver de Cl@ve sale un 404 de Interior, abre esa URL: la sesión ya está hecha.
Si se queda parado: hay un selector de certificado o un aviso del sistema abierto → pide al usuario que elija su
certificado / "Permitir siempre". Error 500 `003002` de Cl@ve = el usuario canceló el selector → cerrar Chrome del
todo y repetir (Mac: Cmd+Q; Windows: cerrar todas las ventanas y, si sigue junto al reloj, clic derecho → Salir).

## 4. Rellenar
La navegación directa por URL a veces redirige a /acceso: usa los enlaces del menú (Comunicaciones →
"Comunicaciones de vuelo").

**Sitio ya usado (camino rápido):** si `ubicaciones.<sitio>.comunicacion_origen` existe → Comunicaciones → icono
"Clonar la comunicación" de esa fila. Se abre `/clonarComunicacion` con todo precargado excepto **fecha y horas**.
Si el número de actividades (días × drones) es distinto, añade o quita actividades. Revisa el teléfono del operador.

**Sitio nuevo:** Alta comunicación → En nombre propio. Pestaña Operador: verifica lo precargado y pon el
**teléfono**. Actividad 1:
- Tipo "VLOS"; Lugar protección y Lugar recuperación = `lugar`; Altura 120; CC.AA.: clic en la comunidad del sitio.
- Zona: `limpiarMapa(id); document.getElementById(id+':mapa_value').value = <mapaValue>; cargarFigurasMapa(id)` con
  `id='formCampos:pestanas:zona_act1'`. Comprueba que hay 1 sola figura (si aparece una 2ª "Generica", deja 1).
  Recargar el mapa BORRA fecha/horas y CC.AA. de esa actividad → pon la zona antes que la fecha.
- Piloto: "Mis pilotos" si ya existe; si no, rellena el bloque piloto (certificado de competencia = ESP-RP-…).
- UAS por JS (value + input/change/blur, **uno a uno con ~600 ms**: cambiar Nº de serie dispara un ajax que
  re-renderiza el panel). MTOM y Autonomía son inputNumber:
  `PrimeFaces.widgets['widget_formCampos_pestanas_mtomRpa_act1'].setValue(117)`. Clase: opción con texto 'Rotor' en
  `codClaseRpa_act1`. "Banda" se trunca a 30 caracteres; es normal.
- Observadores: botón "Agregar" → diálogo `formDlgObs` (el tipo de documento es selectOneMenu; cambiarlo borra el nº
  → escribe el documento DESPUÉS). Obligatorios además: `desCertCompetPilobs` y `desCertFormacionPilobs` = "N/A".
  Luego `formDlgObs:agregarObs`.

**Recetas PrimeFaces (probadas, imprescindibles):**
- **Selects (horas, minutos, clase):** los clics no abren el desplegable. Usa JS y dispara SIEMPRE el change, si no
  el valor se ve pero no llega al servidor y sale 00:00:
  `w=PrimeFaces.widgets['widget_formCampos_pestanas_horaInicio_act1']; w.show(); await 900ms; w.selectValue('9'); w.hide(); w.callBehavior('change'); await 1500ms`
  (valores sin cero: '7','0','20'). Comprueba `_input.value`; si falla con "reading 'eq'", reintenta.
- **Fecha:** `c=PrimeFaces.widgets['widget_formCampos_pestanas_fecha_act1']; c.setDate(new Date(a,m-1,d)); c.callBehavior('dateSelect'); await 2500ms`.
  Sin `dateSelect` la fecha no llega al servidor. El ajax de la fecha REINICIA las horas de esa actividad →
  orden: fechas de todas → comprobar → horas de todas.
- **Varios drones o días = UNA comunicación**, una actividad por día y dron ("Añadir nueva actividad" → ids
  `_act2`…, piloto `...Pilact2`). Añadir una actividad re-renderiza TODAS y borra fechas, horas, altura, MTOM y
  autonomía. Orden: 1) crear todas las actividades con textos, zona, piloto, UAS y observador; 2) fechas (con
  dateSelect); 3) horas; 4) altura/MTOM/autonomía; 5) verificar.
- Llamadas JS > 45 s dan timeout: lanza el trabajo en segundo plano (`(async()=>{...})()`), guarda el progreso en
  `window.__prog` y consúltalo cada ~60 s. El servidor es lento: espera 1–1,5 s tras cada ajax.

**Verificación final (obligatoria):** vuelca por JS, de CADA actividad: fecha, horas, altura, nº de figuras de la
zona, CC.AA., dron (modelo, MTOM, autonomía), piloto (DNI y ESP-RP), observador; y el teléfono del operador. Repite
hasta que no falte nada.

## 5. Revisión y firma
- Enseña un resumen (tabla día/horario/drones + sitio y radio, captura del mapa con la zona, altura, piloto,
  operador, teléfono, observador) indicando qué se ha puesto por defecto, y espera "firma" (o correcciones).
- Con "firma": pulsa **"Firmar y presentar"** → diálogo "Firma de la comunicación": antes de **"Firmar y enviar"**
  vuelve a volcar fechas/horas/teléfono (ahora vienen del servidor); si algo cambió → Cancelar y corregir.
- Página FIRe "Seleccione el sistema de firma" → **"Firma con certificado local"** (AutoFirma) → Acceder. Luego lo
  hace el usuario: elegir su certificado y aceptar en AutoFirma (las capturas fallan mientras tanto; espera).
- Éxito = `/drones-web/resultado` con "Comunicación registrada correctamente con identificador C…".

## 6. Después de presentar
1. En /resultado: "Descargar acuse" y "Descargar PDF" → quedan en la carpeta Descargas del usuario.
2. Lee en la página el identificador C… y, si aparece, el nº de registro (REGAGE…).
3. Si el sitio era nuevo, dale al usuario el bloque YAML para añadir a `ubicaciones` de su `perfil.yaml`
   (lugar, radio_m, poligono y `comunicacion_origen: C…`) para clonarla la próxima vez.
4. Recuérdale: la Guardia Civil puede escribir pidiendo documentación (registro de operador, formación A1/A3 y el
   acuse). Si lo pide, prepara la respuesta como borrador; nunca la envíes sin su "envía".
