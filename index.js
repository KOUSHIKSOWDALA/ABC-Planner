import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req,res) =>{
    res.render('index.ejs')   
});

let format = {}


app.post('/submit', async(req,resp) =>{
    const destination = req.body.destination;
    const URl = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?city=${destination}&apiKey=YOURAPIKEY`
    )
    const lat = URl.data.features[0].properties.lat;
    const lon = URl.data.features[0].properties.lon;
    const rad = req.body.radius;
    const limit = req.body.limit;

    const URL2 = await axios.get(
        `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},${rad}&limit=${limit}&apiKey=YOURAPIKEY`
    )
    const hotels = []
    URL2.data.features.forEach(element => {
        hotels.push(element.properties.formatted)
    });
    format.hotel = hotels

    const URL3 = await axios.get(
        `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${lon},${lat},${rad}&limit=${limit}&apiKey=YOURAPIKEY`
    )
    const tourism = []
    URL3.data.features.forEach(element => {
        tourism.push(element.properties.formatted)
    });
    format.tourism = tourism
    
    const URL4 = await axios.get(
        `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},${rad}&limit=${limit}&apiKey=YOURAPIKEY`
    )

    const restaurants = []
    URL4.data.features.forEach(element => {
        restaurants.push(element.properties.formatted)
    });

    format.restaurants = restaurants

    const URL5 = await axios.get(
        `https://api.geoapify.com/v2/places?categories=entertainment&filter=circle:${lon},${lat},${rad}&limit=${limit}&apiKey=YOURAPIKEY`
    )

    const entertainment = []
    URL5.data.features.forEach(element => {
        entertainment.push(element.properties.formatted)
    });
    format.entertainment = entertainment

    resp.redirect('/hotel')


})

app.get('/hotel',(req,res) => {
    res.render('answer.ejs',{data:format.hotel})
})

app.get('/restaurant',(req,res) => {
    res.render('answer.ejs',{data:format.restaurants})
})

app.get('/tourism',(req,res) => {
    res.render('answer.ejs',{data:format.tourism})
})

app.get('/entertainment',(req,res) => {
    res.render('answer.ejs',{data:format.entertainment})
})


app.listen(port, () => {
    console.log("Server is Running")
})
