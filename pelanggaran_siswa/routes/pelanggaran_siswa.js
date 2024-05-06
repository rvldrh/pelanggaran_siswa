const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const app = express()
const moment = require("moment")
const port = 8000
const Cryptr = require("cryptr");
const cryptr = new Cryptr("140533601726");
const user = require('./user')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())


const db = require("./koneksi")



app.get("/", validateToken(), (req,res)=>{
    let sql = "SELECT p.id_pelanggaran_siswa, p.id_siswa, p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user FROM pelanggaran_siswa p JOIN siswa s ON p.id_siswa = s.id_siswa JOIN user u ON p.id_user = u.id_user";
    db.query(sql, (error, result)=>{
        let respon = null
        if(error){
            res.json({message: error.message})
        }
 
        else{
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
        res.json(respon)
    })

    
})

app.get("/", (req,res)=>{
    let sql = "SELECT p.id_pelanggaran_siswa, p.id_siswa, p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user FROM pelanggaran_siswa p JOIN siswa s ON p.id_siswa = s.id_siswa JOIN user u ON p.id_user = u.id_user";
    db.query(sql, (error, result)=>{
        let respon = null
        if(error){
            res.json({message: error.message})
        }
 
        else{
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
        res.json(respon)
    })
})

app.get("/:id", (req, res) => {
    let id_pelanggaran_siswa = req.params.id; 

    
    let sql = "SELECT p.nama_pelanggaran, p.poin FROM detail_pelanggaran_siswa dps JOIN pelanggaran p ON p.id_pelanggaran = dps.id_pelanggaran WHERE id_pelanggaran_siswa = ?";

    db.query(sql, id_pelanggaran_siswa, (error, result) => {
        if (error) {
            res.json({ message: error.message });
        } else {
            res.json({
                count: result.length,
                detail_pelanggaran_siswa: result
            });
        }
    });
});
 
app.post("/", (req, res) => {
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    let pelanggaran = JSON.parse(req.body.pelanggaran);
  
    let sql = "INSERT INTO pelanggaran_siswa SET ?";

    db.query(sql, data, (error, result) => {
        if (error) {
            res.json({ message: error.message });
        } else { 
            let lastID = result.insertId; 
            let values = [];
            for (let index = 0; index < pelanggaran.length; index++) {
                values.push([lastID, pelanggaran[index].id_pelanggaran]);
            }
            let sqlDetail = "INSERT INTO detail_pelanggaran_siswa (id_pelanggaran_siswa, id_pelanggaran) VALUES ?";
            db.query(sqlDetail, [values], (error, result) => {
                if (error) {
                    let deleteSQL = "DELETE FROM pelanggaran_siswa WHERE id_pelanggaran_siswa = ?";
                    db.query(deleteSQL, lastID, (err, result) => {
                        if (err) {
                            res.json({ message: err.message });
                        } else {
                            res.json({ message: error.message });
                        }
                    });
                } else {
                    res.json({ message: "Data Inserted" });
                }
            }); 
        }
    });
});



app.put("/", (req, res)=>{
    let data = [{
        waktu: req.body.waktu,
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user
    },
    {
        id_pelanggaran_siswa: req.body.id_pelanggaran_siswa
    }]
    
    let sql = "update pelanggaran_siswa set ? where ?"
    db.query(sql, data, (error,result)=>{
        let respon = null
        if(error){
            respon = {
                message: error.message
            }
        }
        else{
            respon = {
                message: result.affectedRows + "data updated"
            }
        }
        res.json(respon)
    })
})

app.delete("/:id", (req, res)=>{
    let param = {id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}
    let sql = "delete from detail_pelanggaran_siswa where ?"
    db.query(sql, param, (error, result)=>{
        if(error){
            res.json({message: error.message})
        }
        else{
            let param = {id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}
            let sql = "delete from pelanggaran_siswa where ?"
            db.query(sql, param, (error,result)=>{
                if(error){
                    res.json({message: error.message})
                }
                else{
                    res.json({message: "Data ter delete "})
                }
            })
       }
    })
})


module.exports = app