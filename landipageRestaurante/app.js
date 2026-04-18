// 1. OBJETO DE DATOS (debe ir primero)
const datos = {
    Nombre: '',
    Apellido: '',
    Celular: '',
    Email: '',
    Mensaje: '',
}

// 2. SELECCIONAR ELEMENTOS
const formulario = document.querySelector(".formulario")
const Nombre  = document.querySelector("#nombre")
const Apellido= document.querySelector("#apellido")
const Celular = document.querySelector("#celular")
const Email   = document.querySelector("#email")
const Mensaje = document.querySelector("#mensaje")

// 3. LEER DATOS en tiempo real
function leerdatos(m) {
    const key = m.target.id.charAt(0).toUpperCase() + m.target.id.slice(1)
    datos[key] = m.target.value
    console.log(datos)
}

Nombre.addEventListener("input", leerdatos)
Apellido.addEventListener("input", leerdatos)
Celular.addEventListener("input", leerdatos)
Email.addEventListener("input", leerdatos)
Mensaje.addEventListener("input", leerdatos)

// 4. EVENTO SUBMIT
formulario.addEventListener("submit", function(m) {
    m.preventDefault()

// 5. VALIDAR (ahora sí datos ya tiene valores)
    const { Nombre, Apellido, Email, Mensaje } = datos

    if (Nombre === "" || Apellido === "" || Email === "" || Mensaje === "") {
        mostrarError("Los Campos De Nombre, Apellido, Email y Mensaje son OBLIGATORIOS!")
        return 
    }

// 6. ENVIAR
mostrarMensaje("Formulario Enviado Exitosamente✅")

formulario.reset()

datos.Nombre   = ''
datos.Apellido = ''
datos.Celular  = ''
datos.Email    = ''
datos.Mensaje  = ''

function mostrarError(mensaje) {
    const errorExistente = document.querySelector(".error")
    if (errorExistente) errorExistente.remove()

    const error = document.createElement("p")
    error.textContent = mensaje
    error.classList.add("error")
    formulario.appendChild(error)

    setTimeout(() => {
    error.classList.add("error-hide")
    setTimeout(() => error.remove(), 300) // espera que termine el fadeOut
    }, 2000)
}

function mostrarMensaje(mensaje) {  
    const MensajeOK = document.querySelector(".MensajeOK")  
    if (MensajeOK) MensajeOK.remove()

    const elemento = document.createElement("p")
    elemento.textContent = mensaje
    elemento.classList.add("MensajeOK")  
    formulario.appendChild(elemento)

    setTimeout(() => {
        elemento.classList.add("error-hide")
        setTimeout(() => elemento.remove(), 300)
    }, 2000)
}})

// PESTAÑAS
const botones = document.querySelectorAll(".tab-btn");
const contenidos = document.querySelectorAll(".tab-content");

botones.forEach(boton => {
    boton.addEventListener("click", () => {

        if (boton.classList.contains("active")) return;

        botones.forEach(b => b.classList.remove("active"));
        contenidos.forEach(c => c.classList.remove("active"));

        boton.classList.add("active");

        const id = boton.dataset.tab;
        document.getElementById(id).classList.add("active");
    });
});

