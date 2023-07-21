const mongoose = require("mongoose") ;

const answerSchema=new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },
      fesc: {
        type: String,
        required: true
      },
      besc: {
        type: String,
        required: true
      },
      fedc: {
        type: String,
        required: true
      },
      bedc: {
        type: String,
        required: true
      },
      
      date: {
        type: Date,
        default: Date.now
      }
},
{
  collection:'answer',
  versionKey:false
}
)


let AnswerModel = mongoose.model('Answer',answerSchema)
module.exports={AnswerModel}