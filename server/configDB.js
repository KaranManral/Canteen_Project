const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://manga_deathNote:Hero9680@canteenproject.cxybxng.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const addUser = async (obj) => {
    let flag = null;
    await Promise.resolve(client.connect().then(async (db) => {
        const collection = client.db("CanteenProject").collection("users");

        await Promise.resolve(collection.insertOne({
            "email": obj["email"],
            "fname": obj["fname"],
            "lname": obj["lname"],
            "password": obj["password"]
        }).then(() => {
            client.close();
            flag = 1;
        }).catch((err) => {
            client.close();
            flag = 0;
        }));
    }).catch((err) => {
        flag = null;
    }));
    return flag;
}

const checkUser = async (obj) => {
    const retData = { flag: null, user: null };
    await Promise.resolve(client.connect().then(async (db) => {
        const collection = client.db("CanteenProject").collection("users");

        await Promise.resolve(collection.findOne({ "email": obj["email"] }).then((data) => {
            if (data === null) {
                client.close();
                retData.flag = 0;
            }
            else {
                client.close();
                retData.flag = 1;
                retData.user = data;
            }
        }).catch((err) => {
            client.close();
            retData.flag = null;
        }));
    }).catch((err) => {
        retData.flag = null;
    }));
    return retData;
}

module.exports = { addUser, checkUser };