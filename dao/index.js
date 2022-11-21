const {Sequelize, DataTypes} = require("sequelize");

const CADENA_CONEXION = 
"postgresql://postgres:postgres@localhost:5432/product_backlog"

const sequelize = new Sequelize(CADENA_CONEXION)

//para las columnas createdAt y updatedAt
const timestamps = {
    timestamps : false,
    freezeTableName: true
}

//alias de la tabla y de qué tabla se referencia
const Productos = sequelize.define("producto",{
    Producto_ID: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull : false
    },
    Precio: {
        type: DataTypes.NUMBER(20),
        allowNull: false
    },
    Descripcion : {
        type : DataTypes.STRING(150),
        allowNull: true
    },
    Categoria: {
        type : DataTypes.STRING(100),
        allowNull: true
    }
},timestamps)

const Usuarios = sequelize.define("usuario",{
    Usuario_ID: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull : false
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Apellido:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Correo:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Contraseña:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Direccion:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Departamento:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Ciudad:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Codigo_Postal: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Telefono : {
        type: DataTypes.NUMBER(100),
        allowNull : true
    }
},timestamps)
 

//relaciones entre tablas
module.exports = {
    Productos,
    Usuarios
}