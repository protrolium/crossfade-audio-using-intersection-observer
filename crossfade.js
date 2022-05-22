window.addEventListener("load", (event) => {
    ["d1", "d2", "d3"].forEach(name => {
        handleEachCategory(name);
    });
}, false);

  function handleEachCategory(category) {
    let target = document.getElementById(category);
    let observer;
    let isVis;
    createObserver();
  
    function createObserver() {
      let options = {
        root: null,
        rootMargin: '-100px',
        threshold: 0.55
      }
      observer = new IntersectionObserver(handleIntersect, options);
      observer.observe(target);
    }
}

// GUI Button Fade Out ///////////////////////////////////////////////////////////////
function removeFadeOut( el, speed ) {
  var seconds = speed/1000;
  el.style.transition = "opacity "+seconds+"s ease";

  el.style.opacity = 0;
  setTimeout(function() {
      //el.parentNode.removeChild(el);
      el.classList.add("hidden");
  }, speed);
}

// setup a couple of audio players (Audio elements / <audio/>) /////////////////////////
const createPlayer = (sourceUrl, id) => {
  const player = new Audio(); //document.createElement('audio'); 
  player.src = sourceUrl;
  player.setAttribute("id", id);
  document.body.appendChild(player);

  player.oncanplay = () => {
    //player.volume = initialVolume;
    player.loop = true;
  };

  return player;
};

const playerIDs = ["a0", "a1", "a2"];
let currentVolume = [1, 0, 0];
let players = [
  createPlayer("/audio/track-1.mp3", playerIDs[0]),
  createPlayer("/audio/track-7-long.mp3", playerIDs[1]),
  createPlayer("/audio/track-3-long.mp3", playerIDs[2])
];


// crossfade function: 
// crossfade the two when this function is called

const crossfade = (playerA, playerB) => {
  // decrement playerA on every animation frame
  if (playerA.volume - 0.01 > 0) {
    playerA.volume -= 0.01;
  }
  else {
    playerA.volume = 0;
  }
  
  // increment playerB on every animation frame
  if (playerB.volume + 0.01 < 1) {
    playerB.volume += 0.01;
  }
  else {
    playerB.volume = 1;
  }
  
  if (playerA.volume > 0 || playerB.volume < 1) {
    // as long as we aren't at our targets, keep registering the increment / decrement
    // for the next animation frame
    requestAnimationFrame(() => crossfade(playerA, playerB));
  }
};


function handleIntersect(entries) {
    const [entry] = entries;
    entries.forEach(entry => {

        if (entry.isIntersecting 
            && entry.target.id === "d2"
            && entry.target.previousElementSibling.id === "d1") {
              crossfade(players[0], players[1]);
              crossfade(players[2], players[1]);
              setTimeout(setCurrentVolume, 2500);
              console.log("player 0 > player 1 in d1 > d2");

        } else if (entry.isIntersecting && entry.target.id === "d1") {
              crossfade(players[1], players[0]);
              setTimeout(setCurrentVolume, 2500);
              console.log("player 1 > player 0 in d1 part ii");

        } else if (entry.isIntersecting && entry.target.id === "d3") {
              crossfade(players[1], players[2]);
              crossfade(players[0], players[2]);
              setTimeout(setCurrentVolume, 2500);
              console.log("player 1 > player 2 in d2 > d3");

        } else if (entry.isIntersecting 
            && entry.target.id === "d2"
            && entry.target.nextElementSibling.id === "d3") {
              crossfade(players[2], players[1]);
              crossfade(players[0], players[1]);
              setTimeout(setCurrentVolume, 2500);
              console.log("player 2 > player 1 in d1 > d2");
        }
      });
    console.log(entries);
}

  // setup a simple UI to do all this
  const playButton = document.createElement("button");
  playButton.innerText = "start music";
  playButton.classList.add("play-button");
  playButton.onclick = () => {
    players[0].play();
    players[0].volume = 1;
    players[1].play();
    players[1].volume = 0;
    players[2].play();
    players[2].volume = 0;
    removeFadeOut(document.querySelector(".play-button"), 2000);

  };
  
  document.getElementById("d0").appendChild(playButton);


  function getCurrentVolume() {
    currentVolume.forEach((element, index) => {
      currentVolume[index] = players[index].volume;
      return element;
    });
    console.log(currentVolume);
  };

  function setCurrentVolume() {
    getCurrentVolume();
    players.forEach((element, index) => { 
      players[index].volume = currentVolume[index];
      return element;
    });
  };


  let scroll_d2 = document.getElementById("d2");
  const hardCutButton = document.createElement("button");
  hardCutButton.classList.add("play-button");
  hardCutButton.innerText = "hard cut";
  hardCutButton.onclick = () => {
    scroll_d2.scrollIntoView();
     
  };

  document.getElementById("d0").appendChild(hardCutButton);

  const stopButton = document.createElement("button");
  stopButton.innerText = "stop";
  stopButton.onclick = () => {
    players[0].pause();
    // players[0].volume = 1;
    players[1].pause();
    // players[1].volume = 0;
    players[2].pause();
    // players[2].volume = 0;
  };
  
  // document.body.appendChild(stopButton);
  
  // // trigger the crossfade
  // const crossfadeButton1 = document.createElement("button");
  // crossfadeButton1.innerText = "crossfade 1";

  // const crossfadeButton2 = document.createElement("button");
  // crossfadeButton2.innerText = "crossfade 2";
  
  // crossfadeButton1.onclick = () => crossfade(players[0], players[1]);
  // document.body.appendChild(crossfadeButton1);

  // crossfadeButton2.onclick = () => crossfade(players[1], players[2]);
  // document.body.appendChild(crossfadeButton2);
