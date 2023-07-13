const express = require("express");
const bcrypt = require("bcrypt")
const {StudentModel} = require("../schemas/student")
const {AdminModel} = require("../schemas/admin")
const { BatchModel } = require("../schemas/batch.model")
const router = express.Router();
const { dbUrl } = require('../common/dbconfig')
const mongoose = require('mongoose')
mongoose.connect(dbUrl)
const { hashPasswords, hashCompare, createToken } = require('../common/auth')





router.post("/adminRegister", async (req, res) => {
  try {
    let Admin = await AdminModel.findOne({ email: req.body.email })
    if (!Admin) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      let hashedPassword = await hashPasswords(req.body.password)
      req.body.password = hashedPassword
      let Admin = await AdminModel.create(req.body)

      res.status(201).send({
        message: "Admin Signup Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "Admin Alread Exists!" })
    }

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
})


router.post("/stuRegister", async (req, res) => {
  try {
    let student = await StudentModel.findOne({ email: req.body.email })
    if (!student) {

      const batchData = await BatchModel.findOne({ batchName: req.body.batchName });
      req.body.batchId = batchData._id;
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hashPasswords(req.body.password, salt);
      let hashedPassword = await hashPasswords(req.body.password)
      req.body.password = hashedPassword
      let student = await StudentModel.create(req.body)

      res.status(201).send({
        message: "student Signup Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "student Alread Exists!" })
    }

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
})


router.post("/login", async (req, res) => {
  try {
    let Admin = await AdminModel.findOne({ email: req.body.email })
    let student = await studentModel.findOne({ email: req.body.email })
    if (Admin) {

      if (await hashCompare(req.body.password, Admin.password)) {

        let token = await createToken({
          name: Admin.name,
          email: Admin.email,
          id: Admin._id,

        })
        res.status(200).send({
          message: "Admin Login Successfull!",
          token
        })
      }
      else {
        res.status(402).send({ message: "Invalid Credentials" })
      }
    }
    else {
      res.status(400).send({ message: "Admin Does Not Exists!" })
    }
    if (student) {

      if (await hashCompare(req.body.password, student.password)) {

        let token = await createToken({
          name: student.name,
          email: student.email,
          id: student._id,
          batch_id: sMail.batchId,
        })
        res.status(200).send({
          message: "student Login Successfull!",
          token
        })
      }
      else {
        res.status(402).send({ message: "Invalid Credentials" })
      }
    }
    else {
      res.status(400).send({ message: "student Does Not Exists!" })
    }

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
})
module.exports = router;