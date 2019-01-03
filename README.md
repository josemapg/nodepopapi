# Nodepop

Este proyecto contiene el desarrollo de la API de la aplicación **Nodepop**. Esta API va a ser consumida por diferentes aplicaciones, entre otras una aplicación iOS y Android.

# Descripción

Cada anuncio mostrará los siguientes datos:

* **Tipo anuncio**. Será se vende o se busca, dependiendo de si se quiere vender o si por contra se busca el artículo publicado.
* **Nombre del artículo**. Un anuncio siempre tendrá un solo artículo.
* **Precio**. Será el precio del artículo en caso de ser una oferta de venta. En caso de que sea un anuncio de ‘se busca’ será el precio que el solicitante estaría dispuesto a pagar.
* **Foto del artículo**. Cada anuncio tendrá solo una foto.
* **Tags del anuncio**. Podrá contener uno o varios de estos cuatro: work, lifestyle, motor y mobile.


> **2018-12-19** *En Fase I. Lanzamiento*
>
>En la primera fase de lanzamiento los usuarios no podrán subir anuncios. Sólo podrán consultar los anuncios precargados.


**El API solo devolverá anuncios a usuarios registrados.** Los usuarios tendrán que registrarse con los datos siguientes:
* Nombre
* Email
* Contraseña. 

# Operaciones que debe realizar el API:

* **Registro.** (nombre, email, contraseña)
* **Autenticación.** (email, contraseña)
* **Lista de anuncios paginada.** Con filtros por tag, tipo de anuncio (venta o búsqueda), rango de precio (precio min. y precio max.) y nombre de artículo (que empiece por el dato buscado)
* **Lista de tags existentes**

# Instalación de la aplicación

La gestión de paquetes se ha realizado con `yarn`, y se requiere tener una versión actual que soporte el comando `audit` embebido en parte de los scripts.

* Instalación de la aplicación
```bash
$ yarn install
```

* Arrancar servidor de desarrollo (nodemon)
```bash
$ yarn start
```

* Arrancar en modo producción en modo cluster
```bash
$ yarn startProductionCluster
```
para gestionar el cluster se han definido además los comandos siguientes como scripts:
* `reloadProductionCluster`: Reinicio con 0-downtime
* `stopProductionCluster`: Para cluster, por completo
* `listProductionCluster`: Información reducida del cluster
* `monitorProductionCluster`: Monitor información ampliada
* `logsProductionCluster`: Visualización logs

Por último, si se requiere cambiar alguna variable entorno utilizar el fichero `ecosystem.config.js` y rearrancar para tomar los cambios.

Para dejar el directorio en el estado inicial de descargar utilizar el siguiente script:
```bash
$ yarn clean
```

Se ha configurado un precommit donde se realizan un audit sobre los paquetes y también una verificación de las reglas definidas en Standard JS Style, si esta acción se quiere utilizar por separado utilizar el siguiente script:
```bash
$ yarn checks
```

Si solo se desea realizar un chequeo de estilo entonces utilizar:
```bash
$ yarn standard
```

Por último, si se desea arreglar automáticamente determinados errores de estilo entonces utilizar:
```bash
$ yarn standard-fix
```

Por defecto, el sistema espera que la DB esté arrancada en `localhost` y en el puerto estándar `27017`.

# Documentación API
Se incluye un fichero exportado de POSTMAN con todas las llamadas que se han implementado: registro, autenticación BASIC para obtener un JWT y recuperación de anuncios.

Importar el fichero en POSTMAN y levantar el servidor para comenzar a probar.

# Generar documentación de código
Se ha integrado JsDoc para generarla hay que ejecutar el siguiente script:

```bash
$ yarn jsdoc
```

Bajo el directorio `docs` se puede encontrar la documentación autogenerada. Para borrar el folder de documentación usar el siguiente script:

```bash
$ yarn cleanDocs
```

