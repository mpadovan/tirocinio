var express = require('express');
const fs = require('fs');
const session = require('express-session');
const uuid = require('uuid')
var path = require('path')
// const csv = require('csv-parser');

const app = express()
app.use(express.json());
app.use(session({
    secret: 'sessione bellix',
    resave: false,
    saveUninitialized: true,
    cookie: { expires: new Date(253402300000000) }
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

app.get('/videos', (req, res) => {
    if (typeof req.session.view !== "undefined") {
        if(typeof req.session.count === "undefined") req.session.count = 0;
        res.json({ videos: videos.videos, count: req.session.count });
    } else res.json({ videos: [], count: 0 });
});

app.post('/videos/:name', (req, res) => {
    if (typeof req.session.view === "undefined") res.sendStatus(401)
    fs.appendFile(
        path.join(process.env.PWD, '/videos.csv'),
        `${req.params.name}, ${req.session.view}, ${req.body.weight}, ${req.body.masc}, ${req.body.time}\n`,
        (err) => {
            req.session.count++;
            if (err) res.json({ ok: false });
            else res.json({ ok: true, count: req.session.count });
        })
});

app.listen(process.env.PORT || port, () => {
    fs.readFile(path.join(process.env.PWD, '/videos10.json'), (err, data) => {
        videos = JSON.parse(data.toString());
    });
    console.log(`Example app listening at http://localhost:${port}`)
})