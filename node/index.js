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
    return queryWithPromise(createTableQuery, poolConnection);
}

function insertNameData() {
    const name = 'Kelvin Custódio';
    const insertQuery = `INSERT INTO people (name) VALUES ('${name}')`;
    return queryWithPromise(insertQuery, poolConnection);
}

function fetchPeopleData() {
    const selectQuery = `SELECT * FROM people`;
    return queryWithPromise(selectQuery, poolConnection);
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

function queryWithPromise(query, connection) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            error ? reject(error) : resolve(results);
        });
    });
}

app.get('/', async (req, res) => {
    try {
        await insertNameData();
        const results = await fetchPeopleData();
        const responseHtml = buildHtmlResponse(results);
        res.send(responseHtml);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, async () => {
    try {
        console.log(`Servidor escutando na porta ${port}`);
        await createTable();
    } catch (error) {
        res.status(500).send(error);
    }
});
