<?php

// En este caso lo que queremos es enviar datos desde el main.js al archivo php.

error_reporting(0); // De esta forma no vamos a enseñar ningún error en pantalla. Durante el desarrollo del código lo dejamos comentado para poder comprobar errores.

header('Content-type: application/json; charset=utf-8');

$nombre = $_POST['nombre']; // Recibimos nombre por el método post que es el que vamos a utilizar en main.js para recibir los datos.

// Utilizabamos get para recibir los datos pero en este caso para enviarlos vamos a utilizar post.

$edad= $_POST['edad'];
$pais = $_POST['pais'];
$correo = $_POST['correo'];

// Ahora queremos validar estos datos porque podría suceder, por ejemplo, que la edad estuviese vacía.

// Es importante que tengamos una validación tanto en JS como en PHP. JS se ejecuta del lado del cliente y PHP del lado del servidor.

function validarDatos($nombre, $edad, $pais, $correo){ // Recibe como parámetros las variables que queremos validar.
    if($nombre == ''){ // Si el nombre que estoy recibiendo es igual a una cadena vacía entonces quiero que me return false.
        return false;
    } elseif($edad == '' || is_int($edad)){ // Además la edad debe ser un entero.
        return false;
    } elseif($pais == ''){
        return false;
    } elseif($correo == ''){
        return false;
    } // Si alguno de los parámetros nos devuelve false es resto del código no se ejecuta.

    return true; // Si no se ejecuta nada de lo anterior entonces devolvemos true.
}

if(validarDatos($nombre, $edad, $pais, $correo)){ // Si nuestro formulario es válido entonces comenzamos nuestra conexión SQL y enviar los datos.
    $conexion = new mysqli('localhost:3307', 'root', '', 'curso_php_ajax');
    $conexion->set_charset("utf8"); // -> significa que quiero ejecutar un método de la variable.

    // Ya hemos hecho la conexión pero ahora queremos comprobar si hay un error.

    if($conexion->connect_errno){ // Recordar que nuestro archivo php, el cual recibirá la solicitud de JS al ser completados datos del formulario y ser clickados para enviar, va a generar un archivo JSON con esos datos que va a devolver a main.js para que sean mostrados ya incorporados en la bdd. En JS también se comprobará si ha habido algún error.
        $respuesta = ['error' => true];
    } else{ // Aquí es donde ejecutamos toda nuestra secuencia SQL
        $statement = $conexion->prepare("INSERT INTO usuarios(nombre, edad, pais, correo) VALUES (?,?,?,?)"); // Ponemos los placeholders a los que a continuación les asignamos los valores que queremos.
        // De esta forma lo que hacemos es decirle a la bdd que prepare una sentencia SQL.
        $statement->bind_param("siss", $nombre, $edad, $pais, $correo); // Aquí indicamos los valores que queremos agregar en los placeholders. Es string int string string.
        $statement->execute(); // Ahora subimos los datos a nuestra bdd.

        // Comprobamos si hay algún error, si se agregaron correctamente.
        if($conexion->affected_rows <= 0){ // Si no agregamos ninguna fila significa que hubo un error.
            $respuesta = ['error' => true];
        }

        $respuesta = []; // También podríamos poner $respuesta = ['error' => false];
    }
} else { // Quiero que mi respuesta sea un error.
    $respuesta = ['error' => true];
}

// En este caso la respuesta la utilizamos solamente en el caso de que haya un error.

echo json_encode($respuesta); // Hacemos un archivo JSON con la respuesta, si sale correcto entonces vamos a devolver una variable que realmente no existe entonces añadimos $respuesta como un array vacio donde todo es correcto.