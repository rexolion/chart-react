const app = require('express')();
const cors = require('cors');
const bp = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const PORT = 4000;

app.use(cors());
app.use(bp.json());

app.get('/', (req, res) => {
    const data = [];
    let sortedAndFilteredData;
    fs.createReadStream('./data/smarts.csv')
        .pipe(csv({
            headers: false
        }))
        .on('data', function (line) {
            try {
                data.push(line['0']);
            } catch (err) {
                console.error(err);
            }
        })
        .on('end', function () {
            console.log('Data loaded');
            const allCapital = data.map(capitalize);
            const set = new Set(allCapital);
            const filtered = Array.from(set).map(val => ({
                name: val,
                amount: allCapital.filter(el => el === val).length
            }));
            sortedAndFilteredData = filtered.sort((a, b) => b.amount - a.amount);
            res.send(sortedAndFilteredData);
        });
});

const capitalize = str => str.toLowerCase().split(" ").map(val => val.split("").map((el, ind) => ind === 0 ? el.toUpperCase() : el).join("")).join(" ");

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));