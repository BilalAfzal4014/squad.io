const {MongoClient} = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = process.env.DB_NAME || 'squad';

function establishDatabaseConnection() {
    return client.connect()
        .then(() => {
            console.log('DB connected successfully');
        });
}

module.exports = {
    establishDatabaseConnection,
    mongoConnection: client.db(dbName)
};
