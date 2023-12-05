const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const port = 3000;

// Configure body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mypassword',
    database: 'newschema2'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Serve your HTML form (replace the file path with your actual HTML file)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signuppage.html');
});

// Define a route for handling form submission
app.post('/submit', (req, res) => {
    const { fname, lname, dob, address, email, phone, gender } = req.body;

    // Insert user data into a table (e.g., "name_age")
    const sql = 'INSERT INTO Patients (fname, lname, dob, address, email, phone, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [fname, lname, dob, address, email, phone, gender], (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Error inserting data into MySQL');
            return;
        }

        if (results.affectedRows === 1){
            res.redirect('/success');
        } else{
            res.status(500).send('Error: Data insertion failed.');
        }
        // res.send('User data added successfully.');
    });
});
app.get('/success', (req, res) =>{
    res.sendFile(__dirname + '/security.html');
});

// http://localhost:3000/

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
