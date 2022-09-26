const cacheRepo = require("../../repositories/cache");
const {timeDiffOfStartAndEndDate} = require("../../utils/helper-functions");

const NUMBER_OF_ENTRIES_ALLOWED = process.env.NUMBER_OF_ENTRIES_ALLOWED || 5;

function fetchCache(key) {
    return cacheRepo.findOne(key);
}

function handleCacheFound({data, todaysDate, randomStr, bonusLife}) {
    return cacheRepo.updateCache({
        _id: data._id
    }, {
        totalHits: data.totalHits + 1,
        ...(data.timeToLive < todaysDate && {value: randomStr, timeToLive: bonusLife}),
        lastHit: todaysDate
    });
}

async function handleCacheNotFound({key, todaysDate, randomStr, bonusLife}) {
    const totalRows = await cacheRepo.getRowsCount();
    if (totalRows >= NUMBER_OF_ENTRIES_ALLOWED) {
        await _handleOldCache({key, randomStr, todaysDate, bonusLife});
    } else {
        await _handleNewCache({key, randomStr, todaysDate, bonusLife});
    }
}

async function _handleOldCache({key, randomStr, todaysDate, bonusLife}) {
    const [expiredCache] = await cacheRepo.getTimeToLiveExpiredCache(todaysDate);
    if (expiredCache) {
        await _handleExpiredCache({key, expiredCache, randomStr, todaysDate, bonusLife});
    } else {
        await _handleUseLessCache({key, randomStr, todaysDate, bonusLife});
    }
}

function _handleExpiredCache({key, expiredCache, randomStr, todaysDate, bonusLife}) {
    return cacheRepo.updateCache({
        _id: expiredCache._id
    }, {
        key,
        value: randomStr,
        totalHits: 1,
        lastHit: todaysDate,
        timeToLive: bonusLife
    });
}

async function _handleUseLessCache({key, randomStr, todaysDate, bonusLife}) {
    const [lastHitCache] = await cacheRepo.getLastHitCache();
    const [leastHitCache] = await cacheRepo.getLeastHitCache();
    const lessUsedCache = _getUseLessCacheBetweenTwoCaches(lastHitCache, leastHitCache);

    return cacheRepo.updateCache({
        _id: lessUsedCache._id
    }, {
        key,
        value: randomStr,
        totalHits: 1,
        lastHit: todaysDate,
        timeToLive: bonusLife
    });
}

function _getUseLessCacheBetweenTwoCaches(lastHitCache, leastHitCache) {

    const timeDiffInDays = timeDiffOfStartAndEndDate(lastHitCache.lastHit, leastHitCache.lastHit)
    if (timeDiffInDays >= 1) {
        return lastHitCache;
    } else if (timeDiffInDays === 0) {
        return leastHitCache;
    } else {
        if (lastHitCache.totalHits / 2 >= leastHitCache.totalHits) {
            return leastHitCache;
        } else {
            return lastHitCache;
        }
    }
}

function _handleNewCache({key, randomStr, todaysDate, bonusLife}) {
    return cacheRepo.insertCache({
        key,
        value: randomStr,
        totalHits: 1,
        lastHit: todaysDate,
        timeToLive: bonusLife
    });
}

module.exports = {fetchCache, handleCacheFound, handleCacheNotFound}
