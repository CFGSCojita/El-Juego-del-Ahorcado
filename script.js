
// Declaración de variables.
const MAX_INTENTOS = 7;
let intentosDisponibles = MAX_INTENTOS;
let errores = 0;
let palabraOculta = "";
let letrasAdivinadas = [];
let juegoIniciado = false;
let intervaloCronometro; 
let tiempoTranscurrido = 0;

// Declaración de variables para la manipulación con DOM. Ponemos "El" como nombre al final de cada variable para indicar que es un elemento manipulable.
const palabraOcultaEl = document.getElementById("palabra-oculta");
const intentosEl = document.getElementById("contador");
const erroresEl = document.getElementById("contador-errores");
const abecedarioContenedor = document.getElementById("abecedario-contenedor");
const cronometroEl = document.getElementById("cronometro");

// Declaramos una lista de palabras a adivinar para el juego.
const listaPalabras = [
    "JAVASCRIPT",
    "PROGRAMACION",
    "DESARROLLO",
    "HTML",
    "DOM",
    "CLASES"
];

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
            alert(`¡Felicidades! Ganaste, la palabra era: ${palabraOculta}.`); // Mostramos una alerta de victoria.
            terminarJuego(true); // Terminamos el juego con victoria.
        }

    } else {
        errores++; // Incrementamos el contador de errores.
        intentosDisponibles--; // Decrementamos el contador de intentos disponibles.
        elementoBoton.classList.add('letra-fallada'); // Añadimos la clase CSS 'letra-fallada' al botón.
        actualizarInterfazContadores(); // Actualizamos los contadores en la interfaz.

        // Estructura de control 'if'.
        // Si no quedan intentos disponibles, indicamos que el jugador ha perdido.
        if (intentosDisponibles <= 0) {
            alert(`¡Perdiste! La palabra era: ${palabraOculta}.`);
            terminarJuego(false);
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

// Creamos una función para terminar el juego.
function terminarJuego(victoria) {
    clearInterval(intervaloCronometro); // Detenemos el cronómetro.
    juegoIniciado = false; // Reiniciamos la variable de estado del juego.
    
    const botones = abecedarioContenedor.querySelectorAll('.letra-boton'); // Seleccionamos todos los botones de letras.

    // Por cada uno de los botones, deshabilitamos la interacción.
    botones.forEach(boton => {
        boton.style.pointerEvents = 'none';
    });
    
}

document.addEventListener("DOMContentLoaded", iniciarJuego); // Iniciamos el juego cuando el contenido del DOM esté completamente cargado.