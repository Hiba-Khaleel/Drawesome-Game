$(document).ready(function () {
    var canvas = $("#guessedWordPanel")[0];
    var ctx = canvas.getContext("2d");

    ctx.font = "100px Arial";
    ctx.fillStyle = "#525453";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var word = localStorage.getItem("drawWord");

    ctx.fillText(word, canvas.width / 2, canvas.height / 2);
});




