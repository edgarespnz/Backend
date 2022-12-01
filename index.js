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
const TOKEN = "123456789"

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

//obtener productos de la pc armada
app.get("/obtener_productos_pc_armado", async (req, resp) => {
        const tipoArmado = req.query.tipo

        if (tipoArmado == "coding" || tipoArmado == undefined) {
            const listadoArmado = await PC_Armado_Producto.findAll({
                where: {
                    PC_Armado_ID: "e4d7793e-c045-4e3f-bf3c-32c882a849ce",
                },
                include: Productos
            })
            resp.send(listadoArmado)
        }

        if (tipoArmado == "gaming") {
            const listadoArmado = await PC_Armado_Producto.findAll({
                where: {
                    PC_Armado_ID: "ce865977-0168-4f2c-9de1-868755f7339c",
                },
                include: Productos
            })
            resp.send(listadoArmado)
        }

        if (tipoArmado == "office") {
            const listadoArmado = await PC_Armado_Producto.findAll({
                where: {
                    PC_Armado_ID: "e4d7793e-c045-4e3f-bf3c-32c882a849ce",
                },
                include: Productos
            })
            resp.send(listadoArmado)
        }

        if (tipoArmado == "other") {
            const listadoArmado = await PC_Armado_Producto.findAll({
                where: {
                    PC_Armado_ID: "c0162419-933f-461d-993b-0226e98534ef",
                },
                include: Productos
            })
            resp.send(listadoArmado)
        }

        if (tipoArmado == "design") {
            const listadoArmado = await PC_Armado_Producto.findAll({
                where: {
                    PC_Armado_ID: "359ed7ba-c205-4d0c-b146-00a06f3a5b22",
                },
                include: Productos
            })
            resp.send(listadoArmado)
        }

        if (tipoArmado == "rendering") {
            const listadoArmado = await PC_Armado_Producto.findAll({
                where: {
                    PC_Armado_ID: "359ed7ba-c205-4d0c-b146-00a06f3a5b22",
                },
                include: Productos
            })
            resp.send(listadoArmado)
        }


    })

//obtener la pc armada
app.post("/obtener_pc_armado", async (req, resp) => {
    const pc_armado_id = req.body.pc_armado_id

    const pc_armado = await PC_Armado.findOne({
        where: {
            PC_Armado_ID: pc_armado_id
        }
    })

    if (pc_armado == null) {
        resp.send({ error: "No se pudo obtener la pc armada" })
    }
    else {
        resp.send({ error: "", pc_armado })
    }

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
app.post("/get_user", async (req, resp) => {
    const email = req.body.email
    const password = req.body.password

    const user = await Usuarios.findOne({
        where: {
            Correo: email,
            Contraseña: password
        }
    })

    if (user == null) {
        resp.send({
            error: "El usuario no existe"
        })
    }
    else {
        resp.send({ error: "", TOKEN: TOKEN })
    }
})

//obtener producto buscado en searchBar

app.post("/obtener_producto", async (req, resp) => {
    const idProductoBuscado = req.body.idProductoBuscado

    const producto = await Productos.findOne({
        where: {
            Producto_ID: idProductoBuscado
        }
    })

    if (producto == null) {
        resp.send({ error: "el producto no existe" })
    }
    else {
        resp.send({
            error: "",
            producto: producto
        })
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
        where: {
            Correo: email
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