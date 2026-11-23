const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.set('port', 5500);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, Accept, X-Requested-With, Content-Type');
 
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
 
    next();
});

const uri= 'mongodb+srv://rameenibnseena_db_user:CWlbVbN9dD3QmZXz@cluster0.g34mlef.mongodb.net/'

const client= new MongoClient(uri);
let db;

async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        db= client.db('Webstore');
        app.get('/', (req, res) => {
            res.send('Select a collection, e.g., /products or /users');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        return;
    }
    app.param('collectionName', (req, res, next, collectionName) => {
        req.collection = db.collection(collectionName);
        return next();
    });
    app.get('/collections/:collectionName', async (req, res, next) => {
        try {
            const documents = await req.collection.find({}).toArray();
            res.send(documents);
        } catch (error) {
            next(error);
        }
    });

    app.post('/collections/:collectionName', async (req, res, next) => {
        try {
            const result = await req.collection.insertOne(req.body);
            res.status(201).send({
                msg: 'success',
                insertedId: result.insertedId
            });
        } catch (error) {
            next(error);
        } 
            })
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('error: server error!');
    });

    app.get('/collections/:collectionName/:id', async (req, res, next) => {
        try{
            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).send('Invalid ObjectID');
            }

            const result= await req.collection.findOne({
                 _id: new ObjectId(req.params.id) });
                 res.send(result);
        } catch (error) {
            next(error);
        }
    });

    app.put('/collections/:collectionName/:id', async (req, res, next) => {
        try{
            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).send('Invalid ObjectID');
            }
            const result= await req.collection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );
            res.send(result.matchedCount ===1 ? {msg: 'success'} : {msg: 'error'});
        }
        catch (err) {
            next(err);
        }
    });

    app.delete('/collections/:collectionName/:id', async (req, res, next) => {
        try{
            if (!ObjectId.isValid(req.params.id)) { 
                return res.status(400).send('Invalid ObjectID');
            }
            const result= await req.collection.deleteOne({
                _id: new ObjectId(req.params.id)
            });
            res.send(result.deletedCount ===1 ? {msg: 'success'} : {msg: 'error'});
        } catch (err) {
            next(err);
        }
    });

    const port = process.env.PORT || app.get('port');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();

    
