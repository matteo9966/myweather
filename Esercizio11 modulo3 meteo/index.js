const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
const Datastore = require('nedb');
let db = new Datastore( 'database.db' );
db.loadDatabase();

app.use(express.static('public'));
app.use(express.json());
app.listen(3000,()=>{console.log("ascolto sulla 3000")});


/* i dati che io salvo sul db sono sono in formato {weather: ... , airQuality: ...} quando devo restituirli al utente per salvarli dal db glieli mando nel formato di array! */
app.post('/weather',(req,res)=>{
   console.log(req.body);
   db.insert(req.body,(e)=>{if(e){console.log(e)}});
   res.json({"messaggio":"dati ricevuti correttamente!"});
})

const apiKey = process.env.APY_KEY;

app.get('/weather/:latlon',(req,res)=>{
    console.log(req.params);
    let latlon = req.params.latlon.split(',');
    let lat = latlon[0];
    let lon = latlon[1];
    let apiLondon="http://api.openweathermap.org/data/2.5/weather?q=London&appid="+apiKey;
    let apiURL =`http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=3&appid=${KEY}`;
   
    let response = fetch(apiURL);
    

    let promiseWeather = response.then(resp=>resp.json()).then(json=>{
        
        
       // console.log(json.list[0].name,json.list[0].main.temp,json.list[0].weather[0].description);
        
            let data = {};
            data['dataEora']=cheOreSonoAdesso();
            data['nome']=json.list[0].name;
            data['temp']=json.list[0].main.temp - 273,15;
            data['temp'] = data['temp'].toFixed(2);
            data['main']=json.list[0].weather[0].main;
            data['desc']=json.list[0].weather[0].description;
            let icon = json.list[0].weather[0].icon;
            data['imagelink'] = riceviLinkIcona(icon);

            console.log(data);
        
           return data;
        }).then(data=>data);



     // adesso lavoro sulla qualità dell'aria: 

        // potrei fare un promise.all() cn tutte e due le promesse sia del weather che del air quality per mostrare i dati
        
    
    
    // una volta che ricevo i dati dal paese che mi interessa , mando il json con i dati che mi interessano al client
    
    let apiURL__AQ = `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?limit=1&page=1&offset=0&coordinates=${lat},${lon}&radius=15000`;    
let response__AQ = fetch(apiURL__AQ);
let promiseAQ  = response__AQ.then(resp=>resp.json()).then(json=>json);

Promise.all([promiseWeather,promiseAQ]).then(risultato=>{res.json(risultato)});

    
 
 
})

console.log(process.env);
let KEY = "b79d07e65d583bd9054955d144f0aeb3";



function riceviLinkIcona(icon){
// let image = icons[desc];
let link= `http://openweathermap.org/img/wn/${icon}@2x.png`;
return link;

}

// funzione restituisce data nel momento in cui viene chiamata  con un oggetto del tipo 
// {oraHHMMSS:10:22:14,dataGGMMMAAAA:22/11/2021}

function cheOreSonoAdesso(){
   let date = new Date();
   let regex =/\d{1,2}:\d{2}:\d{2}/gm;
   let oraHHMMSS = date.toString().match(regex)[0];
   let mese = date.getMonth() +1 ;
   let giorno = date.getDate();
   let anno = date.getFullYear();
  
   let dataGGMMAAAA = `${giorno}/${mese}/${anno}`;
   return {oraHHMMSS,dataGGMMAAAA};
   
}