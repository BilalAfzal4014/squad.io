const {mongoConnection} = require("../../db");

function getTimeToLiveExpiredCache(date) {
    return mongoConnection.collection("cache").find({
        timeToLive: {
            $lt: date
        }
    }).toArray();
}

function getLeastHitCache() {
    return mongoConnection.collection("cache").aggregate([
        {
            $sort: {
                totalHits: 1,
                lastHit: 1
            }
        },
        {
            $limit: 1
        }
    ]).toArray();
}

function getLastHitCache() {
    return mongoConnection.collection("cache").aggregate([
        {
            $sort: {
                lastHit: 1,
                totalHits: 1
            }
        },
        {
            $limit: 1
        }
    ]).toArray();
}

function findOne(key) {
    return mongoConnection.collection("cache").find({
        key
    }).toArray();
}

function insertCache(data) {
    return mongoConnection.collection("cache").insertOne({
        ...data
    });
}

function updateCache(updateCondition, updateValues) {
    return mongoConnection.collection("cache").updateOne(
        {
            ...updateCondition
        },
        {
            $set: {
                ...updateValues
            }
        });
}

function getRowsCount() {
    return mongoConnection.collection("cache").count();
}

module.exports = {
    getTimeToLiveExpiredCache,
    getLeastHitCache,
    getLastHitCache,
    findOne,
    updateCache,
    getRowsCount,
    insertCache
};
