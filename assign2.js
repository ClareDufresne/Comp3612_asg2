document.addEventListener("DOMContentLoaded", ()=>{
   let artists = JSON.parse(Artists);
   let genres = JSON.parse(Genres);
   
   let artistSelector = document.querySelector("select.Artist");
   let genreSelector = document.querySelector("select.Genre");

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


   //display credits for 5 seconds when hovered over
   let credits = document.querySelector("#credits");
   let creditInfo = document.querySelector(".credits");
   credits.addEventListener("mouseover", function(){
      creditInfo.classList.remove("hide");
      setTimeout(function(){
         creditInfo.classList.add("hide");
      }, 5000);
   });


   //radar chart
   const ctx = document.getElementById('radar').getContext('2d');
   const data = {
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
      data: data,
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
                suggestedMax: 100
            }
        }
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
