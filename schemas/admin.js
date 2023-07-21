const mongoose = require("mongoose") ;

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    requierd: true,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
},
{
  collection:'admin',
  versionKey:false
}
);


let AdminModel = mongoose.model("Admin", adminSchema);
module.exports={AdminModel}