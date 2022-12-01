const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");

const CADENA_CONEXION = process.env.DATABASE_URL ||
    "postgresql://postgres::********@containers-us-west-111.railway.app:7719/railway"

    //"postgresql://postgres:postgres@localhost:5432/product_backlog"

const sequelize = new Sequelize(CADENA_CONEXION, {
    dialectOptions :{
        ssl : {
            require: true,
            rejectUnauthorized : false
        }
    }
})


//para las columnas createdAt y updatedAt
const timestamps = {
    timestamps: false,
    freezeTableName: true
}

//tabla productos
const Productos = sequelize.define("producto", {
    Producto_ID: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Precio: {
        type: DataTypes.NUMBER(20),
        allowNull: false
    },
    Descripcion: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    Categoria: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Url: {
        type: DataTypes.STRING(200),
        allowNull: true
    }
}, timestamps)


//tabla usuarios
const Usuarios = sequelize.define("usuario", {
    Usuario_ID: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Correo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Contraseña: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Direccion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Departamento: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Codigo_Postal: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Telefono: {
        type: DataTypes.NUMBER(100),
        allowNull: true
    }
}, timestamps)

//tabla orden
const Orden = sequelize.define("orden", {
    Orden_ID: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: sequelize.UUIDV4,
        allowNull: false
    },

    Usuario_ID: {
        type: DataTypes.UUID,
        allowNull: false

    },
    Monto: {
        type: DataTypes.FLOAT(2),
        allowNull: true
    },
    Direccion: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    Fecha: {
        type: DataTypes.DATE(),
        allowNull: false,
    }

}, timestamps)

//tabla orden_producto
const Orden_Producto = sequelize.define("orden_producto", {
    Orden_Producto_ID: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false
    },

    Orden_ID: {
        type : DataTypes.UUID,
        allowNull: true
    },
    Producto_ID :{
        type: DataTypes.UUID,
        allowNull: true
    }
},timestamps)

//tabla pc armado producto
const PC_Armado_Producto = sequelize.define("pc_armado_producto", {
    PC_Armado_Producto_ID : {
        primaryKey : true,
        type : DataTypes.UUID,
        allowNull : false,
        defaultValue : sequelize.UUIDV4
    },
    PC_Armado_ID : {
        type : DataTypes.UUID,
        allowNull : true
    },
    Producto_ID : {
        type : DataTypes.UUID,
        allowNull : true
    }
},timestamps)

//tabla pc armado
const PC_Armado = sequelize.define("pc_armado", {
    PC_Armado_ID : {
        primaryKey : true,
        type : DataTypes.UUID,
        allowNull : false,
        defaultValue : sequelize.UUIDV4
    },
    Nombre : {
        type : DataTypes.STRING(200),
        allowNull : true
    },
    Descripcion :{
        type : DataTypes.STRING(200),
        allowNull : true
    }
}, timestamps)

//tabla reseña
const Resena = sequelize.define("resena",{
    Resena_ID : {
        primaryKey : true,
        type : DataTypes.UUID,
        allowNull : false,
        defaultValue : sequelize.UUIDV4
    },
    Usuario_ID : {
        type : DataTypes.UUID,
        allowNull : false,
    },
    Puntaje : {
        type : DataTypes.NUMBER(),
        allowNull : true,
    },
    Comentario : {
        type : DataTypes.STRING(),
        allowNull : true
    },
    Link : {
        type : DataTypes.STRING(200),
        allowNull : true
    },
    Tipo_Resena : {
        type : DataTypes.STRING(200),
        allowNull : true
    }
},timestamps)

//tabla reporte
const Reporte = sequelize.define("reporte", {
    Reporte_ID : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : sequelize.UUIDV4,
        allowNull : false
    },
    Usuario_ID : {
        type : DataTypes.UUID,
        allowNull: true
    },
    Correo : {
        type : DataTypes.STRING(200),
        allowNull : true
    },
    Nombre : {
        type : DataTypes.STRING(200),
        allowNull : true
    },
    Telefono : {
        type : DataTypes.STRING(200),
        allowNull : true
    },
    Asunto : {
        type : DataTypes.STRING(200),
        allowNull : true
    },
    Descripcion : {
        type : DataTypes.STRING(200),
        allowNull : true
    }
},timestamps)

//relaciones entre tablas

// Reporte * <----> 1 Usuario
Reporte.belongsTo(Usuarios, {
    foreignKey : "Usuario_ID"
})
Usuarios.hasMany(Reporte, {
    foreignKey : "Reporte_ID"
})


// Reseña * <----> 1 Usuario
Resena.belongsTo(Usuarios, {
    foreignKey : "Usuario_ID"
})

Usuarios.hasMany(Resena, {
    foreignKey : "Resena_ID"
})

// Reporte * <----> 1 Usuario
Reporte.belongsTo(Usuarios, {
    foreignKey: "Usuario_ID"
})

Usuarios.hasMany(Reporte, {
    foreignKey: "Usuario_ID"
})


// Orden * <----> 1 Usuario
Orden.belongsTo(Usuarios, {
    foreignKey : "Usuario_ID"
})

Usuarios.hasMany(Orden, {
    foreignKey : "Orden_ID"
})


// Orden_producto * <----> 1 Orden
Orden_Producto.belongsTo(Orden, {
    foreignKey : "Orden_ID"
})

Orden.hasMany(Orden_Producto, {
    foreignKey : "Orden_ID"
})

// Producto 1 <----> * Orden_Producto
Orden_Producto.belongsTo(Productos, {
    foreignKey : "Producto_ID"
})

Orden_Producto.hasMany(Orden_Producto, {
    foreignKey : "Producto_ID"
})

// PC_Armado_Producto * <----> 1 Productos
PC_Armado_Producto.belongsTo(Productos,{
    foreignKey:"Producto_ID"
})
Productos.hasMany(PC_Armado_Producto,{
    foreignKey:"Producto_ID"
})


// PC_Armado_Producto * <----> 1 PC_Armado_Producto
PC_Armado_Producto.belongsTo(PC_Armado,{
    foreignKey:"PC_Armado_ID"
})
PC_Armado.hasMany(PC_Armado_Producto,{
    foreignKey:"PC_Armado_ID"
})


//exportacion de las tablas

module.exports = {
    Productos,
    Usuarios,
    Orden,
    Orden_Producto,
    PC_Armado_Producto,
    PC_Armado,
    Reporte,
    Resena
}