const express = require('express')
const app = express()
const port = 5000;
const cors = require('cors');
// DBUSER= sagor
// Pass=KgEtLGhcPjztgETI
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://sagor:KgEtLGhcPjztgETI@cluster0.53ka7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try{
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");
         console.log('connected to db');


          // get api to read all notes
          app.get('/notes', async (req,res) =>{
            const q= req.query;
            console.log(q);
            const cursor = notesCollection.find(q);
            const result = await cursor.toArray()
            res.send(result);
          });
  
         // create notesTaker
         // http://localhost:5000/note

        // body {
        //   "userName": "atiq",
        //   "textData": "Hello Prithibi"
        // }
         app.post('/note',  async (req,res) =>{
           const data = req.body;
           console.log(data);
           const result = await notesCollection.insertOne(data);
           res.send(result );
         });

    //update notesTasker
    // http://localhost:5000/note/626e393eee8880e60c456970
    app.put('/note/:id', async (req,res) => {
      const id= req.params.id
      const data = req.body;
      console.log('from update', data);
      const filter = { _id: ObjectId(id)};
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          // ...data
         userName: data.userName,
         textData: data.textData,
        },
      };
      const result = await notesCollection.updateOne(filter, updateDoc, options);
      // console.log('from put method', id);
      res.send(result);
    })

    //delete note
    // http://localhost:5000/note/626e393eee8880e60c456970
    app.delete('/note/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = { _id: ObjectId(id)};
      const result = await notesCollection.deleteOne(filter);
      res.send(result);
    })
    }
   
    finally{

    }
}
run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('connected to db ');
// //   client.close();

// });


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});