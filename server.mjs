import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { stringToHash,varifyHash} from "bcrypt-inzi"
const app = express()
const port = process.env.PORT || 3003
app.use(express.json())
app.use(cors())


const userSchema = new mongoose.Schema({
  email: {type : String, required:true},
  password : {type : String, required:true},
  createdOn : {type : Date, default:Date.now()}
});

const userModel = mongoose.model('User', userSchema);




app.post('/user', (req, res) => {
  
    let body = req.body


     if(!body.email || !body.password){
      res.status(400).send(`All Fields are required`)
      return;
     }

     
     userModel.findOne({password:body.password} , (err,data) => {

      if(!err){
  
         console.log("data :", data);

         if(data){
            console.log(" User is Already Exist :", data);
            res.status(401).send({message : "User is Already Exist"})
            return;
        }else{


          stringToHash(body.password).then(hashString => {

              
              let newUser = new userModel({

                email : body.email.toLowerCase(),
                password : hashString

              })
              newUser.save((err,result) => {
                       
                if(!err){
                  console.log("Data Saved in db", result);
                  res.status(201).send({message : "User is Signup"});
                }else{
                  console.log("db error :" , err);
                  res.status(500).send({message : "Internal Sever Error"})
                }

              })

          })
          
         }
         }else{
        console.log("db error in query", err);
        res.status(500).send({message : "Internal db error"})

      }

     })
     


  })



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



let dbURI = "mongodb+srv://abc:abc@cluster0.svkl5lr.mongodb.net/newDataBase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////