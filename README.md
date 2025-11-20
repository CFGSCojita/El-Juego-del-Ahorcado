
# El Juego del Ahorcado

Este proyecto integra JavaScript con la manipulación avanzada del DOM y la persistencia de datos para ofrecer un juego de El Ahorcado completo y temático.

---

## Documentación Técnica

### 1. Descripción general del proyecto
El propósito principal es **reforzar y aplicar los conocimientos de JavaScript** y la manipulación del DOM adquiridos en el curso. El objetivo es crear una aplicación web funcional que demuestre el manejo de estructuras de datos complejas (JSON, Objetos, Arrays) y la persistencia de la información (LocalStorage).

### 2. Funcionalidad
El juego incorpora todas las funcionalidades esenciales y específicas de las tres fases:
* **Juego Básico (Fase 1):** Abecedario dinámico, contadores de intentos y errores, y un cronómetro de partida. Los mensajes de Victoria/Derrota son personalizados y con código de colores.
* **Limitación por Tiempo (Fase 2):** Implementación de una **Cuenta Atrás de 10 segundos** que se reinicia con cada acción del usuario. Si se agota, se resta un intento.
* **Estadísticas y Récords (Fase 2):** El sistema guarda los récords de la partida en `LocalStorage`. Se comprueba si el nuevo registro supera el anterior (por menos errores o por menos tiempo en caso de empate) y se actualiza.
* **Juego Temático (Fase 3):** Los conjuntos de palabras se cargan desde un fichero `palabras.json`, y el usuario selecciona el tema mediante un menú desplegable (`<select>`).

### 3. Estructura
El proyecto sigue una arquitectura modular y limpia:
* `index.html`: Define la estructura, incluye todos los elementos de la interfaz con los IDs necesarios, y el `<select>` para la Fase 3.
* `style.css`: Contiene todos los estilos, incluyendo el posicionamiento absoluto del selector de tema y las clases de estado (`.letra-acertada`, `.mensaje-derrota`).
* `script.js`: Contiene toda la lógica del juego, las funciones asíncronas para la carga de JSON (`fetch`), la gestión de `setInterval` (cronómetro, cuenta atrás) y la lógica de `LocalStorage`.
* `palabras.json`: Almacén de los datos temáticos.

### 4. Requisitos del sistema
Para la correcta ejecución del proyecto, solo se requiere:
* Un **Navegador web moderno** (Chrome, Firefox, Edge, Safari) compatible con JavaScript ES6. También incluso se puede con Opera GX.
* **Servidor Local:** Es **obligatorio** usar una extensión como *VS Code Live Server* para que la función `fetch('palabras.json')` pueda leer el fichero JSON sin errores de seguridad (CORS).

### 5. Instalación y configuración
1.  Clonar o descargar el repositorio del proyecto.
2.  Abrir la carpeta del proyecto en el editor de código.
3.  Hacer clic derecho en `index.html` y seleccionar la opción **"Open with Live Server"**.

### 6. Uso del proyecto
  ## Instrucciones del Juego
  
  El objetivo es adivinar la palabra oculta, cuyo tema puedes elegir en el menú superior derecho, antes de agotar tus intentos.
  
  ### Dinámica de Juego
  
  * **Intentos:** Dispones de **7 intentos** (errores) al inicio de cada partida.
  * **Limitación por tiempo (10 segundos):** Tienes un límite de **10 segundos** para seleccionar cada letra.
      * Si seleccionas una letra, el tiempo se reinicia.
      * Si el tiempo se agota, pierdes instantáneamente 1 intento, y el contador se reinicia.
  * **Indicadores Visuales:**
      * Las letras acertadas se marcan en **verde** y las falladas en **rojo**.
      * Los mensajes de victoria o derrota aparecen en pantalla con el color correspondiente (verde/rojo).
  * **Récords:** Si ganas, tu tiempo y errores se comparan con el récord guardado para esa palabra, y solo se guarda si has superado el tiempo o reducido el número de errores.

### 7. Actualización
Como sugerencias para futuras mejoras:
* **Selección de Dificultad:** Permitir modificar el `TIEMPO_LIMITE` de la cuenta atrás (ej: 5 segundos para difícil).
* **Pantalla de Récords:** Crear una vista específica para mostrar los récords guardados por palabra en `LocalStorage`.
* **Gestión de Usuarios:** Añadir un inicio de sesión simple para guardar récords nominalmente.

### 8. Referencias
* [Documentación oficial de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
