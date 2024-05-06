const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const app = express()
const md5 = require("md5")
const Cryptr = require("cryptr")
const cryptr = new Cryptr("140533601726")

const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const db = require("./koneksi")


validateToken = () => {
    return (req,res,next) => {
        if(!req.get("token")){
            res.json({
                message: "acces forbiden"
            })
        }
        else{
            let token = req.get("token")

            let decryptToken = cryptr.decrypt(token)

            let sql = "select * from user where ?"

            let param = {id_user: decryptToken}

            db.query(sql, param, (error,result)=>{
                if(error) throw error

                if(result.length > 0){
                    next()
                }
                else{
                    res.json({
                        message: "invalid token"
                    })
                }
            })
        }
    }
}

app.get("/", validateToken(), (req,res)=>{
    let sql = "select * from user"
    db.query(sql, (error, result)=>{
        let respon = null
        if(error){
            respon = {
                message: error.message
            }
        }
        else{
            respon = {
                count: result.length,
                user: result
            }
        }
        res.json(respon)
    })

    
})

app.get("/" ,(req, res)=>{
    let sql = "select * from user"
    db.query(sql, (error, result)=>{
        let respon = null
        if(error){
            respon = {
                message: error.message
            }
        }
        else{
            respon = {
                count: result.length,
                user: result
            }
        }
        res.json(respon)
    })
})

app.get("/:id", (req,res)=>{

    let data = {
        id_user: req.params.id
    }
    let sql = "select * from user where ?"

    db.query(sql, data, (error, result) =>{
        let respon = null
        if(error){
            respon = {
                message: error.message
            }
        }
        else{
            respon = {
                count: result.length,
                user: result
            }
        }
        res.json(respon)
    })

})

app.post("/", (req, res)=>{
    let data = {
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: md5(req.body.password)
    }
    let sql = "INSERT INTO user SET ?"
    db.query(sql, data, (error, result)=>{
        let respon = null
        if(error){
            respon = {
                message: error.message
            }
        }
        else{
            respon = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(respon)
    })

})
app.post("/auth", (req,res)=>{
    console.log(req.query)
    let param = [
        req.query.username,
        md5(req.query.password)
    ]

    let sql = "select * from user where username = ? and password = ?"

    db.query(sql,param, (error,result)=>{
        if(error) throw error

        if(result.length > 0){
            res.json({
                message: "Logged",
                token: cryptr.encrypt(result[0].id_user),
                data: result
            }) 
        }
        else{
            res.json({
                message: "invlalid username/password",
                messageR: result.length
            })
        }

    })
})


app.put("/", (req,res)=>{
    let data = [{
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: req.body.password
    },
    {
        id_user: req.body.id_user
    }]
    let sql = "update user set ? where ?"
    db.query(sql, data, (error, result)=>{
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

app.delete("/:id", (req,res)=>{
    let data = {
        id_user: req.params.id
    }
    let sql = "delete from user where ?"
    db.query(sql, data, (error, result)=>{
        let respon = null
        if(error){
            respon = {
                message: error.message
            }
        }
        else{
            respon = {
                message: result.affectedRows + "data deleted"
            }
        }
        res.json(respon)
    })
})

module.exports = app