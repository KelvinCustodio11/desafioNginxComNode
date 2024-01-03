const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const poolConnection = mysql.createPool(dbConfig);

function createTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS people (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )`;
    poolConnection.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log('Tabela "people" criada ou já existente.');
    });
}

function insertNameData() {
    const nameData = 'Kelvin Custódo';
    const insertQuery = `INSERT INTO people (name) VALUES ('${nameData}')`;
    poolConnection.query(insertQuery);
}

function fetchPeopleData(callback) {
    const selectQuery = `SELECT * FROM people`;
    poolConnection.query(selectQuery, (err, results) => {
        if (err) throw err;
        callback(results);
    });
}

function buildHtmlResponse(data) {
    let output = '<h1>Full Cycle Rocks!</h1>';
    output += '<ul>';
    data.forEach((row) => {
        output += `<li>${row.id} - ${row.name}</li>`;
    });
    output += '</ul>';
    return output;
}

app.get('/', (req, res) => {
    insertNameData();
    fetchPeopleData((results) => {
        const responseHtml = buildHtmlResponse(results);
        res.send(responseHtml);
    });
});

app.listen(port, () => {
    console.log(`Servidor escutando na porta: ${port}`);
    createTable();
});
