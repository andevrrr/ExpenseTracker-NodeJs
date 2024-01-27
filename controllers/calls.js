const fs = require("fs");

exports.getData = (req, res) => {
    fs.readFile("./data.json", function(err, data) {
        if (err) throw err;
        const bankStatement = JSON.parse(data);
        console.log(bankStatement);
        return data;
    })
}