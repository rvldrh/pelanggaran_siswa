const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const md5 = require("md5");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("140533601726");
const user = require('./user')
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = require("./koneksi");

const validateToken = () => {
  return (req, res, next) => {
    if (!req.get("token")) {
      res.json({
        message: "access forbidden",
      });
    } else {
      let token = req.get("token");

      let decryptToken = cryptr.decrypt(token);

      let sql = "select * from siswa where ?";

      let param = { id_user: decryptToken };

      db.query(sql, param, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
          next();
        } else {
          res.json({
            message: "invalid token",
          });
        }
      });
    }
  };
};

app.get("/", validateToken(), (req, res) => {
  let sql = "select * from siswa";
  db.query(sql, (error, result) => {
    let respon = null;
    if (error) {
      respon = {
        message: error.message,
      };
    } else {
      respon = {
        count: result.length,
        siswa: result,
      };
    }
    res.json(respon);
  });
});

app.get("/:id", (req, res) => {
  let data = {
    id_siswa: req.params.id,
  };
  let sql = "select * from siswa where ?";
  db.query(sql, data, (error, result) => {
    let respon = null;
    if (error) {
      respon = {
        message: error.message,
      };
    } else {
      respon = {
        count: result.length,
        siswa: result,
      };
    }
    res.json(respon);
  });
});

app.post("/", (req, res) => {
  let data = {
    nis: req.body.nis,
    nama_siswa: req.body.nama_siswa,
    kelas: req.body.kelas,
    poin: req.body.poin,
  };
  let sql = "insert into siswa set ?";
  db.query(sql, data, (error, result) => {
    let respon = null;
    if (error) {
      respon = {
        message: error.message,
      };
    } else {
      respon = {
        message: result.affectedRows + " data inserted",
      };
    }
    res.json(respon);
  });
});

app.put("/", (req, res) => {
  let data = [
    {
      nis: req.body.nis,
      nama_siswa: req.body.nama_siswa,
      kelas: req.body.kelas,
      poin: req.body.poin,
    },
    {
      id_siswa: req.body.id_siswa,
    },
  ];

  let sql = "update siswa set ? where ?";
  db.query(sql, data, (error, result) => {
    let respon = null;
    if (error) {
      respon = {
        message: error.message,
      };
    } else {
      respon = {
        message: result.affectedRows + " data updated",
      };
    }
    res.json(respon);
  });
});

app.delete("/:id", (req, res) => {
  let data = {
    id_siswa: req.params.id,
  };
  let sql = "delete from siswa where ?";
  db.query(sql, data, (error, result) => {
    let respon = null;
    if (error) {
      respon = {
        message: error.message,
      };
    } else {
      respon = {
        message: result.affectedRows + " data deleted",
      };
    }
    res.json(respon);
  });
});

module.exports = app;
