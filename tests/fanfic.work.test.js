const { getWorkFromId } = require("../src");

test('Fletching work data', async () => {
    (await getWorkFromId(43775644))
});