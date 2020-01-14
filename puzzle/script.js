'use strict'

let cardWasFlipped = false; // Remembers that the first card was flipped
let gameCompleted = false; // Detects when user wins
let cardsBlocked = false; // Prevents selection of cards momentarily
let firstCard, secondCard; // Remembers selected cards
let score = 0; // Total score of the user

/**
 * Shuffles the cards every time the page refreshes
 */
function shuffleCards() {
  /* Generates a random set of numbers */
  let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const randomNumbers = [];
  let i = nums.length;
  let j = 0;
  while (i--) { // generates random number, pushes the number from nums Array to randomNumbers without repeating
    j = Math.floor(Math.random() * (i + 1));
    randomNumbers.push(nums[j]);
    nums.splice(j, 1); // deletes de numbers from old array to prevent repetition
  }

  /* Assigns a random 'source' parameter to the front face html cards */
  let frontFaceCards = document.getElementsByClassName('front-face');
  const arrayOfCardsImages = ['./imgs/candy.svg', './imgs/candy.svg', './imgs/axe.svg', './imgs/axe.svg', './imgs/bat.svg', './imgs/bat.svg', './imgs/candle.svg', './imgs/candle.svg', './imgs/cauldron.svg', './imgs/cauldron.svg', './imgs/broom.svg', './imgs/broom.svg']
  for (let index = 0; index < arrayOfCardsImages.length; index++) {
    frontFaceCards[index].src = arrayOfCardsImages[randomNumbers[index]];
  }
  console.log('👋🏻👋🏻 Cards shuffled 👋👋🏻 ');
};

/**
 * Refreshes the scoreboard items
 */
function showScoreBoard() {
  let listOfScores = '';
  const arrayOfLocalStorageValues = [];
  for (let i = 0; i < localStorage.length; i++) {
    arrayOfLocalStorageValues.push(localStorage.getItem(localStorage.key(i))); // Obtains the key values
  }
  const arrayOfLocalStorageKeys = Object.keys(localStorage); // Obtains the name of the keys

  for (let index = 0; index < arrayOfLocalStorageKeys.length; index++) {
    listOfScores += arrayOfLocalStorageKeys[index] + ': ' + arrayOfLocalStorageValues[index] + '<br>'; // Unifies every key with its value
  }

  document.querySelector('html > body> div.scoreboard').innerHTML = listOfScores; // Displays them in the DOM
};

/**
 * Registers the name of the player in the scoreboard
 */
function setScoreToBoard() {
  const name = prompt('What\'s your name?');
  localStorage.setItem(name, score);
  showScoreBoard(); // Refreshes the scoreboard
};

/**
 * Displays the current score count
 * @param {Integer} points 
 */
function setScore(points) {
  score += points;
  if (score < 0) {
    document.getElementById('score').innerText = '';
    document.getElementById('score').innerText = '0';
    score = 0;
    console.log(`🎫 Score: ${score}`)
  } else {
    document.getElementById('score').innerText = '';
    document.getElementById('score').innerText = score;
    console.log(`🎫 Score: ${score}`)
  }
};

/**
 * Verifies that the user has completed the game
 */
function checkGameStatus() {
  if (document.getElementsByClassName('match').length == 12) setScoreToBoard();
};

/**
 * Flips the selected card
 */
function flipCard() {
  if (!cardsBlocked) {
    if (cardWasFlipped) {
      secondCard = this;
      if (firstCard.firstElementChild.src === secondCard.firstElementChild.src) {
        /*-------------------
          Cards did match!
        ---------------------*/
        console.log('✅ Cards matched')

        /* Remove Event Listeners from selected cards */
        firstCard.removeEventListener('click', flipCard)
        secondCard.removeEventListener('click', flipCard)
        /* The card is kept flipped */
        this.classList.add('flip');
        /* Assigns the cards colors for success status*/
        firstCard.firstElementChild.style.background = 'green';
        secondCard.firstElementChild.style.background = 'green';
        firstCard.classList.add('match');
        secondCard.classList.add('match');
        /* Updates Current Score */
        setScore(50);
        /* Reset cards identity variables for later use */
        firstCard = '';
        secondCard = '';
        cardWasFlipped = false;
        checkGameStatus();
      } else if (secondCard !== '') {
        /*-------------------
          Cards did NOT match :(
        ---------------------*/
        console.log('❌ Cards did not match')

        /* Prevents selection of other cards while displaying failure status */
        cardsBlocked = true;
        /* Updates Current Score */
        setScore(-15);
        /* Temporarily flips the second card */
        this.classList.add('flip');
        /* Assigns the colors for failure status*/
        secondCard.firstElementChild.style.background = 'yellow';
        firstCard.firstElementChild.style.background = 'yellow';
        /* After 1.5 seconds, reset colors, variables and flip over the cards */
        setTimeout(() => {
          /* Flip over the cards */
          firstCard.classList.remove('flip');
          secondCard.classList.remove('flip');
          /* Default background card color */
          firstCard.firstElementChild.style.background = '#424549';
          secondCard.firstElementChild.style.background = '#424549';
          firstCard.addEventListener('click', flipCard)
          /* Reset cards identifier variables for later use */
          cardWasFlipped = false;
          cardsBlocked = false;
        }, 1500);
      }
    } else {
      console.log('👋🏻 Flipped 1st card')
      /* Temporarily flips the first card */
      this.classList.add('flip');
      /* Disables its self selection*/
      this.removeEventListener('click', flipCard)
      /* Remembers the first card */
      firstCard = this;
      /* Remembers that the card was flipped */
      cardWasFlipped = true;
    }
  } else {
    console.log('⛔️️ Flipping is blocked momentarily');
  }
};

shuffleCards();
showScoreBoard();

/* Registers all cards from the DOM */
const cards = document.querySelectorAll('.memory-card');
/* Every card gets triggered by a click */
cards.forEach(card => card.addEventListener('click', flipCard));
