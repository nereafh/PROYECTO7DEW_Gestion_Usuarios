//localStorage.clear();

/*
function mostrarResultado(texto){
    document.getElementById("resultado").innerHTML = texto;
}

mostrarResultado("Texto a mostrar");

*/

// ARRAY PRINCIPAL DONDE GUARDO LOS USUARIOS
let usuarios = [];

// USUARIO QUE ESTÁ SELECCIONADO ACTUALMENTE
let usuarioSeleccionado = null;

// OBJETO CON REGEX PARA VALIDAR
const regex = {
    nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,}$/,    // mínimo 3 letras
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

// CONSTRUCTOR DE USUARIOS
function Usuario(nombre, email) {
    this.nombre = nombre;
    this.email = email;
    this.tareas = []; // cada usuario tendrá su propio array de tareas
}


// SELECTORES DEL DOM
const inputNombre = document.querySelector("#inputNombre");
const inputEmail = document.querySelector("#inputEmail");
const formUsuario = document.querySelector("#formUsuario");
const listaUsuariosDIV = document.querySelector("#listaUsuarios");
const usuarioActivoP = document.querySelector("#usuarioActivo");
const inputTarea = document.querySelector("#inputTarea");
const btnAgregarTarea = document.querySelector("#btnAgregarTarea");
const listaTareasUL = document.querySelector("#listaTareas");
// Mensajes de error debajo de inputs
const errorNombre = document.querySelector("#errorNombre");
const errorEmail = document.querySelector("#errorEmail");



// FUNCIÓN PARA VALIDAR CAMPOS
function validarCampo(input, patron, errorElemento, mensaje) {
    if (patron.test(input.value)) {
        input.classList.add("valido");
        input.classList.remove("invalido");
        errorElemento.textContent = ""; // borrar mensaje si es válido
        return true;
    } else {
        input.classList.add("invalido");
        input.classList.remove("valido");
        errorElemento.textContent = mensaje; // mostrar mensaje
        return false;
    }
}




// EVENTOS DE TECLADO, llama a la función anterior y le pasa cada parámetro tanto en nombre como en email 
inputNombre.addEventListener("keyup", () =>
    validarCampo(inputNombre, regex.nombre, errorNombre, "Nombre inválido (mínimo 3 letras)")
);
inputEmail.addEventListener("keyup", () =>
    validarCampo(inputEmail, regex.email, errorEmail, "Email inválido")
);



// REGISTRAR USUARIO
formUsuario.addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar recargar la página

    /*
    Validar campos
    if (validarCampo(inputNombre, regex.nombre) ||
    validarCampo(inputEmail, regex.email)) 
    {
    alert("Revisa los campos, hay errores.");
    return;
    }
    */

    // Valido ambos campos antes de crear el usuario
    const nombreValido = validarCampo(inputNombre, regex.nombre, errorNombre, "Nombre inválido (mínimo 3 letras)");
    const emailValido = validarCampo(inputEmail, regex.email, errorEmail, "Email inválido");

    if (!nombreValido || !emailValido) {
        return; // Si hay error, no registrar
    }


    // Crear usuario
    let nuevoUsuario = new Usuario(inputNombre.value, inputEmail.value);

    // Añadir al array
    usuarios.push(nuevoUsuario);

    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    //alert("Usuario registrado correctamente");
    console.log("Usuarios:", usuarios);

    // Limpiar inputs
    inputNombre.value = "";
    inputEmail.value = "";

    mostrarUsuarios();
});


// MOSTRAR USUARIOS EN PANTALLA
function mostrarUsuarios() {
    listaUsuariosDIV.innerHTML = ""; // limpiar

    usuarios.forEach((user, index) => {
        let div = document.createElement("div"); //creo un div por usuario
        div.textContent = `${user.nombre} (${user.email})`;
        div.className = "usuario";

        // Evento para seleccionar usuario
        div.addEventListener("click", () => seleccionarUsuario(index));

         // ------------------- BOTÓN ELIMINAR -------------------
        let btnEliminar = document.createElement("button"); //creo un botón eliminar por cada usuario 
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn btn-danger btn-sm";
        btnEliminar.style.marginLeft = "10px";

        // Evento click en eliminar
        btnEliminar.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita seleccionar usuario al eliminar

            // Mensaje simple de confirmación
            let seguro = confirm("¿Quieres eliminar al usuario " + user.nombre + "?");

            if (seguro) {
                // Si confirma, eliminar usuario
                usuarios.splice(index, 1);
                guardarEnLocalStorage();
                mostrarUsuarios();

                // Limpiar selección y tareas si el usuario eliminado era el activo
                if (usuarioSeleccionado === user) {
                    usuarioSeleccionado = null;
                    usuarioActivoP.textContent = "Ningún usuario seleccionado";
                    listaTareasUL.innerHTML = "";
                }
            }
        });

        // Añado botón al div del usuario
        div.appendChild(btnEliminar);

        listaUsuariosDIV.appendChild(div);
    });
}


// SELECCIONAR USUARIO
function seleccionarUsuario(index) {
    usuarioSeleccionado = usuarios[index];

    usuarioActivoP.textContent = 
        "Usuario activo: " + usuarioSeleccionado.nombre;

    mostrarTareas();
}

function mostrarResultado(texto){
    document.getElementById("resultado").innerHTML = texto;
}

// AGREGAR UNA TAREA
btnAgregarTarea.addEventListener("click", () => {

    if (!usuarioSeleccionado) {
        //alert("Selecciona un usuario primero");
        mostrarResultado("Selecciona un usuario primero");
        return;
    }

    if (inputTarea.value.trim() === "") {
        //alert("Escribe una tarea");
        mostrarResultado("Escribe una tarea");
        return;
    }

    usuarioSeleccionado.tareas.push(inputTarea.value);

    inputTarea.value = "";

    guardarEnLocalStorage(); //localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarTareas();
});


// MOSTRAR TAREAS
function mostrarTareas() {

    listaTareasUL.innerHTML = "";

    usuarioSeleccionado.tareas.forEach((t, index) => {

        let li = document.createElement("li");
        li.textContent = t;

        // Evento de marcar como completada
        li.addEventListener("click", () => {
            alert("Tarea completada: " + t);
            usuarioSeleccionado.tareas.splice(index, 1);
            mostrarTareas();
            guardarEnLocalStorage();
        });

        listaTareasUL.appendChild(li);
    });
}


// GUARDAR ESTADO EN localStorage
function guardarEnLocalStorage() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// CARGAR DATOS AL INICIAR
window.addEventListener("load", () => {
    let datos = localStorage.getItem("usuarios");

    if (datos) {
        usuarios = JSON.parse(datos);
        mostrarUsuarios();
    }
});
