const { exec } = require('child_process');

exports.postUploadFile = (req, res) => {
    const filePath = req.file.path; // The path to the uploaded file

    // Here you call your Python script and pass the file path
    exec(`python3 ./python/categorize.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error processing file.');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error processing file.');
        }
        // Assuming the Python script returns JSON data
        const results = JSON.parse(stdout);
        res.json(results); // Send back the results as JSON
    });
};
