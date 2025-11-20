
// Declaración de variables.
const MAX_INTENTOS = 7;
const TIEMPO_LIMITE = 10;
let intentosDisponibles = MAX_INTENTOS;
let errores = 0;
let palabraOculta = "";
let letrasAdivinadas = [];
let juegoIniciado = false;
let intervaloCronometro; 
let tiempoTranscurrido = 0;
let intervaloCuentaAtras;
let tiempoRestante = TIEMPO_LIMITE;
let datosJuego = null;

// Declaración de variables para la manipulación con DOM. Ponemos "El" como nombre al final de cada variable para indicar que es un elemento manipulable.
const palabraOcultaEl = document.getElementById("palabra-oculta");
const intentosEl = document.getElementById("contador");
const erroresEl = document.getElementById("contador-errores");
const abecedarioContenedor = document.getElementById("abecedario-contenedor");
const cronometroEl = document.getElementById("cronometro");
const mensajeResultadoEl = document.getElementById("mensaje-resultado");
const cuentaAtrasEl = document.getElementById("cuenta-atras-el");
const selectorTemaEl = document.getElementById("selector-tema");

// Declaramos una lista de palabras a adivinar para el juego.
let listaPalabras = [];

// Declaramos una función asíncrona para cargar los datos del JSON y comenzar el juego.
async function cargarDatosYJuego() {
    // Estructura 'try-catch'.
    // Intentará cargar el archivo JSON y manejar cualquier error que pueda ocurrir.
    try {
        const respuesta = await fetch('palabras.json'); // Hacemos una solicitud para obtener el archivo JSON y la guardamos en una variable.
        const datos = await respuesta.json(); // Convertimos la respuesta en un objeto JSON.

        datosJuego = datos; // Guardamos los datos del juego en la variable global.

        selectorTemaEl.innerHTML = ""; // Limpiamos el selector de temas antes de llenarlo.

        // Bucle 'for-each'.
        // Recorrerá cada tema en los datos y crea una opción en el selector para cada uno.
        datos.temas.forEach((tema, index) => {
            const opcion = document.createElement('option'); // Creamos un elemento 'option' para el selector.
            opcion.value = index; // Establecemos el valor de la opción como el índice del tema.
            opcion.textContent = tema.nombre; // Establecemos el texto de la opción como el nombre del tema.
            selectorTemaEl.appendChild(opcion); // Añadimos la opción al selector de temas.
        });

        // Añadimos un evento 'change' al selector de temas para cambiar la lista de palabras cuando se seleccione un tema diferente.
        selectorTemaEl.addEventListener('change', (evento) => {
            const indiceTema = evento.target.value; // Obtenemos el índice del tema seleccionado.
            listaPalabras = datosJuego.temas[indiceTema].palabras; // Actualizamos la lista de palabras según el tema seleccionado.
            iniciarJuego(); // Iniciamos el juego con la nueva lista de palabras.
        });

        listaPalabras = datosJuego.temas[0].palabras; // Inicializamos la lista de palabras con el primer tema por defecto.
        iniciarJuego(); // Iniciamos el juego.
    } catch (e) {
        console.error("Error al cargar el archivo JSON", e);
    }
}

// Creamos una función para reiniciar la cuenta atrás.
function reiniciarCuentaAtras() {

    // Estructura de control 'if'.
    // Si ya hay un intervalo de cuenta atrás en ejecución, lo limpiamos.
    if (intervaloCuentaAtras) {
        clearInterval(intervaloCuentaAtras); // Limpiamos cualquier intervalo previo.
    }

    tiempoRestante = TIEMPO_LIMITE; // Reiniciamos el tiempo restante.
    cuentaAtrasEl.textContent = tiempoRestante; // Actualizamos el contenido del elemento en la interfaz.

    // Iniciamos un nuevo intervalo para la cuenta atrás.
    intervaloCuentaAtras = setInterval(() => {
        tiempoRestante--; // Decrementamos el tiempo restante.
        cuentaAtrasEl.textContent = tiempoRestante; // Actualizamos el contenido del elemento en la interfaz.

        // Estructura de control 'if'.
        // Si el tiempo restante llega a cero, manejamos la situación de tiempo agotado.
        if (tiempoRestante <= 0) {
            clearInterval(intervaloCuentaAtras); // Limpiamos el intervalo de la cuenta atrás.

            errores++; // Incrementamos el contador de errores.
            intentosDisponibles--; // Decrementamos el contador de intentos disponibles.
            actualizarInterfazContadores(); // Actualizamos los contadores en la interfaz a través de la función.

            // Estructura de control 'if'.
            // Si no quedan intentos disponibles, indicamos que el jugador ha perdido.
            if (intentosDisponibles <= 0) {
                const mensaje = `¡Perdiste! Se acabó el tiempo. La palabra era ${palabraOculta}.`;
                terminarJuego(false, mensaje);
            } else {
                reiniciarCuentaAtras(); // Reiniciamos la cuenta atrás para el siguiente intento.
            }
        }
    }, 1000);
}

// Creamos una función para iniciar el juego.
function iniciarJuego() {

    // Volvemos a declarar las variables para reiniciar el juego.
    intentosDisponibles = MAX_INTENTOS;
    errores = 0;
    letrasAdivinadas = [];
    
    const indiceAleatorio = Math.floor(Math.random() * listaPalabras.length); // Seleccionamos un índice aleatorio de la lista de palabras disponibles para elegir la secreta.
    palabraOculta = listaPalabras[indiceAleatorio]; // Seleccionamos la palabra secreta usando el índice aleatorio.

    actualizarInterfazContadores(); // Llamamos a la función para actualizar los contadores en la interfaz.
    generarAbecedario(); // Llamamos a la función para generar el abecedario en la interfaz.
    mostrarPalabraOculta(); // Llamamos a la función para mostrar la palabra oculta en la interfaz.

    cronometroEl.textContent = "00:00:00"; // Reiniciamos el cronómetro en la interfaz.
    mensajeResultadoEl.textContent = ""; // Limpiamos el mensaje de resultado en la interfaz.
    mensajeResultadoEl.classList.remove('mensaje-victoria', 'mensaje-derrota'); // Eliminamos las clases de mensaje de victoria o derrota.

    tiempoRestante = TIEMPO_LIMITE; // Reiniciamos el tiempo restante.
    cuentaAtrasEl.textContent = TIEMPO_LIMITE; // Actualizamos el contenido del elemento de cuenta atrás en la interfaz.
    if (intervaloCuentaAtras) {
        clearInterval(intervaloCuentaAtras); // Limpiamos cualquier intervalo previo.
    }
}

// Creamos una función para actualizar los contadores en la interfaz.
function actualizarInterfazContadores() {
    intentosEl.textContent = intentosDisponibles; // Actualizamos el contador de intentos disponibles.
    erroresEl.textContent = errores; // Actualizamos el contador de errores.
}

// Creamos una función para mostrar la palabra oculta en la interfaz.
function mostrarPalabraOculta() {
    let palabraMostrada = ""; // Inicializamos una variable para construir la palabra mostrada.

    // Bucle 'for-each'.
    // Recorrerá cada letra de la palabra oculta.
    for (const letra of palabraOculta) {

        // Estructura de control 'if'.
        // Si la letra ha sido adivinada, la mostramos.
        // En caso contrario, mostramos un guion bajo.
        if (letrasAdivinadas.includes(letra)) {
            palabraMostrada += letra + " ";
        } else {
            palabraMostrada += "_ ";
        }
    }
    palabraOcultaEl.textContent = palabraMostrada.trim(); // Actualizamos el contenido del elemento en la interfaz con la palabra mostrada y usamos trim() para eliminar espacios en blanco al inicio y al final.
}

// Creamos una función para generar el abecedario en la interfaz.
function generarAbecedario() {
    abecedarioContenedor.innerHTML = ""; // Limpiamos el contenedor del abecedario antes de generarlo.
    const codigoA = 'A'.charCodeAt(0); // Obtenemos el código ASCII de la letra 'A'.
    
    // Bucle 'for'.
    // Recorrerá los números del 0 al 25 para generar las letras del abecedario.
    for (let i = 0; i < 26; i++) {
        const letra = String.fromCharCode(codigoA + i); // Convertimos el código ASCII a la letra correspondiente.

        const botonLetra = document.createElement('div'); // Creamos un elemento 'div' para cada letra del abecedario.
        
        botonLetra.textContent = letra; // Establecemos el texto del botón con la letra correspondiente.
        botonLetra.classList.add('letra-boton'); // Añadimos la clase CSS 'letra-boton' al botón.
        botonLetra.id = `letra-${letra}`; // Establecemos un ID único para cada botón de letra.

        botonLetra.addEventListener('click', () => manejarAdivinanza(letra, botonLetra)); // Añadimos un evento 'click' al botón para manejar la adivinanza cuando se haga clic.

        abecedarioContenedor.appendChild(botonLetra); // Añadimos el botón al contenedor del abecedario.
    }
}

// Creamos una función para manejar la adivinanza cuando se hace clic en una letra.
function manejarAdivinanza(letra, elementoBoton) {
    
    // Estructura de control 'if'.
    // Si el juego no ha iniciado, iniciamos el cronómetro.
    if (!juegoIniciado) {
        juegoIniciado = true;
        iniciarCronometro();
    }

    reiniciarCuentaAtras();

    elementoBoton.style.pointerEvents = 'none'; // Deshabilitamos el botón para que no se pueda volver a hacer clic en él.

    // Estructura de control 'if'.
    // Si la letra está en la palabra oculta, la añadimos a las letras adivinadas.
    // En caso contrario, incrementamos el contador de errores.
    if (palabraOculta.includes(letra)) {

        letrasAdivinadas.push(letra); // Añadimos la letra a la lista de letras adivinadas.
        elementoBoton.classList.add('letra-acertada'); // Añadimos la clase CSS 'letra-acertada' al botón.
        mostrarPalabraOculta(); // Actualizamos la palabra oculta en la interfaz.

        // Estructura de control 'if'.
        // Si no quedan guiones bajos en la palabra oculta, indicamos que el jugador ha ganado.
        if (!palabraOcultaEl.textContent.includes('_')) {
            const mensaje = `¡Felicidades! Ganaste, la palabra era: ${palabraOculta}.`; // Mostramos un mensaje de victoria.
            terminarJuego(true, mensaje); // Terminamos el juego con victoria.
        }

    } else {
        errores++; // Incrementamos el contador de errores.
        intentosDisponibles--; // Decrementamos el contador de intentos disponibles.
        elementoBoton.classList.add('letra-fallada'); // Añadimos la clase CSS 'letra-fallada' al botón.
        actualizarInterfazContadores(); // Actualizamos los contadores en la interfaz.

        // Estructura de control 'if'.
        // Si no quedan intentos disponibles, indicamos que el jugador ha perdido.
        if (intentosDisponibles <= 0) {
            const mensaje = `¡Perdiste! La palabra era: ${palabraOculta}.`; // Mostramos un mensaje de derrota.
            terminarJuego(false, mensaje); // Terminamos el juego con derrota.
        }
    }
}

// Creamos una función para iniciar el cronómetro.
function iniciarCronometro() {
    
    // Declaramos variables para los segundos y minutos.
    let segundos = 0; 
    let minutos = 0;

    // Usamos setInterval para actualizar el cronómetro cada segundo (1000 ms).
    intervaloCronometro = setInterval(() => {
        segundos++; // Incrementamos los segundos.
        // Estructura de control 'if'.
        // Si los segundos llegan a 60, incrementamos los minutos y reiniciamos los segundos.
        if (segundos === 60) {
            segundos = 0;
            minutos++;
        }

        cronometroEl.textContent = `00:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`; // Actualizamos el contenido del cronómetro en la interfaz, formateando los minutos y segundos con dos dígitos.
        tiempoTranscurrido = (minutos * 60) + segundos; // Actualizamos el tiempo transcurrido en segundos.
    }, 1000);
}

// Creamos una función para guardar las estadísticas en el almacenamiento local.
function guardarEstadisticas(palabra, erroresPartida, tiempoPartida) {
    const claveRecord = `record_${palabra}`; // Creamos una clave única para cada palabra.
    const recordGuardadoJSON = localStorage.getItem(claveRecord); // Obtenemos las estadísticas existentes para la palabra.

    // Declaramos una variable para indicar si se debe actualizar el récord.
    let actualizarRecord = false;

    // Estructura de control 'if'.
    // Comprobamos si hay un récord guardado y si se debe actualizar.
    if (!recordGuardadoJSON) {
        actualizarRecord = true; // No hay récord guardado, por lo que se debe actualizar.
    } else {
        const recordGuardado = JSON.parse(recordGuardadoJSON); // Parseamos el JSON para obtener el objeto de estadísticas.

        // Estructura de control 'if'.
        // Si el número de errores es menor a la cantidad de errores guardada, actualizamos el récord.
        // Pero si la cantidad de errores es la misma, comparamos si el tiempo es menor a la cantidad de tiempo guardada y de esa manera actualizamos el récord en este caso.
        if (erroresPartida < recordGuardado.errores) {
            actualizarRecord = true; // Actualizamos el récord.
        } else if (erroresPartida === recordGuardado.errores && tiempoPartida < recordGuardado.tiempo) {
            actualizarRecord = true; // Actualizamos el récord.
        }
    }

    // Estructura de control 'if'.
    // Si se debe actualizar el récord, guardamos las nuevas estadísticas en el almacenamiento local.
    if (actualizarRecord) {
        // Creamos un objeto con las nuevas estadísticas.
        const nuevoRecord = {
            errores: erroresPartida,
            tiempo: tiempoPartida
        };
        localStorage.setItem(claveRecord, JSON.stringify(nuevoRecord)); // Guardamos el objeto como un string JSON en el almacenamiento local. Usamos stringify() para convertir el objeto a JSON.
        console.log(`¡Nuevo récord para la palabra "${palabra}" guardado!`);
    } else {
        console.log(`No se ha superado el récord para la palabra "${palabra}".`);
    }
}

// Creamos una función para terminar el juego.
function terminarJuego(victoria, mensajeResultado) {
    clearInterval(intervaloCronometro); // Detenemos el cronómetro.
    clearInterval(intervaloCuentaAtras); // Detenemos la cuenta atrás.
    juegoIniciado = false; // Reiniciamos la variable de estado del juego.
    
    // Estructura de control 'if'.
    // Si el jugador ha ganado, guardamos las estadísticas y se lo indicamos con un mensaje.
    // En caso contrario, solo mostramos el mensaje de derrota.
    if (victoria) {
        guardarEstadisticas(palabraOculta, errores, tiempoTranscurrido); // Guardamos las estadísticas.
        mensajeResultadoEl.classList.add('mensaje-victoria');
    } else {
        mensajeResultadoEl.classList.add('mensaje-derrota');
    }

    mensajeResultadoEl.textContent = mensajeResultado; // Mostramos el mensaje de resultado en la interfaz.

    const botones = abecedarioContenedor.querySelectorAll('.letra-boton'); // Seleccionamos todos los botones de letras.

    // Bucle 'for-each'.
    // Por cada uno de los botones, deshabilitamos la interacción.
    botones.forEach(boton => {
        boton.style.pointerEvents = 'none';
    });
    
}

document.addEventListener("DOMContentLoaded", cargarDatosYJuego); // Iniciamos el juego cuando el contenido del DOM esté completamente cargado.