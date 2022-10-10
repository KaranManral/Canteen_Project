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
            "password": obj["password"],
            "cart": []
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

const submitFeedback = async (obj) => {
    let flag = null;
    await Promise.resolve(client.connect().then(async (db) => {
        const collection = client.db("CanteenProject").collection("feedback");
        await Promise.resolve(collection.updateOne({ "email": obj["email"] },
            {
                $set: {
                    "email": obj["email"],
                    "name": obj["name"],
                    "rating": obj["rating"],
                    "feedHead": obj["feedHead"],
                    "feedBody": obj["feedBody"]
                }
            }, { upsert: true }).then(() => {
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

const getItems = async () => {
    let retData = { flag: null, data: null };
    await Promise.resolve(client.connect().then(async (db) => {
        const collection = client.db("CanteenProject").collection("items");

        await Promise.resolve(collection.find().toArray().then((data) => {
            if (data === null) {
                client.close();
                retData.flag = 0;
            }
            else {
                client.close();
                retData.flag = 1;
                retData.data = data;
            }
        }).catch((err) => {
            client.close();
            retData.flag = null;
        }
        ));

    }).catch((err) => {
        retData.flag = null;
    }));
    return retData;
}

const addCart = async (obj, ob) => {
    let flag = null;
    await Promise.resolve(client.connect().then(async (db) => {
        const collection = client.db("CanteenProject").collection("users");

        await Promise.resolve(collection.findOneAndUpdate({ "email": ob },
            {
                $set: {
                    "cart": obj
                }
            }, { upsert: false }).then(() => {
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

const checkCart = async (ob) => {
    let retData = { flag: null, cart: null };
    await Promise.resolve(client.connect().then(async (db) => {
        const collection = client.db("CanteenProject").collection("users");

        await Promise.resolve(collection.findOne({ "email": ob }).then((data) => {
            if (data === null) {
                client.close();
                retData.flag = 0;
            }
            else {
                client.close();
                retData.flag = 1;
                retData.cart = data.cart;
            }
        }).catch((err) => {
            client.close();
            flag = 0;
        }));
    }).catch((err) => {
        flag = null;
    }));
    return retData;
}

const addOrder = async (obj) => {
    let flag = null;
    await Promise.resolve(client.connect().then(async (db) => {
        const collection = client.db("CanteenProject").collection("orders");
        const d = new Date();
        let date = d.toLocaleDateString() + " " + d.toLocaleTimeString();
        await Promise.resolve(collection.insertOne({
            _id: obj["orderID"],
            "email": obj["email"],
            "name": obj["name"],
            "order": obj["orderDetails"],
            "order_time": date
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
module.exports = { addUser, checkUser, submitFeedback, getItems, addCart, checkCart, addOrder };