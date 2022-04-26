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
        const orderCollection = client.db('urbanCar').collection('order');

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

        //  POST api for receiving data from client side
        app.post('/service', async(req, res) => {

            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        //  DELETE api to deleting data from the database

        app.delete('/service/:id', async(req , res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};

            const result = await(serviceCollection.deleteOne(query));

            res.send(result);
        });



        //   ORDER COLLECTION API 

        app.post('/order', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        //  Get order from the database

        app.get('/order', async(req, res) => {
            const email = req.query.email;
            // console.log(email);

            const query = {userEmail: email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });



    }
    finally {

    }


};



run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running genious server well');
})





app.listen(port, () => {
    console.log('Listening to port ,', port)
})