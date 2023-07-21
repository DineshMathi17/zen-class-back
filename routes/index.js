const express = require("express");
const bcrypt = require("bcrypt")
const { StudentModel } = require("../schemas/student")
const { AdminModel } = require("../schemas/admin")
const { BatchModel } = require("../schemas/batch.model")
const router = express.Router();
const { dbUrl } = require('../common/dbconfig')
const mongoose = require('mongoose')
mongoose.connect(dbUrl)
const jwt = require('jsonwebtoken')
const { hashPasswords, hashCompare, createToken } = require('../common/auth')


router.get('/student', async function (req, res) {
  try {
    let student = await StudentModel.find({}, { password: 0 });
    res.status(200).send({
      student,
      message: "student Data Fetch Successfull!"
    })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
});

router.get('/admin', async function (req, res) {
  try {
    let Admin = await AdminModel.find({}, { password: 0 });
    res.status(200).send({
      Admin,
      message: "Admin Data Fetch Successfull!"
    })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
});

router.post('/adminSignup', async (req, res) => {
  try {
    let admin = await AdminModel.findOne({ email: req.body.email })
    if (!admin) {

      let hashedPassword = await hashPasswords(req.body.password)
      req.body.password = hashedPassword
      let admin = await AdminModel.create(req.body)

      res.status(201).send({
        message: "Admin Signup Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "Admin Alread Exists!" })
    }

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error 500", error })
  }
})

router.post('/studentSignup',async (req, res) => {
  try {
    const stuData = await StudentModel.findOne({ email: req.body.email });

    if (!stuData) {
      const batchData = await BatchModel.findOne({ batchName: req.body.batchName });
    req.body.batchId = batchData._id;      

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;

      await StudentModel.create(req.body);
      console.log(hash, "hashed");
      res.json({ message: "Student updated" });
    } else {
      res.json({ message: "Student already exists" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const mail = await AdminModel.findOne({ email: req.body.email });
    const sMail = await StudentModel.findOne({ email: req.body.email });
    console.log(mail);
    if (mail) {
      const compare1 = await bcrypt.compare(req.body.password, mail.password);
      if (compare1) {
        const token = jwt.sign({ _id: mail._id }, process.env.JWT, {
          expiresIn: "120m",
        });

        res.json({ token: token, name: mail.username, admin: true });
      } else {
        res.json({ message: "Rejected" });
      }
    }

    if (sMail) {
      const compare2 = await bcrypt.compare(req.body.password, sMail.password);

      if (compare2) {
        const token = jwt.sign({ _id: sMail._id }, process.env.JWT, {
          expiresIn: "100m",
        });
        console.log(sMail);
        res.json({
          token: token,
          name: sMail.username,
          userId: sMail._id,
          admin: false,
          batch_id: sMail.batchId,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
