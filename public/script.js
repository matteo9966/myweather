

const btn = document.querySelector('#btn');
const latitude = document.querySelector('#latitude');
const longitude = document.querySelector('#longitute');
const image = document.querySelector('.image');
const infometeo = document.querySelector('.info');
const divAirQuall = document.querySelector('.airqual');




function trovaPosizioneUtente(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(mostraPosizione); // getCurrentPosition prende una funzione di callback che restituisce la posizione dell' utente
      } else {
       console.log("Geolocation is not supported by this browser.");
      }
}

function mostraPosizione(posizione){
//     "Latitude: " + position.coords.latitude +
//   "<br>Longitude: " + position.coords.longitude;
  console.log("posizione trovata!")
  let latitudine = posizione.coords.latitude;
  let longitudine = posizione.coords.longitude;
  latitude.value=latitudine;
  longitude.value=longitudine;
  const latlon = {latitudine:latitudine.toFixed(2).toString(),longitudine:longitudine.toFixed(2).toString()};
  inviaAlServer(latlon)
  
}

document.addEventListener('DOMContentLoaded',trovaPosizioneUtente);
 

function inviaAlServer(latlon){
     
    const apiUrl = `/weather/${latlon.latitudine},${latlon.longitudine}`;

    fetch(apiUrl).then(response=>{
      return response.json();
    }).then(resp=>{


     mostraMeteo(resp[0]);
     mostraQualitaAria(resp[1]);
     salvaDatiSulServer(resp);

      
      console.log(resp)});

}

function mostraMeteo(meteo){
  if(!meteo){ 
   return
  }
  SvuotaLista(infometeo,image); // con questa funzione mi garantisco di avere una lista sempre vuota
  
  let lista = creaLista(["Nome",meteo.nome],["Temperatura",meteo.temp]);
  infometeo.appendChild(lista);
  let img = document.createElement('img');
  img.src = meteo.imagelink;
  image.appendChild(img);
  
}

function mostraQualitaAria(qual){
   
  // let location="";
  

  if(qual.hasOwnProperty("results")){
     if(qual["results"].length>0){
       console.log("results è questo:: ",qual["results"][0]["measurements"]);
       let city = qual["results"][0]["city"];
       let values = qual["results"][0]["measurements"].map(el=>["Parametro",`${el.parameter} ${el.value}${el.unit}`]);
       console.log(values);
       let listaParametri= creaLista(...values);
       divAirQuall.appendChild(listaParametri);




     }
  }

}

function SvuotaLista(lista,immagine){
  while(lista.firstChild){
    lista.removeChild(myNode.lastChild);
  }
  if(immagine.firstChild){
    immagine.removeChild(immagine.firstChild);
  }
}



function creaLista(){  // passa un oggetto coppia di chiave valore a questa funzione che ti restituisce una lista
  let list = document.createElement('ul');
 console.log("argomenti lunghezza:"+ arguments.length);
  for(let i = 0 ; i< arguments.length;i++){
    
    let li = document.createElement('li');
    let p = document.createElement('p');
    let p1 = document.createElement('p');
    p.textContent = `${arguments[i][0]}: `;
    p1.textContent = arguments[i][1];
    li.appendChild(p);
    li.appendChild(p1);
    list.appendChild(li);
  }
  console.log("lista:::", list)
  return list;
}

function salvaDatiSulServer(data){
  
  let dataPerServer = {weather:data[0], airQuality:data[1]};

//   let airQ = data[1];
//   let weath = data[0];
//   let dataEora = weath.dataEora;
//   let oggi = dataEora.dataGGMMAAAA;
//   let ora = dataEora.oraHHMMSS;
//   let nome= weath.nome;
//   let temp =weath.temp;
//   let imagelink=weath.imagelink;
//   let main = weath.main;
//   let measurements = airQ["results"][0]["measurements"];

//  let datiPerServer={oggi,ora,nome,temp,imagelink,main,measurements};
  let opstions =  {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataPerServer),
  };

 fetch('/weather',opstions).then(resp=>resp.json()).then(json=>console.log(json));


}