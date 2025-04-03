
let drawWord

let roundCounter = 0;

$(document).ready(function () {
    if (window.location.pathname.includes("start-of-round")){
        roundCounter = localStorage.getItem("roundCounter");
        roundCounter++;
        localStorage.setItem("roundCounter", roundCounter);
        console.log(roundCounter); //skriver aldrig ut värdet
        console.log("counter" + player1);
        console.log("counter" + player2);
    }       
});
$(document).ready(function () {
    const allowedPages =['start-of-round.html', 'draw.html', 'guess.html'];
    if (allowedPages.includes(window.location.pathname.split('/').pop())){
        assignDrawer();
    }
});
function assignDrawer() {
    const player1 = localStorage.getItem("player1");
    const player2 = localStorage.getItem("player2");
    roundCounter = localStorage.getItem("roundCounter");
    if (roundCounter % 2 !== 0){
        $('#drawing-player').text(player1);
        $('#guessing-player').text(player2);
        console.log("drawer " + player1);
        console.log("guesser " + player2);
        console.log("counter " + roundCounter);
    }
    else{
        $('#drawing-player').text(player2);
        $('#guessing-player').text(player1);
        console.log("drawer " + player2);
        console.log("guesser " + player1);
        console.log("counter " + roundCounter);
    }
} 



$(document).ready(function () {
    const players = JSON.parse(sessionStorage.getItem('players')) || ["Player 1", "Player 2"];
    const player1Score = parseInt(sessionStorage.getItem('player1Score')) || 0;
    const player2Score = parseInt(sessionStorage.getItem('player2Score')) || 0;

    let playerScores = [
        { name: players[0], score: player1Score },
        { name: players[1], score: player2Score }
    ];

    playerScores.sort((a, b) => b.score - a.score);

    const leaderboard = $('#leader-board');
    leaderboard.empty(); 
    playerScores.forEach(player => {
        leaderboard.append(`
            <li>
                <p class="player-score">${player.name}: ${player.score} points</p>
            </li>
        `);
    });
});



// welcome-page:

$('#start-new-game').on('click', function () {
    window.location.href = 'players.html';
});


// players-page:
function startRound() {
    window.location.href = "start-of-round.html"; 
}



// start-of-round-page:

$('#start-of-round').on('click', function () {
    drawWord = $("#draw-word").val();
    localStorage.setItem("drawWord", drawWord);
    window.location.href = 'draw.html';
    console.log(drawWord);
});



$(document).ready(function () {
  
    let correctWord = localStorage.getItem("drawWord") || "Snail";  

    let pointsCounter = 100;

    let players = JSON.parse(localStorage.getItem("players")) || ["Player 1", "Player 2"];

    let roundCounter = parseInt(localStorage.getItem("roundCounter")) || 0;

    const drawingPlayer  = players[ roundCounter % players.length ];
    const guessingPlayer = players[ (roundCounter + 1) % players.length ];

    let player1Score = parseInt(localStorage.getItem("player1Score")) || 0; 
    let player2Score = parseInt(localStorage.getItem("player2Score")) || 0; 

    let leaderboardHtml = `
        <li>
            <h3>${players[0]}: ${player1Score} pts</h3>
        </li>
        <li>
            <h3>${players[1]}: ${player2Score} pts</h3>
        </li>
    `;
    $("#leader-board").html(leaderboardHtml);
    $("#player1-score").text(player1Score);
    $("#player2-score").text(player2Score);

    $('#submit-guess').on('click', function (event) {
        event.preventDefault(); 

        let playerGuess = $('#player-guess').val().trim().toLowerCase();
        const isCorrect = (playerGuess === correctWord.toLowerCase());

        if (isCorrect) {
            
            let scoreKey;
            if (guessingPlayer === players[1]) {
                scoreKey = "player1Score";
            } else {
                scoreKey = "player2Score";
            }

            let currentScore = parseInt(localStorage.getItem(scoreKey)) || 0;

            currentScore += pointsCounter;

            localStorage.setItem(scoreKey, currentScore.toString());

            window.location.href = "end-of-round.html";
        }
        else {
        
            pointsCounter -= 20;
            $('#points-counter').text(pointsCounter); 

            $('#wrong-guesses').append(`<li>${playerGuess}</li>`);
            console.log("Wrong guess:", playerGuess);

            if (pointsCounter < 20) {
                alert("You have no guesses left!");
                window.location.href = "end-of-round.html";
            }
        }
    });
});




// end-of-round-page:

// redirect to start-of-round
$('#next-round').on('click', function () {
    window.location.href = 'start-of-round.html'; 
});

// redirect to end-of-game
$('#finish-game').on('click', function () {
    window.location.href = 'end-of-game.html';
});



// end-of-game-page:

$('#play-again').on('click', function () {
    window.location.href = 'players.html';
});

$('#quit-game').on('click', function () {
    window.close();
    window.location.href = "welcome.html"; 
});









