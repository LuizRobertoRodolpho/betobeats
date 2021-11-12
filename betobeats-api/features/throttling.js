const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
const split = (arr, n) => {
    var res = [];
    while (arr.length) {
        res.push(arr.splice(0, n));
    }
    return res;
}
const delayMS = (t = 200) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(t);
        }, t);
    });
};

const throttledPromises = (
    asyncFunction,
    items = [],
    batchSize = 1,
    delay = 0
) => {
    return new Promise(async (resolve, reject) => {
        const output = [];
        const batches = split(items, batchSize);
        await asyncForEach(batches, async (batch) => {
            const promises = batch.map(asyncFunction).map(p => p.catch(reject));
            const results = await Promise.all(promises);
            output.push(...results);
            await delayMS(delay);
        });
        resolve(output);
    });
};

module.exports = {
    asyncForEach
}