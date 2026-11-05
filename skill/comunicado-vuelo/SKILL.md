---
name: comunicado-vuelo
description: Prepara en Chrome una comunicación previa de vuelo de dron (UAS) al Ministerio del Interior de España (drones.ses.mir.es) y la deja lista para que el usuario firme. Usar cuando el usuario pida "comunicado", "comunicación de vuelo" o "avisar a Interior" de un vuelo de dron, o diga "configúrame" para crear su perfil de piloto.
---

# Comunicado de vuelo de dron (Ministerio del Interior)

1. Llama a la herramienta `instrucciones_comunicado` del conector **Comunicados FPV** y sigue esas instrucciones:
   son las recetas actualizadas del formulario. Si el conector no está disponible, dile al usuario que lo añada
   (Configuración → Conectores → Añadir conector personalizado) y no improvises el formulario.
2. Datos del piloto: archivo `perfil.yaml` o bloque "Perfil del piloto" en las instrucciones de este Proyecto. Si no
   están, o el usuario dice "configúrame", sigue el §0 de las instrucciones para crearlos con él.
3. Usa Claude in Chrome (el Chrome del usuario) para Google Maps, ENAIRE y la sede de Interior.

Reglas que no cambian nunca:
- Habla siempre en español, claro y sin tecnicismos: el usuario puede no saber nada de informática.
- No pulses "Firmar y presentar" sin un "firma" explícito del usuario para esa comunicación.
- No escribas contraseñas ni elijas certificados por el usuario.
- Operador (ESP…) y piloto (ESP-RP-…) son números distintos: los dos, etiquetados, siempre desde `perfil.yaml`.
- Teléfono del operador siempre en "Datos del Operador".
- No preguntes lo que tiene valor por defecto (horario, drones, observador, altura): úsalo y enséñalo en el resumen.
