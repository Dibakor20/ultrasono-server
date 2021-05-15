const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;


const app = express();
app.use(bodyParser.json());
app.use(cors())
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gvbem.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.send("Ultrasono Centre working")
})



client.connect(err => {
  const appointmentCollection = client.db("ultrasono").collection("appointment");
  const pescriptionCollection = client.db("ultrasono").collection("pescription");
  const patientsCollection = client.db("ultrasono").collection("patients");
  const adminCollection = client.db("ultrasono").collection("admin");
  
app.post('/allAppointment',(req,res)=>{
    const newAppointment = req.body
    appointmentCollection.insertOne(newAppointment)
    .then(result=>{
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
}) 


app.get('/appointmentList',(req,res)=>{
    appointmentCollection.find()
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.post('/addPescription', (req, res) => {
    const newPescription = req.body;
    console.log('adding new event: ', newPescription)
    pescriptionCollection.insertOne(newPescription)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.get('/pescriptionList',(req,res)=>{
    pescriptionCollection.find()
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.post('/addPatients',(req,res)=>{
    const newPatients = req.body
    patientsCollection.insertOne(newPatients)
    .then(result=>{
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
}) 

app.get('/patientsList',(req,res)=>{
    patientsCollection.find()
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.get('/myPescription',(req,res)=>{
    pescriptionCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.post('/addAdmin',(req,res)=>{
    const newAdmin = req.body
    adminCollection.insertOne(newAdmin)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
})

app.get('/admin', (req, res) => {
    adminCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
  });

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })






app.delete('/deletePescription/:id', (req, res) => {
    const id = req.params.id;
    pescriptionCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
  })

  app.delete('/deletePatient/:id', (req, res) => {
    const id = req.params.id;
    patientsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
  })


});





app.listen(process.env.PORT || 5000)