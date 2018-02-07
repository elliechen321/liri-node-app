require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];
var name = process.argv[3];

if (command === "my-tweets"){
    var params = {
        screen_name: 'BubbleCheny',
        count: 20                 
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
            for(var i = 0; i < 20; i++){
                console.log(tweets[i].text);
                console.log("time created at: " + tweets[i].created_at)
            }
        }
    }); 
}

function spotifyThis (name) {
    spotify.search({ type: 'track', query: name }) 
    .then(function(response) {
        let hit = response.tracks.items[0];
        let songInfo = `\nArtist(s): ${hit.artists[0].name};
                        \nSong name: ${hit.name};
                        \nPreview: ${hit.preview_url};
                        \nAlbum: ${hit.album.name}\n`
        console.log(songInfo);
    })
    .catch(function(err){
        console.log(err);
    })
}

if(command === "spotify-this-song"){
    spotifyThis(name);
}

else if(command === "movie-this"){
    request("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy",
    function(error, response, body){
        if(!error && response.statusCode === 200){
          //console.log(JSON.parse(body));
            console.log("Title of the movie: " + JSON.parse(body).Title);
            console.log("Year the movie came out: " + JSON.parse(body).Released);
            console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country where the movie was produced: " + JSON.parse(body).Country);
            console.log("Language of the movie: " + JSON.parse(body).Language);
            console.log("Plot of the movie: " + JSON.parse(body).Plot);
            console.log("Actors in the movie: " + JSON.parse(body).Actors);
        }  
    });
}

else if(command === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error,data){
        if(error){
            console.log(error);
        }
        //console.log(data);
        var dataArray = data.split(",");
        console.log(dataArray[1]);
        spotifyThis(dataArray[1]);
    });
}