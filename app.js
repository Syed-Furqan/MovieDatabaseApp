const { response } = require('express');
const express = require('express');
const app = express();

const request = require('request');
const bodyParser = require('body-parser');

const port = 9000;

app.use(express.static('public'));

// Getting Popular, Top rated, Upcoming Movies and then sending them to home.ejs and then rendering it.
app.get('/', (req, res) => {
    request('https://api.themoviedb.org/3/movie/now_playing?api_key=8b5f46448783f704c3aac11d3c1e0695&language=en-US', (err, response, body) => {
        const nowPlaying = JSON.parse(body);
        request('https://api.themoviedb.org/3/movie/popular?api_key=8b5f46448783f704c3aac11d3c1e0695&language=en-US', (err, response, body) => {
            const popular = JSON.parse(body);
            request('https://api.themoviedb.org/3/movie/top_rated?api_key=8b5f46448783f704c3aac11d3c1e0695&language=en-US', (err, response, body) => {
                const topRated = JSON.parse(body);
                if(!err && response.statusCode == 200){
                    const movies = [nowPlaying, popular, topRated];
                    res.render('home.ejs', {movies:movies});
                } 
            });
        });
    });
});

app.listen(process.env.PORT || port, err => {
    if(err) console.log(err);
    else console.log("Server has Stared!!!");
});