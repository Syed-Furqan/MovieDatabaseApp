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
                } else {
                    console.log(err);
                }
            });
        });
    });
});

app.get('/moviesList', (req, res) => {
    const movieName = req.query.movieName;
    request("https://api.themoviedb.org/3/search/movie?api_key=8b5f46448783f704c3aac11d3c1e0695&language=en-US&page=1&include_adult=false&query="+movieName, (err, response, body) => {
        if(!err && response.statusCode == 200){
            const list = JSON.parse(body);
            res.render('moviesList.ejs', {moviesList:list, movieName:movieName});
        } else {
            console.log(err);
        }
    });
});

app.get('/particularMovie', (req, res) => {
    const id = req.query.id;
    request(`https://api.themoviedb.org/3/movie/${id}?api_key=8b5f46448783f704c3aac11d3c1e0695&language=en-US`, (err, response, body) => {
        if(err) {
            res.send("Sorry Page not found!!!");
            console.log(err);
        }
        const movie = JSON.parse(body);
        request(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=8b5f46448783f704c3aac11d3c1e0695&language=en-US`, (err, response, body) => {
            if(!err && response.statusCode == 200){
                const actors = JSON.parse(body);
                res.render('particularMovie.ejs', {movie:movie, actors:actors});
            } else{
                res.send("Sorry Page not found!!!");
                console.log(err);
            }
        });
    });
});

app.get('/about', (req, res) => {
    res.send("<h3>Website about Movies, Working on TV Series.\n Get Movie Info and watch online for free.</h3>");
});

app.listen(process.env.PORT || port, err => {
    if(err) console.log(err);
    else console.log("Server has Stared!!!");
});