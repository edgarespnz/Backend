const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
var crypto = require("crypto")

const {Productos, Usuarios} = require("./dao")


const app = express();
const PORT = 8888;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(cors());

app.get("/productos", async(req,resp)=>{
    const listadoProductos = await Productos.findAll()
    resp.send(listadoProductos)
})


//verificar que usuario existe por correo electronico

app.get("/usuarios", async(req,resp)=>{
    const listaUsuarios = await Usuarios.findAll()
    resp.send(listaUsuarios)
})

//crear nuevo usuario

app.post("/create_user", async(req,resp)=>{
    const option = req.query.opcion;
    const nombre = req.query.nombre;
    const correo = req.query.correo;
    const contrasena = req.query.contrasena;
    
    const createuserid = crypto.randomUUID()
    try {
        if(option == "crear"){
            await Usuario.create({
                Usuario_ID : `${createuserid}`,
                Nombre: nombre,
                Apellido: apellido,
                Correo: correo,
                Contraseña : contrasena,
                Direccion: "",
                Departamento: "",
                Ciudad: "",
                Codigo_Postal : "",
                Telefono: ""
            })
        }
    } catch (error) {
        
    }
})

app.listen(PORT, ()=>{
    console.log(`Servidor web iniciado en puerto: ${PORT}`)
})