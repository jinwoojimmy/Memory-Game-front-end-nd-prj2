
const openCardList = [];
var tryCount = 0;
var matchCount = 0;
var startTime;
var starCount = 3;

window.onload = function() {
  initializeGame();
};

function initializeGame() {
  /*
   * Create a list that holds all of your cards
   */
  const deck = document.querySelector('.deck');
  deck.innerHTML= '';
  const container = document.createDocumentFragment();

  let iconList = ['fa-cube', 'fa-paper-plane-o', 'fa-bicycle', 'fa-bolt', 'fa-bomb', 'fa-leaf', 'fa-diamond', 'fa-anchor'];
  iconList = shuffle(iconList.concat(iconList));
  for (let i = 0; i < 16 ; i++) {
    let card = document.createElement('li');
    card.className = 'card';
    let icon = document.createElement('i');
    icon.className = 'fa ' + iconList[i];

    card.appendChild(icon);
    container.appendChild(card);
  }
  deck.appendChild(container);

  startTime = performance.now();
}



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


function processCard(element) {
  element.classList.add('show');

  if (openCardList.length) {
    const scorePanel = document.querySelector('.score-panel');
    const starPanel = scorePanel.querySelector('.stars');
    const temp = openCardList.pop();
    tryCount++;
    scorePanel.querySelector('.moves').innerText = tryCount;
    // set starCount
    const evalUnit = 10;
    if (tryCount >= evalUnit * 3) {
      starCount = 1;
    } else if (tryCount >= evalUnit * 2) {
      starCount = 2;
    } else {
      starCount = 3;
    }
    if (scorePanel.getElementsByClassName('fa-star').length != starCount) {
      scorePanel.querySelector('.stars').removeChild(scorePanel.querySelector('.stars').firstElementChild);
    }

    if (element.firstElementChild.className
      == temp.firstElementChild.className) {
      // match case
      temp.classList.add('match');
      element.classList.add('match');
      matchCount++;
      displayMatchModal();

    } else {
      // no-match case
      temp.classList.add('miss');
      element.classList.add('miss');

      setTimeout(function(){
          temp.classList.remove('open', 'show', 'miss');
          element.classList.remove('open', 'show', 'miss');
      }, 700);
    }

  } else {
    // first try among two
    openCard(element);
  }
}

function openCard(element) {
    openCardList.push(element);
    element.classList.add('open');
};


// event listener
document.body.querySelector('.deck').addEventListener('click', function(e) {

   if (e.target && e.target.matches('li.card')) {
     const targetClassList = e.target.classList;
     if (targetClassList.contains('match') || targetClassList.contains('open')) {
       console.log('Already matched or is open!!!');
       return;
     }

     processCard(e.target);
     if (matchCount == 8) {
       // game over ; // TODO: open pop up
       displayModal();
     }
   }
 });

// restart event listener
document.querySelector('.score-panel').querySelector('.restart').addEventListener('click',
   function() {location.reload();}
);

// modal
function displayModal() {
   const modal = document.getElementById('myModal');
   modal.style.display = "block";
   // time
   const spentTime = Math.round((performance.now() - startTime)/1000);
   const spentMinute = Math.floor(spentTime / 60);
   const spentSecond = spentTime - (spentMinute * 60);
   modal.querySelector('.time').innerText = ('0' + spentMinute).slice(-2) + ':' + ('0' + spentSecond).slice(-2);
   // moves
   modal.querySelector('.moves').innerText = tryCount;
   // stars
   modal.querySelector('.stars').innerText = starCount;

   // Button
   modal.querySelector('.restart').addEventListener('click', function() {
	    location.reload();
    });
   // close button
   modal.querySelector('.close').addEventListener('click', function() {
     modal.style.display = "none";
   })

 }

 function displayMatchModal() {
   const matchModal = document.getElementById('match-modal');
   matchModal.style.display = 'block'

   setTimeout(function() {
     matchModal.style.display = 'none';
   }, 700)
 }
