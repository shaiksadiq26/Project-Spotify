console.log("Lets Write Javascript")
let songs;

function SecondsToMinutesSeconds(Seconds) {
    if(isNaN(Seconds) || Seconds <0){
        return "00:00"
    }
    const minutes = Math.floor(Seconds / 60);
    const seconds = Math.floor(Seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }

let currentSong = new Audio();
//Building a Function to get all the Songs List
async function getSongs() {

    let a = await fetch("http://127.0.0.1:3002/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])

        }

    }
    return songs
}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function main() {
    
    //Get the list of Songs
    songs = await getSongs()
    playMusic(songs[0], true)

    //Show All the Songs in the PlayList
    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")} </div>
            <div>Sadiq</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class="invert" src="playbutton.svg" alt="">
        </div>
        </li>`;
    }

    //Attach an eventListerner to Each Song
     Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
     })
    
     //Attach an EventListern to play,next,previous
     play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "playbutton.svg"
           
        }
     })

     //Listen for TimeUpdate event
     currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songTime").innerHTML = `${SecondsToMinutesSeconds(currentSong.currentTime)} / ${SecondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
       
     })

     // Add an event Lister to seekBar
     document.querySelector(".seekBar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100
     })

     //Add event Listener For hamburger
     document.querySelector(".hamburgericon").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
     })
     //Add event Listener For close
     document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
     })

     //Add Event Listerner to Previous Buttons
     previous.addEventListener("click",()=>{
     console.log("previous clicked")
     let index = songs.indexOf( currentSong.src. split("/"). slice(-1)[0])
     if((index-1) >= 0){
         playMusic(songs[index-1])
     }
     })

     //Add Event Listerner to next Buttons
     next.addEventListener("click",()=>{
     console.log("next clicked")
     let index = songs.indexOf( currentSong.src. split("/"). slice(-1)[0])
     if((index+1) < songs.length){
         playMusic(songs[index+1])
    }
 })

    //Add Event Listerner to volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })

    

  
}
//calling the function
main()
