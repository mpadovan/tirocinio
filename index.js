var express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express()
const port = 3000
var videos= null;

app.use(express.static('public'))

app.get('/videos', (req, res) => {
  res.send(JSON.stringify(videos));
});

app.listen(process.env.PORT || port, () => {
  fs.readFile('videos.json', (err, data) => {
    videos = JSON.parse(data.toString());
  });
  console.log(`Example app listening at http://localhost:${port}`)
})