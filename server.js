'use strict'
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
//const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

app.get('/', totalSummary);
app.post('/addCountry', addCounty);
app.get('/addCountry', getCounty);
app.get('/addDetails/:id', allDetails);
app.put('/updateDetails/:id', updateDetails);
app.delete('/deleteDetails/:id', deleteDetails);

// Functions

function totalSummary(req, res) {
    let url = `https://api.covid19api.com/world/total`;

    superagent(url).then(data => {
        let allData = data.body;
        res.render('pages/home', { items: allData });
    });

}

function addCounty(req, res) {
    let { id, Country, TotalConfirmed, TotalRecovered, TotalDeaths, Date } = req.body;
    let sql = `INSERT INTO Countries (id,Country,TotalConfirmed ,TotalRecovered,TotalDeaths,Date) VALUES ($1,$2,$3,$4,$5,$6 )RETURNING*;`;
    let safeValue = [Country, TotalConfirmed, TotalRecovered, TotalDeaths, Date];
    client.query(sql, safeValue).then(result => {
        res.redirect('/addCountry');
    });
}

function getCounty(req, res) {
    let sql = 'SELECT * FROM Countries';
    client.query(sql).then(result => {
        res.render('/addCountry', { items: result.rows });
    });
}

function allDetails(req, res) {
    let id = req.params.id;
    let sql = `SELECT * FROM Countries WHERE id=$1`;
    let safeValue = [id];
    client.query(sql, safeValue).then(result => {
        res.render('/addDetails', { items: result.rows[0] });
    });
}

function updateDetails(req, res) {
    let { TotalDeaths, TotalRecovered, Date, Country } = req.body;
    let id = req.params.id;
    let sql = `UPDATE Countries
    SET TotalDeaths = $1, TotalRecovered = $2, Date=$3,Country=$4
    WHERE id=$5;`;
    let values = [id, TotalDeaths, TotalRecovered, Date, Country];
    client.query(sql, values).then(result => {
        res.redirect('/');
    })
}

function deleteDetails(req, res) {
    let id = req.params.id;
    let sql = `DELETE FROM Countries WHERE id=$1;`;
    let safeValue = [id];
    client.query(sql, safeValue).then(result => {
        res.redirect('/');
    })

}



function Country(data) {
    this.id = data.id;
    this.Country = data.Country;
    this.TotalConfirmed = data.TotalConfirmed;
    this.TotalRecovered = data.TotalRecovered;
    this.TotalDeaths = data.TotalDeaths;
    this.Date = data.Date;
}



const PORT = process.env.PORT || 5000;
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listen ${PORT}`);
    });

});
