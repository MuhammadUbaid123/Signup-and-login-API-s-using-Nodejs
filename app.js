require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require("body-parser")


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/* Database */
const connectDB = require("./db/connect")


app.use(express.static('public'))
/* ROutes of API's */
const signLog = require('./routes/auth-route')

app.use('/api/v1/', signLog)


// This should be the last route else any after it wont work
app.use('*', (req, res, next) => {
 
  next({
    status_code:404,
    type: "Error",
    message: "Api endpoint doesn't exist!"
  });

});


// This should be the last route else any after it wont work
app.use('*', (err, req, res, next) => {
  res.status(err.status_code).json({
    status_code: err.status_code,
    success: err.type,
    message: err.message,
    data:null
  
  });
});



const port = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.send('Hello World')
})

const start = async () =>{
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () =>{
        console.log(`Server is listening on port ${port}...`)
      })
    } catch (error) {
      console.log(error);
    }
}


start()