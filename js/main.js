// Definimos algunos botones y variables.

// Sintaxis abreviada para definir varias variables, atención a las comas.

var btn_cargar = document.getElementById('btn_cargar_usuarios'),
    error_box = document.getElementById('error_box'),
    tabla = document.getElementById('tabla'),
    loader = document.getElementById('loader');

// Definición de variables que por el momento no usaremos. Es una buena práctica que en el inicio del documento definamos todas las variables aunque no le asignemos ningún valor.

var usuario_nombre,
    usuario_edad,
    usuario_pais,
    usuario_correo;

// Creamos una función que vamos a cargar posteriormente.
// Es la función más importante de nuestra página.
// Vamos a trabajar con todo el código visto con anterioridad para cargar los usuarios, trabajar con AJAX, las peticiones, etc.

function cargarUsuarios(){
    // alert(); // Lo ponemos para comprobar que todos funciona correctamente.

    // Cuando pulsamos en "Cargar usuarios" quiero traer toda la información pero desde 0, antes esto no sucedia así.
    // Conforme pulsábamos el botón iba cargando consecutivamente y repetidamente los datos.
    // Queremos que cada vez que pulsemos nuestra tabla se reincie.
    // La copiamos del index.html y quitamos los espacios dejándolo en una sola línea.
    // Entonces cada vez que hacemos cargarUsuarios() estamos cargando esta parte de código html.

    tabla.innerHTML = '<tr><th>Id</th><th>Nombre</th><th>Edad</th><th>País</th><th>Correo</th></tr>';

    // Ahora trabajamos con AJAX.

    var peticion = new XMLHttpRequest();
    peticion.open('GET', 'php/leer-datos.php') // Es el que nos va a dar los datos de la bdd.

    // Ahora tenemos que ejecutar nuestro spiner.

    loader.classList.add('active');

    // ¿Qué pasa cuando nuestra información carga?, ¿cómo la vamos a mostrar en pantalla?
    // Este onload nos permite ejecutar una función cuando la información ya está cargada, ya hemos recibido respuesta.
    // Con responseText obtenemos los datos del usuario.
    // Podríamos hacer un console.log(peticion.reponseText) y en consola al presionar el botón de "Cargar usuarios" nos mostraría todos los datos de la bdd.
    // Guardamos los datos en una variable.
    // Además esos datos eran texto y los tenemos que transformar en un archivo JSON para poder trabajar con ellos.

    peticion.onload = function(){
        var datos = JSON.parse(peticion.responseText);

        // Comunicación de errores como error de conexión con la bdd porque los datos de conexión como el nombre del usuario son incorrectos.

        if(datos.error){ // Si datos.error existe, es decir, es true, entonces ejecutamos el código dentro de {}
            error_box.classList.add('active'); // Nos saltará una franja roja con el error.
        } else { // Aquí es la ejecución del código para mostrar todo en pantalla.
            for(var i = 0; i < datos.length; i++){
                var elemento = document.createElement('tr'); // Creamos una fila.
                elemento.innerHTML += ("<td>" + datos[i].id + "</td>");
                elemento.innerHTML += ("<td>" + datos[i].nombre + "</td>");
                elemento.innerHTML += ("<td>" + datos[i].edad + "</td>");
                elemento.innerHTML += ("<td>" + datos[i].pais + "</td>");
                elemento.innerHTML += ("<td>" + datos[i].correo + "</td>");

                // Todos estos valores los estamos guardando dentro de la variable elemento que es una fila (tr).
                // La fila la tenemos que adjuntar en nuestra tabla.
                
                tabla.appendChild(elemento);
            }
        }
    }

    // Tenemos que comprobar el estado de nuestra petición.
    // Cada vez que haya un cambio en nuestra aplicación ejecutaremos una función.
    // Esta función comprueba si todo está correcto y los datos fueron enviados y recibidos correctamente.

    peticion.onreadystatechange = function(){
        if(peticion.readyState == 4 && peticion.status == 200){
            loader.classList.remove('active');
        }
    }

    // Ya hemos preparado la petición pero ahora la debemos de enviar.

    peticion.send();
}

function agregarUsuarios(e){ // Esta función se ejecuta cada vez que el usuario presiona el botón "Agregar" y entonces se envia el formulario. No queremos que se envie, para ello utilizamos el e.preventDefault()
    e.preventDefault(); // Esto lo hacemos porque yo quiero que se envie el formulario cuando yo quiera y no simplemente porque el usuario presionó en "Agregar".

    var peticion = new XMLHttpRequest();
    peticion.open('POST', 'php/insertar-usuario.php');

    // Ahora queremos obtener los datos del formulario y queremos hacer una pequeña limpieza.

    usuario_nombre = formulario.nombre.value.trim(); // Queremos que los espacios al incio y final me los borre.
    usuario_edad = parseInt(formulario.edad.value.trim()); // Lo convertimos en entero.
    usuario_pais = formulario.pais.value.trim();
    usuario_correo = formulario.correo.value.trim();

    // Ya tenemos los datos del formulario en variables, que se está ejecutando cuando agregarUsuarios que a su vez se ejecuta cuando enviamos los datos del formulario.
    // Todavía no hemos validado si el formulario es correcto, si el usuario envió información o no.

    if(formulario_valido()){ // Nos devolverá esta función true o false dependiendo de si el formulario se validó correctamente.
        error_box.classList.add('remove'); // Esto lo hacemos para eliminar un mensaje de error previo que nos pudiera haber saltado si hubiesemos tratado de agregar un usuario incorrectamente (hubiesemos dejado un campo del formulario vacío pendiente de rellenar). 
    
        // Ahora queremos enviar los datos correctos de JS a PHP.

        // var parametros = 'nombre=Carlos&edad=23&pais=Mexico&correo=test@test.com'; // Así es como se enviarán los datos, pero estos datos son fijos y queremos que sea dinámico

        // Concatenamos las variables:
        
        var parametros = 'nombre='+ usuario_nombre +'&edad='+ usuario_edad +'&pais='+ usuario_pais +'&correo='+ usuario_correo +'';

        // parametros será la variable que llevaremos desde JS a PHP.

        peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Establecemos el header de cómo queremos enviar nuestra petición.

        loader.classList.add('active'); // Porque queremos enseñar nuestro loader (spinner).

        peticion.onload = function(){ // cargar la información procesada por PHP y recibida en nuestro JS.
            cargarUsuarios(); // Cargamos todos los usuarios cuando presionamos "Agregar" pero ya con el nuevo valor.
            formulario.nombre.value = ''; // Cuando le demos a "Agregar" el formulario se limpiará.
            formulario.edad.value = '';
            formulario.pais.value = '';
            formulario.correo.value = '';
        }

        peticion.onreadystatechange = function(){ // Comprobamos que todo esté correcto antes de enviar el formulario. Es una función que se ejecuta cada vez que el estado cambia.
            if(peticion.readyState == 4 && peticion.status == 200){
                loader.classList.remove('active'); // El spinner lo quitamos cuando la información es correcta y nuestro readyState sea 4 (hayamos recibido la información y está todo correcto) y el status es 200 (está ok).
            }
        }

        peticion.send(parametros); // Enviamos los parametros de JS a PHP mediante send, cuando recibiamos datos no era necesario.
        // Ésta línea es la más importante para enviar nuestra información de JS a PHP.

    } else { // Si tenemos un error queremos enseñar un mensaje.
        error_box.classList.add('active');
        error_box.innerHTML = 'Por favor, completa el formulario correctamente.';
    }
}

// Queremos que cuando pulsemos el botón de "Cargar usuarios" se nos active una función.
// Se va a ejecutar cuando le demos click al botón y ejecutará una función.
// Dentro ejecutará otra función.

btn_cargar.addEventListener('click', function(){
    cargarUsuarios();
});

// Hacemos un addEventListener para cuando hacemos el submit, es decir, enviamos los datos.

formulario.addEventListener('submit', function(e){ // El parámetro e lo utilizaremos a continuación.
    agregarUsuarios(e); // Esta función será la que se encargue de todos el proceso de agregar usuarios. El parametro e es el evento de nuestro addEventListener.
});

function formulario_valido(){
    if(usuario_nombre == ''){
        return false;
    } else if(isNaN(usuario_edad)){ // Nos devuelve si no es un número.
        return false;
    } else if(usuario_pais == ''){
        return false;
    } else if(usuario_correo == ''){
        return false;
    }

    return true;
}