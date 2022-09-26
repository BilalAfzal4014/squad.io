const {v4: uuidv4} = require("uuid");
const {
    convertDateToYMDFormat,
    getXDaysAheadDateFromCurrentDate
} = require("../../utils/helper-functions");

const {fetchCache, handleCacheFound, handleCacheNotFound} = require("./cache-manager-helper");

async function cacheManager(key) {
    let data;
    const todaysDate = convertDateToYMDFormat(getXDaysAheadDateFromCurrentDate(0));
    const bonusLife = convertDateToYMDFormat(getXDaysAheadDateFromCurrentDate(7));
    const randomStr = uuidv4();

    [data] = await fetchCache(key);

    if (data) {
        await handleCacheFound({data, todaysDate, randomStr, bonusLife});
    } else {
        await handleCacheNotFound({key, todaysDate, randomStr, bonusLife});
        data = {
            value: randomStr
        }
    }
    return data;
}

module.exports = {
    cacheManager
}
