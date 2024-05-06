const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const app = express()
const db = require("./routes/koneksi")
const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

// Mengambil module dari folder ro
const user = require('./routes/user')
const siswa = require('./routes/siswa')
const pelanggaran = require('./routes/pelanggaran')
const pelanggaran_siswa = require('./routes/pelanggaran_siswa')
const detail_pelanggaran_siswa = require('./routes/detail_pelanggaran_siswa')

app.use("/user", user)
app.use("/siswa", siswa)
app.use("/pelanggaran", pelanggaran)
app.use("/pelanggaran_siswa", pelanggaran_siswa)
app.use("/detail_pelanggaran_siswa", detail_pelanggaran_siswa)


app.listen(port, ()=>{
    console.log("Running "+port)
})  