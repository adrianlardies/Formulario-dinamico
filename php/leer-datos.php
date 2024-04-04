<?php

error_reporting(0); // Si tenemos algún error JSON no se va a leer correctamente entonces como este archivo solo nos debe devolver un archivo JSON de esta forma aunque tengamos algún error no nos lo devolverá, no se mostrará y no se enviará como respuesta. Se envía como hemos especificado más abajo.
header('Content-type: application/json; charset=utf-8');

// Creamos una conexión a la bdd y traemos los datos.

$conexion = new mysqli('localhost:3307', 'root', '', 'curso_php_ajax' );

// Creamos un condicional para saber si todo está correcto.

if($conexion->connect_errno){ // Si hay algún problema con la conexión
    // die(); // Es lo que introduciriamos normalmente.
    // Vamos a traer un objeto que señale el error ya que siempre vamos a devolver algo al HTML con este archivo PHP.
    $respuesta = [
        'error' => true // De esta forma le digo que si, que hubo un error y nosotros podríamos mostrar algún mensaje tipo que no salió bien.
    ];
} else { // De otra forma indicamos lo que haremos cuando tengamos la conexión correctamente.
    $conexion->set_charset("utf8"); // Es una forma que tenemos de indicar que queremos trabajar con utf8 tanto para enviar como para recibir datos. Nuestra bdd en HeidiSQL la habiamos construido con utf8 y si nosotros no indicamos esto muchas veces podemos tener problemas con los caracteres cuando traemos los datos de la bdd. 
    $statement = $conexion->prepare("SELECT * FROM usuarios"); // Queremos traer los datos, podriamos tambien hacerlo con conexion query porque en este caso es una consulta sencilla ($conn = mysqli_connect($dato, $dato, $dato)).
    $statement->execute(); // No estamos poniendo ninguna variable (:placeholder) donde hemos puesto usuarios, los prepare statement nos permiten tenemos placeholders pero en este caso hemos puesto la tabla directamente. Simplemente ejecutamos la query (consulta).
    $resultados = $statement->get_result(); // Los resultados de la bdd los guardamos en $resultados.

    // Lo comprobamos:

    /* echo '<pre>';
    var_dump($resultados->fetch_assoc());
    echo '</pre>'; */

    // Antes de traer los resultados creamos una variable que va a ser un array, que va a ser la misma creada en caso de que la conexión nos diera error.
    // Va a ser la que vamos a utilizar para responder a AJAX.js
    // Vamos a poner dentro o transformar nuestro código en JSON.

    $respuesta = [];

    // Para llenarla lo tenemos que hacer a través de un ciclo.
    
    while($fila = $resultados->fetch_assoc()){ // Cpn fetch_assoc traemos los resultados.
        $usuario = [ // Le vamos a poner toda la información que queremos.
            'id'        => $fila['ID'],
            'nombre'    => $fila['nombre'],
            'edad'      => $fila['edad'],
            'pais'      => $fila['pais'],
            'correo'    => $fila['correo']
        ];
        // De esta forma forma creamos un array por cada uno de los resultados que tenemos.
        // Ahora creado lo que tenemos que hacer es enviarlo dentro de nuestra $respuesta = [];

        // La función tiene 2 parámetros, el array al cual le queremos agregar los arrays y el segundo es el propio array que queremos agregar.
        array_push($respuesta, $usuario);
    }
}

echo json_encode($respuesta);