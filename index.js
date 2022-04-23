const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();


// Middleware

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.tn8pf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();

        const serviceCollection = client.db('urbanCar').collection('service');

        //  get api to load data from database to client side
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);

            const services = await cursor.toArray();

            res.send(services);
        });

        //  get single service from database

        app.get('/service/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};

            const service = await serviceCollection.findOne(query);

            res.send(service);
        });




    }
    finally {

    }


};



run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running genious server');
})





app.listen(port, () => {
    console.log('Listening to port ,', port)
})