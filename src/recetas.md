# Comunicación de vuelo UAS – Ministerio del Interior (recetas v2)

Estas instrucciones las sirve el conector "Comunicados FPV" con `instrucciones_comunicado`. Síguelas en orden.
**No hay archivo de perfil ni configuración previa.** Los datos del piloto salen, por este orden, de:
1. lo que el usuario diga en este chat (y lo que recuerdes de conversaciones anteriores, si tienes memoria);
2. **la propia sede de Interior**: los datos del operador se precargan con su certificado, "Mis pilotos" guarda al
   piloto y cada comunicación anterior se puede **clonar** con drones, zona, observador y altura;
3. si falta algo, se lo preguntas UNA vez, en un solo mensaje (§0, opción 2).

Reglas fijas:
- Usa SIEMPRE Claude in Chrome (el Chrome del usuario): el certificado FNMT, la autoselección de certificado y
  AutoFirma están ahí.
- Nunca pulses "Firmar y presentar" sin un "firma" explícito del usuario para esa comunicación.
- Nunca escribas contraseñas ni elijas certificados por el usuario.
- Dos números de AESA distintos, nunca uno en lugar del otro: **operador** (ESP + 12 caracteres, va en "Número de
  registro de operador") y **piloto** (ESP-RP-…, va en "Certificado de competencia de piloto").
- Teléfono del operador SIEMPRE en "Datos del Operador > Teléfono de contacto" (lo pide la Guardia Civil).
- Habla siempre en español, claro y sin tecnicismos: el usuario puede no saber nada de informática. No le digas
  palabras como YAML, JSON, conector, MCP, skill, JavaScript, PrimeFaces o ajax; di "tus datos", "el formulario",
  "la web de Interior". Si algo falla, explícale qué tiene que hacer él, en una o dos frases.

## 0. «Configúrame» (y primera vez)
Cuando el usuario diga "configúrame", "configurar", "empezar" o "primera vez", o pida un comunicado y en la sede no
haya ninguna comunicación anterior, ofrécele dos opciones con estas palabras o parecidas:

> ¿Cómo empezamos?
> 1. **Ya he hecho alguna comunicación en la web de Interior**: cojo tus datos de ahí.
> 2. **Es la primera vez**: te pregunto lo necesario.

Si pide un comunicado sin decir "configúrame", no preguntes las opciones: entra en la sede y, si hay comunicaciones
anteriores, sigue la opción 1 sin preguntar; si no hay, la opción 2.

En las dos opciones, primero entra en la sede (§3): así comprobáis que su certificado funciona. Si falla, ayúdale con
§3 antes de seguir.

**Opción 1 — con los datos de una comunicación anterior**
1. Comunicaciones → listado. Si hay de varios sitios, dile cuáles hay (fecha y sitio) y usa la más reciente salvo
   que elija otra.
2. "Ver detalle" de esa comunicación y apunta: operador (nombre, DNI/NIE, nº de operador ESP…, teléfono), piloto
   (nombre, nº ESP-RP-…), drones (modelo y peso), observador y sitio.
3. Enséñaselo en una tabla corta y avisa de lo que haya que arreglar:
   - teléfono vacío (las comunicaciones antiguas a veces no lo tienen): pídeselo una vez;
   - falta el nº de operador o el de piloto, o están cambiados: pídelos (o sus PDF de AESA);
   - algún dron de construcción propia de 250 g o más: explica que no sirve para vuelo urbano.
4. Cierra con: "Listo. Cuando me digas dónde y cuándo vuelas, copiaré esta comunicación y solo cambiaré la fecha,
   la hora y, si hace falta, el sitio."

**Opción 2 — desde cero**
1. Pregunta en UN solo mensaje, en lenguaje sencillo:
   - teléfono móvil (obligatorio);
   - qué dron o drones vas a volar (marca y modelo; el peso con batería, autonomía, color, radio y luces los buscas
     tú si es un modelo comercial conocido y solo preguntas lo que no encuentres);
   - tus dos números de AESA, o que arrastre al chat sus dos PDF de AESA (registro de operador UAS y certificado de
     piloto A1/A3) y los sacas tú; enséñale los dos números etiquetados para que confirme;
   - si vuela con observador (opcional).
2. Los datos personales del operador (nombre, DNI, dirección) los precarga la sede con su certificado: verifícalos
   en Alta comunicación → En nombre propio → pestaña Operador; no los preguntes. Si falta alguno obligatorio, pídelo.
3. Si la sede permite guardar el piloto o los drones fuera de una comunicación ("Mis pilotos", "Mis UAS"), guárdalos
   allí. Si no, explícale: "Tus datos se guardarán en tu cuenta de Interior con tu primera comunicación; a partir de
   ahí no te los volveré a preguntar." Si tienes memoria entre conversaciones, recuerda también sus drones y
   teléfono.
4. Ofrécele hacer ya su primera comunicación en este mismo chat ("¿Dónde y cuándo vas a volar?").

Dron de construcción propia de 250 g o más → solo puede volar lejos de personas y de zonas urbanas (categoría A3):
explícalo con esas palabras y no lo incluyas en comunicaciones de vuelo urbano.

## 1. Datos del vuelo: valores por defecto, NO preguntes
El usuario quiere decir una frase ("quiero volar el 20 en Genalguacil") y nada más. Usa estos valores por defecto
y enséñalos en el resumen final, donde puede corregirlos:
- **Fecha:** "el 20" = el próximo día 20. Llama a `comprobar_plazo` con la fecha (AAAA-MM-DD); si no cumple, avísalo
  y no sigas (es lo único que para).
- **Horario:** si no lo dice → todo el día (00:00–23:55).
- **Drones:** si no lo dice → los de su última comunicación (o los que te dijo en §0, opción 2). Nunca uno ≥ 250 g en urbano.
- **Observador:** si no lo dice → el de su última comunicación; si no había, ninguno.
- **Altura** 120 m, **VLOS**.

## 2. Zona de vuelo (sitio nuevo)
1. Coordenadas: si el usuario da coordenadas o enlace de Maps, úsalas. Si da un nombre, búscalo en Google Maps
   (Claude in Chrome): lugar concreto → ese punto, radio 100 m; solo un pueblo → el centro que marca Maps,
   radio 500 m. Si es ambiguo, elige el de la provincia del usuario (la de su dirección en la sede)
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

**Si hay comunicaciones anteriores (camino rápido, el habitual):** Comunicaciones → mira el listado.
- Si alguna es del **mismo sitio** (ábrela con "Ver detalle" si hace falta para ver el lugar), clona esa.
- Si no, clona **la más reciente** igualmente: trae operador, teléfono, piloto, drones y observador. Luego cambia en
  cada actividad la zona (con la receta de Zona de abajo y el `mapaValue` de `crear_zona`), Lugar de protección,
  Lugar de recuperación y CC.AA.
Icono "Clonar la comunicación" de esa fila → se abre `/clonarComunicacion` con todo precargado excepto **fecha y
horas**. Si el número de actividades (días × drones) es distinto, añade o quita actividades. Revisa el teléfono del
operador (las comunicaciones antiguas pueden tenerlo vacío).

**Si no hay ninguna (primera vez):** Alta comunicación → En nombre propio. Pestaña Operador: verifica lo precargado y pon el
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
3. Dile que la próxima vez será más rápido: esta comunicación queda en su cuenta de Interior y se clonará.
   No le pidas que guarde nada.
4. Recuérdale: la Guardia Civil puede escribir pidiendo documentación (registro de operador, formación A1/A3 y el
   acuse). Si lo pide, prepara la respuesta como borrador; nunca la envíes sin su "envía".
