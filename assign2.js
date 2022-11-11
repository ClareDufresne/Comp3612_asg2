document.addEventListener("DOMContentLoaded", ()=>{
   let artists = JSON.parse(Artists);
   let genres = JSON.parse(Genres);

   //replace this with api fetch *******************************************************************
   //**************************************************************************************************
   //**************************************************************************************************
   //**************************************************************************************************
   let songs = JSON.parse(Songs);

   //populate table
   let songTable = document.querySelector("#browseView table");
   populateSongs(songs, songTable);

   function populateSongs(songs, table){
      let counter = 0;
      table.innerHTML = "";

      let labelRow = document.createElement("tr");
      labelRow.className = "labels";
      let d = document.createElement("th");
      d.innerText = "Title";
      labelRow.appendChild(d);
      let d1 = document.createElement("th");
      d1.innerText = "Artist";
      labelRow.appendChild(d1);
      let d2 = document.createElement("th");
      d2.innerText = "Year";
      labelRow.appendChild(d2);
      let d3 = document.createElement("th");
      d3.innerText = "Genre";
      labelRow.appendChild(d3);
      let d4 = document.createElement("th");
      d4.innerText = "Popularity";
      labelRow.appendChild(d4);
      let d5 = document.createElement("td");
      labelRow.appendChild(d5);
      
      table.appendChild(labelRow);


      for(song of songs){
         let row = document.createElement("tr");
         row.className = "stripe";
         if(counter%2 != 0){
            row.classList.add("darkStripe");
         }
   
         let td = document.createElement("td");
         td.innerText = song.title;
         td.dataset['song_id'] = song.song_id;
         row.appendChild(td);
         let td1 = document.createElement("td");
         td1.innerText = song.artist.name;
         td1.dataset['song_id'] = song.song_id;
         row.appendChild(td1);
         let td2 = document.createElement("td");
         td2.innerText = song.year;
         td2.dataset['song_id'] = song.song_id;
         row.appendChild(td2);
         let td3 = document.createElement("td");
         td3.innerText = song.genre.name;
         td3.dataset['song_id'] = song.song_id;
         row.appendChild(td3);
         let td4 = document.createElement("td");
         td4.innerText = song.details.popularity;
         td4.dataset['song_id'] = song.song_id;
         row.appendChild(td4);
         let td5 = document.createElement("td");
         let button = document.createElement("button");
         button.dataset['song_id'] = song.song_id;
         button.innerText = "+";
         td5.appendChild(button);
         row.appendChild(td5);
   
         table.appendChild(row);
         counter++;
      }
   }

   
   let artistSelector = document.querySelector("select.artist");
   let genreSelector = document.querySelector("select.genre");

   for(artist of artists){
      let option = document.createElement("option");
      option.textContent = artist.name;
      artistSelector.appendChild(option);
   }
   for(genre of genres){
      let option = document.createElement("option");
      option.textContent = genre.name;
      genreSelector.appendChild(option);
   }

   //toggle disable when radio buttons are clicked
   let buttonSection = document.querySelector(".songSearch");
   buttonSection.addEventListener("click", function(e){
      if(e.target.classList[0] == 'radio'){
         e.target.classList.toggle("selected");
         //find inputs with same classname
         let inputs = document.querySelectorAll(`.${e.target.classList[1]}`);
         for(input of inputs){
            if(input.classList[0] != 'radio')
               input.toggleAttribute('disabled');
         }
      }
   });

   let clearButton = document.querySelector("#clear");
   let radioButtons = document.querySelectorAll(".radio");

   clearButton.addEventListener("click", function(){
      for(button of radioButtons){
         if(button.classList.contains('selected')){
            button.classList.remove("selected");
            let inputs = document.querySelectorAll(`.${button.classList[1]}`);
            for(input of inputs){
               if(input.classList[0] != 'radio' && input.hasAttribute('disabled') == false){
                  input.disabled = true;
                  input.value = "";
               }
            }
         }
      }
   });

   //filter search results
   let searchButton = document.querySelector('#search');
   searchButton.addEventListener("click", function(){
      let matchedSongs = songs;
      for(button of radioButtons){
         if(button.classList.contains('selected')){
            let searchTerm = button.classList[1];
            if(searchTerm == "year"){
               let range = document.querySelectorAll("#year input");
               if(range[0].value == "")
                  range[0].value = 2022;
               if(range[1].value == "")
                  range[1].value = 0; 
               matchedSongs = matchedSongs.filter(d => d.year >= range[1].value && d.year <= range[0].value);
            }
            else if(searchTerm == "popularity"){
               let range = document.querySelectorAll("#popularity input");
               if(range[0].value == "")
                  range[0].value = 100;
               if(range[1].value == "")
                  range[1].value = 0; 
               matchedSongs = matchedSongs.filter(d => d.details.popularity >= range[1].value && d.details.popularity <= range[0].value);
            }
            else{
               if(searchTerm == "title"){
                  let searchValue = document.querySelector(`input.${searchTerm}`).value;
                  matchedSongs = matchedSongs.filter(d => d.title == searchValue);
               }
               else if(searchTerm == "genre"){
                  let searchValue = document.querySelector(`select.${searchTerm}`).value;
                  matchedSongs = matchedSongs.filter(d => d.genre.name == searchValue);
               }
               else if(searchTerm == "artist"){
                  let searchValue = document.querySelector(`select.${searchTerm}`).value;
                  matchedSongs = matchedSongs.filter(d => d.artist.name == searchValue);
               }
            }
         }
      }

      populateSongs(matchedSongs, songTable);
   });


   //display credits for 5 seconds when hovered over
   let credits = document.querySelector("#credits");
   let creditInfo = document.querySelector(".credits");
   credits.addEventListener("mouseover", function(){
      creditInfo.classList.remove("hide");
      setTimeout(function(){
         creditInfo.classList.add("hide");
      }, 5000);
   });

   //switch viewports
   let closeButton = document.querySelector("#close");
   let playlistButton = document.querySelector("#playlist");
   
   let browseView = document.querySelector("#browseView");
   let singleView = document.querySelector("#singleView");
   let playlistView = document.querySelector("#playlistView");

   playlistButton.addEventListener("click", function(){
      browseView.classList.add("hide");
      playlistView.classList.remove("hide");
      playlistButton.classList.add("hide");
      closeButton.classList.remove("hide");
   });

   closeButton.addEventListener("click", function(){
      playlistView.classList.add("hide");
      singleView.classList.add("hide");
      browseView.classList.remove("hide");
      closeButton.classList.add("hide");
      playlistButton.classList.remove("hide");
   });

   //radar chart
   const ctx = document.getElementById('radar').getContext('2d');
   const chartData = {
      labels: [
         'Danceability',
         'Liveness',
         'Valence',
         'Acousticness',
         'Speechiness'
      ],
      datasets: [{
         data: [90, 81, 56, 55, 40],
         fill: true,
         backgroundColor: 'rgba(205, 179, 230, 0.2)',
         borderColor: 'rgb(185, 146, 221)',
         pointBackgroundColor: 'rgb(185, 146, 221)',
         pointBorderColor: 'rgb(152, 107, 195)',
       }]
   }
   const myChart = new Chart(ctx, {
      type: 'radar',
      data: chartData,
      options: {
         plugins: {
            dataLabels: {
               display: false
            },
            legend: {
               display: false
            }
         },
         responsive: false,
         scales: {
            r: {
               ticks: {
                  display: false
               },
                suggestedMin: 0,
            }
        }
      }
   });

   const playlist = [];

   songTable.addEventListener("click", function(e){
      //add song to playlist
      if(e.target && e.target.nodeName == "BUTTON"){
         let song = songs.find(d => d.song_id == e.target.dataset.song_id);
         if(playlist.find(d => d == song) == undefined){
            playlist.push(song);
            console.log(playlist);
         }
      }

      //display song info
      else if(e.target && e.target.nodeName == "TD"){
         browseView.classList.add("hide");
         singleView.classList.remove("hide");
         playlistButton.classList.add("hide");
         closeButton.classList.remove("hide");

         let song = songs.find(d => d.song_id == e.target.dataset.song_id);

         myChart.data.datasets[0].data[0] = song.analytics.danceability;
         myChart.data.datasets[0].data[1] = song.analytics.liveness;
         myChart.data.datasets[0].data[2] = song.analytics.valence;
         myChart.data.datasets[0].data[3] = song.analytics.acousticness;
         myChart.data.datasets[0].data[4] = song.analytics.speechiness;
         myChart.update();
      }
   });
})


/* url of song api --- https versions hopefully a little later this semester */	
//const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
