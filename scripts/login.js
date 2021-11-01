/* -------------------------------------------------------------------------- */
/*                   logica aplicada en la pantalla de LOGIN                  */
/* -------------------------------------------------------------------------- */
const apiUrlLogin = "https://ctd-todo-api.herokuapp.com/v1/users/login";

window.addEventListener('load', function () {

    const formulario = this.document.forms[0];
    const inputEmail = this.document.querySelector('#inputEmail');
    const inputPassword = this.document.querySelector('#inputPassword');

    

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const validacion = validacionNoVacio(inputEmail) && validacionNoVacio(inputPassword);

        if (validacion) {
            // en caso de que esté todo correcto, iniciados la petición
            const datosUsuario = normalizacionLogin(inputEmail.value,inputPassword.value)
            fetchApiLogin(apiUrlLogin, datosUsuario);
        } else {
            console.log("Algún dato está vacío");
        }

        formulario.reset();
    });
});

//SECCIÓN DE FUNCIONES DISPONIBLES//

//function validacion
function validacionNoVacio(texto) {
    let validacion = true;
    if (texto.length == 0 || texto.lenght === "") {
        validacion = false;
    } else {
        return validacion;
    }
}

// function de normalizacion
function normalizacionLogin(email, password) {
    const usuario = {
        //trim para ambos y para email tolowercase()
        email: email.toLowerCase().trim(),
        password: password.trim()
    }
    return usuario;
}

// function consultaApi
function fetchApiLogin(url, payload) {

const settings = {
    method : 'POST',
    headers : {
        'Content-Type': 'application/json',
    },
    body : JSON.stringify(payload)
}

    fetch(url, settings)
        .then(response => {
            console.log(response);
            return response.json()
        })
        .then(data => {
            console.log(data);
            console.log(data.jwt);
            //guardar el jwt en el local storage
            // y si llega correctamente un token
            if(data.jwt){
                console.log(data)
                localStorage.setItem('jwt', data.jwt);
                location.href= '/mis-tareas.html'
            }
        })
}