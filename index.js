const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")

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


app.get("/usuarios", async(req,resp)=>{
    const nombre = req.query.nombre;
    const apellido = req.query.apellido;

    if(nombre == undefined || apellido ==undefined){
        const listadoUsuario = await Usuarios.findAll()
        resp.send(listadoUsuario)
    }
    else{
        const listadoUsuario = await Usuarios.findAll({
            where : {
                nombre: nombre,
                apellido: apellido
            }
            
        })
        resp.send(listadoUsuario)
    }
})

app.listen(PORT, ()=>{
    console.log(`Servidor web iniciado en puerto: ${PORT}`)
})