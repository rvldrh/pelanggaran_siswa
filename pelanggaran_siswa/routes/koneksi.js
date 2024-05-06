const mysql = require("mysql")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pelanggaran_siswa"
})

db.connect(error => {
    if(error){
        console.log(error.message)
    }
    else{
        console.log("Mysql Connected")
    }
})

module.exports = db