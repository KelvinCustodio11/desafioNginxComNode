const express = require('express');
const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql')
const connection = mysql.createConnection(config)

const createTableQuery = 
`CREATE TABLE IF NOT EXISTS people (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)`;
connection.query(createTableQuery)

app.get('/', (req,res) => {
    const insertQuery = `INSERT INTO people (name) VALUES ('Kelvin Custódio')`;
    connection.query(insertQuery);
    const selectQuery = `SELECT * FROM people`;
    connection.query(selectQuery, (err, results) => {
        let output = '<h1>Full Cycle Rocks!</h1>';
        output += '<ul>';
        results.forEach((row) => {
                output += `<li>${row.id} - ${row.name}</li>`;
            });
            output += '</ul>';
            res.send(output);
        });
});

app.listen(port)