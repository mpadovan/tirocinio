require('dotenv').config()

var express = require('express');
const fs = require('fs');
const session = require('express-session');
const uuid = require('uuid')
var path = require('path')
const { Client } = require('pg')

let client;
if (process.env.IS_LOCAL) {
    client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'tirocinio',
        password: 'password',
        port: 5432,
    });
} else {
    client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}

const app = express()
app.use(express.json());
app.use(session({
    secret: 'sessione bellix',
    resave: false,
    saveUninitialized: true,
    //cookie: { expires: new Date(253402300000000) }
}))

const port = 3000
var videos = null;

process.env.PWD = process.cwd();
app.use(express.static(path.join(process.env.PWD, 'public')));

app.get('/', (req, res) => {
    if (typeof req.session.view === "undefined") req.session.view = uuid.v4();
    fs.readFile(path.join(process.env.PWD, '/index.html'), (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data.toString());
    })
})

app.post('/videos', (req, res) => {
    console.log(req.session.view);
    if (typeof req.session.view !== "undefined") {
        if (typeof req.session.count === "undefined") req.session.count = 0;
        client.query('INSERT INTO Users VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
            [req.session.view, req.body.age, req.body.sex, req.body.music, req.body.videogames])
            .then(resp => {
                res.json({ videos: videos.videos, count: req.session.count });
            })
            .catch(err => {
                console.log(err);
                res.json(err)
            })
    } else res.json({ videos: [], count: 0 });
});

app.post('/videos/:name', (req, res) => {
    if (typeof req.session.view === "undefined") res.sendStatus(401)
    client.query('INSERT INTO Tests VALUES ($1, $2, $3, $4, $5)',
        [req.params.name, req.session.view, req.body.weight, req.body.masc, req.body.time])
        .then(resp => {
            req.session.count++;
            console.log(req.session.count);
            res.json({ ok: true, count: req.session.count });
        })
        .catch(err =>  {
            console.log(err);
            res.json({ ok: false })
        })
});

app.listen(process.env.PORT || port, async () => {
    fs.readFile(path.join(process.env.PWD, '/videos10.json'), (err, data) => {
        videos = JSON.parse(data.toString());
    });
    await client.connect()
    client.query(`CREATE TABLE IF NOT EXISTS Users (
        uuid VARCHAR(50),
        age INTEGER,
        sex VARCHAR(50),
        music_experience INTEGER,
        videogames_experience INTEGER,
        PRIMARY KEY (uuid)
    );
    
    CREATE TABLE IF NOT EXISTS Tests (
        filename VARCHAR(50),
        uuid VARCHAR(50),
        weight INTEGER,
        masculinity INTEGER,
        time REAL,
        PRIMARY KEY (filename, uuid),
        FOREIGN KEY (uuid) REFERENCES Users(uuid)
    );`)
    console.log(`Example app listening at http://localhost:${port}`)
})