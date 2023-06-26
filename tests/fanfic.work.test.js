const { getWorkFromId } = require("../src");

test('Fletching work data', async () => {
    console.log(await getWorkFromId(48156643))
});