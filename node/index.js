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
    return new Promise((resolve, reject) => {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS people (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )`;
        poolConnection.query(createTableQuery, (error) => {
            error ? reject(error) : resolve();
        });
    });
}

function insertNameData() {
    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO people (name) VALUES ('Kelvin Custódio')`;
        poolConnection.query(insertQuery, (error) => {
            error ? reject(error) : resolve();
        });
    });
}

function fetchPeopleData() {
    return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM people`;
        poolConnection.query(selectQuery, (error, results) => {
            error ? reject(error) : resolve(results);
        });
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

app.get('/', async (req, res) => {
    try {
        await createTable();
        await insertNameData();
        const results = await fetchPeopleData();
        const responseHtml = buildHtmlResponse(results);
        res.send(responseHtml);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.listen(port, async () => {
    try {
        console.log(`Servidor escutando na porta ${port}`);
        await createTable();
    } catch (error) {
        console.error('Erro:', error);
    }
});
