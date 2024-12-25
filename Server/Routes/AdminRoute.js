import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const express = require('express');
// const con = require('./database_connection'); // pastikan sudah terkoneksi ke database


router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.get('/category', (req, res) => {
    // Pastikan query SQL ada dalam tanda kutip
    const sql = "SELECT nama FROM category"; // Query SQL yang benar
    con.query(sql, (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: err.message }); // Menangani error dengan pesan yang sesuai
      }
      res.json({ Status: true, Result: result }); // Mengembalikan hasil dalam format JSON
    });
});

  

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`nama`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})


// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public'); // Folder untuk menyimpan gambar
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Nama file unik
    },
});
const upload = multer({ storage: storage });

// Route untuk menambahkan employee
router.post('/add_employee', upload.single('gambar'), (req, res) => {
    const sql = `INSERT INTO employee 
    (nama, gambar, tanggal_mulai, tanggal_selesai, penghasilan, alamat, category_id) 
    VALUES (?)`;

        // Menyiapkan data untuk query
        const values = [
            req.body.nama,                  // Nama employee
            req.file.filename,             // Nama file gambar
            req.body.tanggal_mulai,        // Tanggal mulai
            req.body.tanggal_selesai,      // Tanggal selesai
            req.body.penghasilan,          // Penghasilan
            req.body.alamat,               // Alamat
            req.body.category_id,          // ID kategori
        ];

        // Eksekusi query
        con.query(sql, [values], (err, result) => {
            if (err) return res.json({ Status: false, Error: err.message });
            return res.json({ Status: true, Message: "Employee added successfully!" });
        });
    });




router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export { router as adminRouter };