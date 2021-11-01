/* -------------------------------------------------------------------------- */
/*                   logica aplicada en la pantalla de SIGN-UP               */
/* -------------------------------------------------------------------------- */
const apiUrlRegister =  "https://ctd-todo-api.herokuapp.com/v1/users";

window.addEventListener('load', function () {

    const formulario = this.document.forms[0];
    const inputName = this.document.querySelector('#inputName');
    const inputLastname = this.document.querySelector('#inputLastname');
    const inputEmail = this.document.querySelector('#inputEmail');
    const inputPassword = this.document.querySelector('#inputPassword');
    const inputPassword2 = this.document.querySelector('#inputPassword2');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        var name = inputName.value;
        var lastName = inputLastname.value;
        var email = inputEmail.value;
        var password = inputPassword.value;
        var password2 = inputPassword2.value;


        const usuarioRegistrado = {
            firstName: name,
            lastName: lastName,
            email: email,
            password: password
        }

        //POST del usuario
        const payload = JSON.stringify(usuarioRegistrado);

        const settings = {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        }

        fetch(apiUrlRegister, settings)
            .then(response => response.json())
            .then(json => {
                console.log("USUARIO CREADO: ");
                console.log(payload)
                console.log(json);
                location.href= '/index.html'
            })
    })
        

    })