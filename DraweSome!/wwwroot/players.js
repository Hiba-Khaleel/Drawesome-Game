
$(document).ready(function () {


    $("#submit-players").click(function () {
        const player1 = $("#player1").val();
        const player2 = $("#player2").val();
        localStorage.setItem("player1", player1);
        localStorage.setItem("player2", player2); 
        
        if (!player1 || !player2) {
            alert("Please enter names for both players.");
            return;
        }

        const playersArray = [player1, player2];
        localStorage.setItem("players", JSON.stringify(playersArray));

        localStorage.setItem("roundCounter", "0");

        localStorage.setItem("player1Score", "0");
        localStorage.setItem("player2Score", "0");

        window.location.href = "start-of-round.html";
    });
});
