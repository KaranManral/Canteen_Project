const configDB = async () => {
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://manga_deathNote:Hero9680@canteenproject.cxybxng.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect().then(err => {
        const collection = client.db("CanteenProject").collection("users");
        // perform actions on the collection object
        client.close();
    });
}

export default configDB;