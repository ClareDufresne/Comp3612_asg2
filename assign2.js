document.addEventListener("DOMContentLoaded", ()=>{
   let songs = localStorage.getItem('songs');
   let artists = localStorage.getItem('artists');
   let genres = localStorage.getItem('genres');

   if(artists == null){
      fetch('artists.json')
      .then(response => {return response.json()})
      .then(data=>{
         localStorage.setItem('artists', JSON.stringify(data)); 
         artists = localStorage.getItem('artists');
         artists = JSON.parse(artists);
         getGenres();
      })
      .catch(error => console.log(error))
   }
   else{
      artists = JSON.parse(artists);
      getGenres();
   }

   function getGenres(){
      if(genres == null){
         fetch('genres.json')
         .then(response => {return response.json()})
         .then(data=>{
            localStorage.setItem('genres', JSON.stringify(data)); 
            genres = localStorage.getItem('genres');
            genres = JSON.parse(genres);
            getSongs();
         })
         .catch(error => console.log(error))
      }
      else{
         genres = JSON.parse(genres);
         getSongs();
      }
   }
   
   function getSongs(){
      if(songs == null){
         fetch('https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php')
         .then(response => {return response.json()})
         .then(data=>{
            localStorage.setItem('songs', JSON.stringify(data)); 
            console.log("Data had to be requested");
            songs = localStorage.getItem('songs');
            songs = JSON.parse(songs);
            start();
         })
         .catch(error => console.log(error))
      }
      else{
         songs = JSON.parse(songs);
         start();
      }
   }

   //put all code in function so that nothing is executed until the data from API or local storage is available
   function start(){
      let songTable = document.querySelector("#browseView table");
      let playlistTable = document.querySelector("#playlistView table");
      let playlistInfo = document.querySelector("#playlistView p");
      let sortSelect = 0;     //indicates which column is to be sorted
      let matchedSongs = songs;  //for use with searching

      //initially sort by title
      sortByTitle("title");
      populateSongs(matchedSongs, songTable, "add");

      function sortByTitle(sortTerm){
         matchedSongs.sort(function(a, b){
            if(a[sortTerm].toString().toLowerCase() < b[sortTerm].toString().toLowerCase())
               return -1;
            if(a[sortTerm].toString().toLowerCase() > b[sortTerm].toString().toLowerCase())
               return 1;
            return 0;
         });
      }

      //populate browseview table (buttonType will be add) or playlist table (button type will be remove)
      function populateSongs(songs, table, buttonType){
         let counter = 0;
         table.innerHTML = "";      //clear table

         //create table headers as first row of table
         let labelRow = document.createElement("tr");
         labelRow.className = "labels";
         let d = document.createElement("th");
         d.innerText = "Title";
         if(sortSelect == 0 && buttonType == "add")
            d.className = "sort";
         labelRow.appendChild(d);
         let d1 = document.createElement("th");
         d1.innerText = "Artist";
         if(sortSelect == 1 && buttonType == "add")
            d1.className = "sort";
         labelRow.appendChild(d1);
         let d2 = document.createElement("th");
         d2.innerText = "Year";
         if(sortSelect == 2 && buttonType == "add")
            d2.className = "sort";
         labelRow.appendChild(d2);
         let d3 = document.createElement("th");
         d3.innerText = "Genre";
         if(sortSelect == 3 && buttonType == "add")
            d3.className = "sort";
         labelRow.appendChild(d3);
         let d4 = document.createElement("th");
         d4.innerText = "Popularity";
         if(sortSelect == 4 && buttonType == "add")
            d4.className = "sort";
         labelRow.appendChild(d4);
         let d5 = document.createElement("td");
         if(buttonType == "remove"){
            playlistInfo.innerText = `Songs: ${playlist.length} Popularity: ${getAvgPopularity().toFixed(1)}`;
            let button = document.createElement("button");
            button.innerText = "Clear"
            button.className = "clear";
            d5.appendChild(button);
         }
         labelRow.appendChild(d5);
         
         table.appendChild(labelRow);


         //create a row for each song
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
            td5.dataset['song_id'] = song.song_id;
            button.dataset['song_id'] = song.song_id;
            if(buttonType == "add"){
               button.innerText = "+";
            }
            else{
               button.innerText = "Remove";
               button.className = "remove";
            }
            td5.appendChild(button);
            row.appendChild(td5);
      
            table.appendChild(row);
            counter++;
         }
      }


      //get average popularity of the songs in the playlist
      function getAvgPopularity(){
         let avg = 0;
         for(song of playlist){
            avg += song.details.popularity;
         }
         if(playlist.length == 0)
            return 0;
         return avg/playlist.length.toFixed(1);
      };

      
      //populate artist and genre select elements
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


      //handle radio buttons and search input fields
      let buttonSection = document.querySelector(".songSearch");
      let radioButtons = document.querySelectorAll(".radio");

      buttonSection.addEventListener("click", function(e){
         if(e.target.classList[0] == 'radio' && e.target.classList.length < 3){
            e.target.classList.toggle("selected");
            //find inputs with same classname
            let inputs = document.querySelectorAll(`.${e.target.classList[1]}`);
            for(input of inputs){
               if(input.classList[0] != 'radio')
                  input.toggleAttribute('disabled');
            }

            //turn off other radio buttons so that they are mutually exclusive
            for (radio of radioButtons){
               if(radio != e.target){
                  radio.classList.remove("selected");
                  let inputs = document.querySelectorAll(`.${radio.classList[1]}`);
                  for(input of inputs){
                  if(input.classList[0] != 'radio')
                     input.setAttribute('disabled', "");
                  }
               }
            }
         }
      });


      //clear search filters
      let clearButton = document.querySelector("#clear");
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
         sortSelect = 0; 
         matchedSongs = songs;
         sortByTitle("title");
         populateSongs(matchedSongs, songTable, "add");
         radioButtons[0].classList.toggle("selected");
         document.querySelector("input.title").toggleAttribute("disabled");
      });


      //filter search results
      let searchButton = document.querySelector('#search');
      searchButton.addEventListener("click", function(){
         matchedSongs = songs;
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
                  matchedSongs = matchedSongs.filter(d => d.details.popularity > range[1].value && d.details.popularity < range[0].value);
               }
               else if(searchTerm == "title"){
                  let searchValue = document.querySelector(`input.${searchTerm}`).value;
                  matchedSongs = matchedSongs.filter(d => d.title.toString().toLowerCase().includes(searchValue.toLowerCase()));
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

         populateSongs(matchedSongs, songTable, "add");
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
         browseView.classList.add("fade");
         setTimeout(function(){
            browseView.classList.add("hide");
            browseView.classList.remove("fade");
            playlistView.classList.add("fadeIn");
            playlistView.classList.remove("hide");
            setTimeout(function(){
               playlistView.classList.remove("fadeIn");
            }, 450);
         }, 200);
         playlistButton.classList.add("hide");
         closeButton.classList.remove("hide");

         //populate playlist 
         populateSongs(playlist, playlistTable, "remove");
      });

      closeButton.addEventListener("click", function(){
         //works regardless of which viewport is currently visible
         playlistView.classList.add("fade");
         singleView.classList.add("fade");
         setTimeout(function(){
            playlistView.classList.add("hide");
            playlistView.classList.remove("fade");
            singleView.classList.add("hide");
            singleView.classList.remove("fade");
            browseView.classList.add("fadeIn");
            browseView.classList.remove("hide");
            setTimeout(function(){
               browseView.classList.remove("fadeIn");
            }, 450);
         }, 200);
         closeButton.classList.add("hide");
         playlistButton.classList.remove("hide");
      });


      //radar chart
      //base code from https://www.chartjs.org/docs/latest/samples/other-charts/radar.html
      const ctx = document.getElementById('radar').getContext('2d');
      const chartData = {
         labels: [
            'Danceability',
            'Liveness',
            'Valence',
            'Energy',
            'Speechiness',
            'Loudness'
         ],
         datasets: [{
            data: [90, 81, 56, 55, 40, 8],
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


      const tables = document.querySelectorAll("table");
      const info_li = document.querySelectorAll("#infoBlock li");
      const analysisDivs = document.querySelectorAll("#analysis div");
      const analysisText = document.querySelectorAll("#analysis p");
      const playlistPopup = document.querySelector("#addToPlaylistConfirm");
      const playlist = [];    //will hold all songs that have been added to the playlist

      for(table of tables){
         table.addEventListener("click", function(e){
            if(e.target && e.target.nodeName == "BUTTON"){
               let song = songs.find(d => d.song_id == e.target.dataset.song_id);
      
               //remove song from playlist
               if(e.target.className == "remove"){
                  playlist.splice(playlist.indexOf(playlist.find(d => d == song)), 1);
                  populateSongs(playlist, playlistTable, "remove");
               }
               //clear all songs from playlist
               else if(e.target.className == "clear"){
                  playlist.splice(0, playlist.length);
                  populateSongs(playlist, playlistTable, "remove");
               }
               //add song to playlist if it has not already been added
               else if(playlist.find(d => d == song) == undefined){
                  playlist.push(song);

                  //added to playlist popup
                  playlistPopup.classList.remove("hide");
                  setTimeout(function(){
                     playlistPopup.classList.add("fade");
                     setTimeout(function(){
                        playlistPopup.classList.add("hide");
                        playlistPopup.classList.remove("fade");
                     }, 300);
                  }, 800);
               }
            }
      

            //display song info when it is clicked
            else if(e.target && e.target.nodeName == "TD"){
               //switch viewport
               browseView.classList.add("fade");
               playlistView.classList.add("fade");
               setTimeout(function(){
                  browseView.classList.add("hide");
                  playlistView.classList.add("hide");
                  browseView.classList.remove("fade");
                  playlistView.classList.remove("fade");
                  singleView.classList.add("fadeIn");
                  singleView.classList.remove("hide");
                  setTimeout(function(){
                     singleView.classList.remove("fadeIn");
                  }, 450);
               }, 200);
               playlistButton.classList.add("hide");
               closeButton.classList.remove("hide");
      

               let song = songs.find(d => d.song_id == e.target.dataset.song_id);
      
               //add song analytics to chart
               myChart.data.datasets[0].data[0] = song.analytics.danceability;
               myChart.data.datasets[0].data[1] = song.analytics.liveness;
               myChart.data.datasets[0].data[2] = song.analytics.valence;
               myChart.data.datasets[0].data[3] = song.analytics.energy;
               myChart.data.datasets[0].data[4] = song.analytics.speechiness;
               myChart.data.datasets[0].data[5] = song.details.loudness;
               myChart.update();
      
               //display song info
               info_li[0].innerText = `Title: ${song.title}`;
               info_li[1].innerText = `Artist: ${song.artist.name}`;
               info_li[2].innerText = `Type: ${artists.find(d => d.id == song.artist.id).type}`;
               info_li[3].innerText = `Genre: ${song.genre.name}`;
               info_li[4].innerText = `Year: ${song.year}`;

               let minutes = song.details.duration/60;
               minutes = minutes.toFixed(0);
               let seconds = song.details.duration%60;
               if(seconds >= 10)
                  info_li[5].innerText = `Duration: ${minutes}:${seconds}`;
               else
                  info_li[5].innerText = `Duration: ${minutes}:0${seconds}`;

      
               let minWidth = 110;  //of the analysis divs
               let range = 1.8;     //control maximum width of the analysis divs
      
               //display song analysis data, calculating div size according to the data
               analysisText[0].textContent = song.details.bpm;
               analysisDivs[0].style.width = `${song.details.bpm*0.6 + minWidth}px`;
               analysisText[1].textContent = song.analytics.energy;
               analysisDivs[1].style.width = `${song.analytics.energy*range + minWidth}px`;
               analysisText[2].textContent = song.analytics.danceability;
               analysisDivs[2].style.width = `${song.analytics.danceability*range + minWidth}px`;
               analysisText[3].textContent = song.analytics.liveness;
               analysisDivs[3].style.width = `${song.analytics.liveness*range + minWidth}px`;
               analysisText[4].textContent = song.analytics.valence;
               analysisDivs[4].style.width = `${song.analytics.valence*range + minWidth}px`;
               analysisText[5].textContent = song.analytics.acousticness;
               analysisDivs[5].style.width = `${song.analytics.acousticness*range + minWidth}px`;
               analysisText[6].textContent = song.analytics.speechiness;
               analysisDivs[6].style.width = `${song.analytics.speechiness*range + minWidth}px`;
               analysisText[7].textContent = song.details.popularity;
               analysisDivs[7].style.width = `${song.details.popularity*range + minWidth}px`;
            }
         });
      }


      //when a table header label is clicked, sort the table by that label
      songTable.addEventListener("click", function(e){
         if(e.target && e.target.nodeName == "TH"){
            if(document.querySelector(".sort"))
               document.querySelector(".sort").classList.toggle("sort");
            let sortTerm;

            //titles will be sorted alphabetically, and years from oldest to newest
            if(e.target.innerText == "Title" || e.target.innerText == "Year"){
               sortSelect = 0;
               if(e.target.innerText == "Year")
                  sortSelect = 2;
               sortTerm = e.target.innerText.toLowerCase();
               //needs to be separate function so that songs can be initially sorted by title
               sortByTitle(sortTerm);
            }
            //sorted from most to least popular
            else if(e.target.innerText == "Popularity"){
               sortSelect = 4;
               matchedSongs.sort(function(a, b){
                  if(a.details.popularity < b.details.popularity)
                     return 1;
                  if(a.details.popularity > b.details.popularity)
                     return -1;
                  return 0;
               });
            }
            //genres and artist names will be sorted alphabetically
            else if(e.target.innerText == "Genre"){
               sortSelect = 3;
               matchedSongs.sort(function(a, b){
                  if(a.genre.name.toLowerCase() < b.genre.name.toLowerCase())
                     return -1;
                  if(a.genre.name.toLowerCase() > b.genre.name.toLowerCase())
                     return 1;
                  return 0;
               });
            }
            else{
               sortSelect = 1;
               matchedSongs.sort(function(a, b){
                  if(a.artist.name.toLowerCase() < b.artist.name.toLowerCase())
                     return -1;
                  if(a.artist.name.toLowerCase() > b.artist.name.toLowerCase())
                     return 1;
                  return 0;
               });
            }
            
            populateSongs(matchedSongs, songTable, "add");
         }
      })
   }
})
