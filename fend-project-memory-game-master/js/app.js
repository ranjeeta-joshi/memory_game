/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint es5: true */

/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */



// Moves and Stars Intialization
var mCount = 0;
var moves = $("span.moves");
var nStar = 3;
moves[0].textContent = "0";


//Function to Increment Moves
function incrementMove() {
    mCount++;
    moves[0].textContent = mCount.toString();
};


//Function to set the stars
function setStars() {
    //var stars = $(".fa-star");
    if (mCount > 8) {
        nStar = (8 / mCount) * 3;
        nStar = Number(nStar.toPrecision(1));
        if (nStar < 3 && nStar > 0) {
            $(".fa-star")[nStar].style.visibility = "collapse";
        };
    }
    else if (mCount == 0) {
        for( var j = 0; j < 3; j++){
            $(".fa-star")[j].style.visibility = "visible";
        };
    };
};



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    "use strict";
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


// Function to generate the HTML code
function flipCard(class1, class2) {
    "use strict";
    let flipCardHTML = `<li class="${class1}">
                            <i class="${class2}"></i>
                        </li>`;
    return flipCardHTML;
}


//Function for Intial Setup
function initialSetup(shuffledCards) {
    "use strict";
    let cCards = $("li.card");
    for (let num in [...Array(shuffledCards.length).keys()]) {
        let class2 = shuffledCards[num].children.item("className").className;
        let flipCardHTML = flipCard("card", class2);
        $(cCards[num]).replaceWith(flipCardHTML);
        //$(shuffledCards[num]).className = "card";
    }

}

//Function to check if any card is open.!
function checkCardOpen() {
    let ccoCards = $("li.card")
    let count = 0;
    for (let num in [...Array(ccoCards.length).keys()]) {
        if (ccoCards[num].className == "card open show") {
            cardClass = ccoCards[num].children.item("className").className;
            count++;
        };
    };
    return count;
};


//Function to open the card
function openCard(cardToFlip) {
    let class2 = cardToFlip.children.item("className").className;
    let flipCardHTML = flipCard("card open show", class2);
    $(cardToFlip).replaceWith(flipCardHTML);
};


//Function to close the card
function closeCard(cardToFlip) {
    let class2 = cardToFlip.children.item("className").className;
    let flipCardHTML = flipCard("card", class2);
    $(cardToFlip).replaceWith(flipCardHTML);
};


//Function to match the card
function matchCard(cardToFlip) {
    let class2 = cardToFlip.children.item("className").className;
    let flipCardHTML = flipCard("card match", class2);
    $(cardToFlip).replaceWith(flipCardHTML);
};


//Function to get the card of opened card
function getClassOfOpenedCard() {
    let gcCards = $("li.card")
    for (let num in [...Array(gcCards.length).keys()]) {
        if (gcCards[num].className == "card open show") {
            cardClass = gcCards[num].children.item("className").className;
            return cardClass;
        };
    };
};


//Function to close the opened card
function closeOpenedCard(){
    let coCards = $("li.card");
    for (let num in [...Array(coCards.length).keys()]) {
        if (coCards[num].className == "card open show") {
            closeCard(coCards[num]);
        };
    };
};

//Function to match the opened Card
function matchOpenedCard(){
    let moCards = $("li.card");
    for (let num in [...Array(moCards.length).keys()]) {
        if (moCards[num].className == "card open show") {
            matchCard(moCards[num]);
        };
    };
};


//Function to Display Win message
function displayWinPage() {
    $(".congrat")[0].style.display = "flex";
    $(".move-star")[0].textContent = "With " + mCount.toString() + " Moves and " + nStar.toString() + " Stars.";
};


//Function to check the game is over!
function checkAllMatch(){
    let camCards = $("li.card");
    for (let num in [...Array(camCards.length).keys()]) {
        if (camCards[num].className == "card open show" || camCards[num].className == "card") {
            return;
        };
    };
    displayWinPage();
};


//Function to Handle the event generated at the time of click of card.    
function handler(event) {
    //alert(Object.getOwnPropertyNames(event))
    var target = $( event.target );
    //alert(target[0].className);
    if (target[0].className == "card") {
        if (checkCardOpen() == 0) {
            openCard(target[0]);
        }
        else if (checkCardOpen() == 1) {
            incrementMove();
            setStars();
            if (getClassOfOpenedCard() == target[0].children.item("className").className) {
                openCard(target[0]);
                matchOpenedCard();
                checkAllMatch();
            }
            else {
                openCard(target[0]);
                setTimeout(function(){
                    closeOpenedCard();
                }, 500);
            };
        };
    };
};

//Initial Setup
initialSetup(shuffle($("li.card")));


//Function to reset the game.
function resetGame() {
    moves[0].textContent = "0";
    mCount = 0;
    nStar = 3;
    setStars();
    initialSetup(shuffle($("li.card")));
};

//Soft click event for reset button.
$("i.fa.fa-repeat").click(function () {
    resetGame();
});

//Click event for list of cards.
$("ul").on("click", handler);

//Click event for play again button.
$("#play").click(function () {
    $(".congrat")[0].style.display = "none";
    resetGame();
});

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
