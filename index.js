const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
var crypto = require("crypto")

const { Productos,
    Usuarios,
    Orden,
    Orden_Producto,
    PC_Armado_Producto,
    PC_Armado,
    Reporte,
    Resena } = require("./dao");
const { Sequelize } = require("sequelize");
const { stringify } = require("querystring");


const app = express();
const PORT = 8888;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cors());

/*INICIO ENDPOINTS PARA OBTENER DATOS TOTALES*/
//obtener todas las ordenes

app.get("/ordenes", async (req, resp) => {
    const listaOrdenes = await Orden.findAll()
    resp.send(listaOrdenes)
})

app.get("/ordenes_productos", async (req, resp) => {

    try {
        const orden_id = req.query.orden
        if (orden_id !== undefined) {
            const listaProductoOrdenes = await Orden_Producto.findAll({
                where: {
                    Orden_ID: orden_id
                }
            })
            resp.send(listaProductoOrdenes)
        }

    } catch (error) {
        console.log("NO EXISTE LA ORDEN ASOCIADA")
    }
})


/*select * from public."producto"
inner join public."orden_producto"
on public."producto"."Producto_ID" = public."orden_producto"."Producto_ID"*/
app.get("/cart", async (req, resp) => {
    try {
        const orden_id = req.query.orden
        const productos = await Orden_Producto.findAll({
            include: Productos,
            where: {
                Orden_ID: orden_id
            }
        })
        resp.send(productos)

    } catch (error) {
        resp.send("ERROR")
    }
})

//obtener todas las pcs armadas
app.get("/pc_armados", async (req, resp) => {
    const listaPcArmados = await PC_Armado.findAll()
    resp.send(listaPcArmados)
})

//obtener productos asociados a una pc armada
app.get("/productos_pc_armados", async (req, resp) => {
    const listaProductosPcArmados = await PC_Armado_Producto.findAll()
    resp.send(listaProductosPcArmados)
})

//obtener todos los productos
app.get("/productos", async (req, resp) => {
    try {
        const producto_id = req.query.id

        if (producto_id === undefined) {
            const listadoProductos = await Productos.findAll()
            resp.send(listadoProductos)
        }
        else {
            const productosFiltrados = await Productos.findAll({
                where: {
                    Producto_ID: producto_id
                }
            })
            resp.send(productosFiltrados)
        }
    } catch (error) {
        console.log("error en la consulta")
    }


})

//obtener todos los reportes
app.get("/reportes", async (req, resp) => {
    const listadoReportes = await Reporte.findAll()
    resp.send(listadoReportes)
})

//obtener todas las reseñas
app.get("/resenas", async (req, resp) => {
    const listaResenas = await Resena.findAll()
    resp.send(listaResenas)
})

//obtener todos los usuarios
app.get("/usuarios_all", async (req, resp) => {
    const listaUsuarios = await Usuarios.findAll()
    resp.send(listaUsuarios)
})

//obtener usuario por correo
app.get("/usuarios", async (req, resp) => {
    try {
        const correo = req.query.correo
        const listaUsuarios = await Usuarios.findAll({
            where: {
                Correo: correo
            }
        })
        resp.send(listaUsuarios)

    } catch (error) {
        resp.send("error al obtener usuario")
    }
})

/*FIN DE ENDPOINTS PARA OBTENER DATOS TOTALES*/



/*ENDPOINT PARA INSERTAR DATOS EN LAS TABLAS*/
//crear nuevo usuario
//recibir data en cuerpo de petición POST
//request: 
/*{
    "firstName" : "nombreprueba",
    "lastName" : "apellidoprueba",
    "password" : "passwordprueba",
    "email" : "emailprueba"
}*/
app.post("/create_user", async (req, resp) => {

    const dataRequest = req.body
    const firstName = dataRequest.firstName
    const lastName = dataRequest.lastName
    const email = dataRequest.email
    const password = dataRequest.password

    const createuserid = crypto.randomUUID()

    if (firstName == null || firstName == undefined) {
        resp.send({ error: "ERROR: Debe enviar un first name" })
    }

    if (lastName == null || lastName == undefined) {
        resp.send({ error: "ERROR: Debe enviar un last Name" })
    }

    if (email == null || email == undefined) {
        resp.send({ error: "ERROR: Debe enviar un email" })
    }

    if (password == null || password == undefined) {
        resp.send({ error: "ERROR: Debe enviar un password" })
    }

    const listaUsuarios = await Usuarios.findAll({
        where : {
            Correo : email
        }
    })

    if (listaUsuarios.length > 0) {
        resp.send({
           error: "EL CORREO YA EXISTE"
        })
        return
    }
    try {
        await Usuarios.create({
            Usuario_ID: createuserid,
            Nombre: firstName,
            Apellido: lastName,
            Correo: email,
            Contraseña: password,
            Direccion: null,
            Departamento: null,
            Ciudad: null,
            Codigo_Postal: null,
            Telefono: null
        })
    } catch (error) {
        resp.send({
            error: `ERROR.${error}`
        })
        return
    }
    resp.send({
        error: ""
    })

})

app.listen(PORT, () => {
    console.log(`Servidor web iniciado en puerto: ${PORT}`)
})