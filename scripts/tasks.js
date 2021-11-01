//Si el usuario no existe lo sacamos.
const jwt = localStorage.getItem('jwt');
if (!jwt) {
    location.replace('/')
}
const arrayTareas = [];

const apiBaseUrl = 'https://ctd-todo-api.herokuapp.com/v1';
const apiUrlTareas = 'https://ctd-todo-api.herokuapp.com/v1/tasks'


window.addEventListener("load", function () {
    
    const jwt = localStorage.getItem('jwt');

    const formulario = this.document.forms[0];
    const inputNuevoTarea = document.querySelector("#nuevaTarea")
    const nodoNombreUsuario = document.querySelector('.user-info p');

    //CERRAR SESIÓN
    const btnCerrarSesion = document.querySelector('#closeApp');
    btnCerrarSesion.addEventListener('click', function () {
        let confirma = confirm("¿Quiere cerrar sesión?")
        if (confirma) {
            localStorage.clear();
            location.replace('/index.html');
            alert("Se cerró sesión correctamente.")
        }
    })

    //funcines que se disparan al cargar la págna
    obtenerNombre(apiBaseUrl + "/users/getMe", jwt);

    //PONIENDO LAS TAREAS QUE YA ESTABAN EN EL LISTADO
    consultarTareas(apiUrlTareas, jwt)

    //funciones que se mandan al terminar el forms
    formulario.addEventListener('submit', function (e) {
        e.preventDefault();
        const payload = {
            description: inputNuevoTarea.value.trim(),
        }

        // SI EL NOMBRE DE LA TAREA TA EN BLANCO QUE NO SE PUEDA MANDAR
        if (payload.description != "") {
            crearNuevaTarea(apiUrlTareas, jwt, payload);
        } else {
            alert('No se puede añadir la tarea porque está vacía.')
        }
        //AGREGANDO LAS TAREAS NUEVAS
        consultarTareas(apiUrlTareas, jwt)

        // BLANQUEANDO FORMULARIO
        formulario.reset();
    })

    //
    function obtenerNombre(url, token) {

        settings = {
            headers: {
                'authorization': token,
            },
            method: 'GET'
        }

        fetch(url, settings)
            .then(respuesta => respuesta.json())
            .then(data => {
                console.log(data);
                nodoNombreUsuario.innerText = data.firstName;
            })
    }

    // CREANDO NUEVA TAREA
    function crearNuevaTarea(url, token, payload) {

        const settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
            body: JSON.stringify(payload)
        }

        fetch(url, settings)
            .then(response => {
                console.log(response);
                return response.json()
            })
            .then(data => {
                console.log(data);
                consultarTareas(apiUrlTareas, jwt);
            }
            )
    }

    // OBTENIENDO LISTADO DE TAREAS GET
    function consultarTareas(url, token) {
        settings = {
            headers: {
                'authorization': token,
            },
            method: 'GET'
        }

        fetch(url, settings)
            .then(respuesta => respuesta.json())
            .then(tareas => {
                console.log(tareas);

                const skeleton = document.querySelector('#skeleton');
                if (skeleton) {
                    skeleton.remove();
                }
                arrayTareas.push(tareas);
                renderizarTareas(tareas);
                cambioEstado();
                borrarTarea();
            })
            .catch(error => console.log(error));
    }

    // RENDERIZANDO TAREAS EN EL HTML
    function renderizarTareas(array) {

        const tareasPendientes = document.querySelector('.tareas-pendientes');
        const tareasTerminadas = document.querySelector('.tareas-terminadas');
        tareasPendientes.innerHTML = "";
        tareasTerminadas.innerHTML = "";

        array.forEach(element => {
            let fecha = new Date(element.createAt);

            if (!element.completed) {
                tareasPendientes.innerHTML += `
                <li class="tarea">
                    <div class="not-done change" id="${element.id}">
                    </div>
                        <div class="descripcion">
                        <p class="nombre">${element.description}</p>
                        <p class="timestamp"><i class="farfa-calendar-alt"></i>${element.createdAt}</p>
                    </div>
                </li>
            `
            } else {
                tareasTerminadas.innerHTML += `
                <li class="tarea">
                    <div class="done"></div>
                    <div class="descripcion">
                        <p class="nombre">${element.description}</p>
                        <div>
                        <button><i id="${element.id}" class="fas fa-undo-alt change"></i></button>
                        <button><i id="${element.id}" class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </li>
                `
            }
        })
        cambioEstado();
        borrarTarea();
    }

    // BOTON CAMBIO DE ESTADO
    function cambioEstado() {
        const btnCambioEstado = document.querySelectorAll('.change');

        btnCambioEstado.forEach(boton => {
            boton.addEventListener('click', function (e) {
                const id = e.target.id;
                const url = `${apiBaseUrl}/tasks/${id}`
                const payload = {};

                if (e.target.classList.contains('fa-undo-alt')) {
                    payload.completed = false;
                } else {
                    payload.completed = true;
                }

                const settingsCambio = {
                    method: 'PUT',
                    headers: {
                        "Authorization": jwt,
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
                fetch(url, settingsCambio)
                    .then(response => {
                        console.log(response.status);
                        //renderizar nuevamente las tareas con el cambio hecho
                        consultarTareas(apiUrlTareas, jwt);
                    }).catch(error => {
                        console.log(error);
                    })
            })
            
        });
    }

    //BOTON BORRAR TAREA
    function borrarTarea() {
        const btnBorrarTarea = document.querySelectorAll('.fa-trash-alt');
        btnBorrarTarea.forEach(boton =>
            boton.addEventListener('click', function (e) {
                const id = e.target.id;

                const settingsBorrar = {
                    method: 'DELETE',
                    headers: {
                        "Authorization": jwt,
                    }
                }
                fetch(`${apiUrlTareas}/${id}`, settingsBorrar)
                    .then(response => {
                        console.log(response.status);
                        //renderizar nuevamente las tareas sin la borrada
                        consultarTareas(apiUrlTareas, jwt);
                    }).catch(error =>
                        console.log(error));
            }))
    }
})


