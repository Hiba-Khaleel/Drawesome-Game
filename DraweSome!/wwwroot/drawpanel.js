// Drawing app functionality
const canvas = document.getElementById('drawingPanel');
const ctx = canvas.getContext('2d');


// Timer settings
const timerDisplay = document.getElementById('drawing-timer');
let isDrawingAllowed = true; 
let countdown = 30; 

timerDisplay.textContent = countdown + "s";

// Start Timer on page load
const timerInterval = setInterval(() => {
    if (countdown <= 0) {
        clearInterval(timerInterval); // Stops timer
        isDrawingAllowed = false; // Disables drawing
        timerDisplay.textContent = 0 + "s";
        alert("Time's up! Please submit your drawing.")
    } else {
        timerDisplay.textContent = countdown + "s";
        countdown--;

        if (countdown <= 5) {
            timerDisplay.style.color = "red";  // Turns red for dramatic effect
        } else if (countdown <= 15) {
            timerDisplay.style.color = "yellow";
        } else {
            timerDisplay.style.color = "white";
        }
    }
}, 1000); // Update timer every second


// Event listeners for drawing
let isDrawing = false;
let previousPoint = null;
let linesDrawn = 0;

canvas.addEventListener('mousedown', (e) => {
    if (!isDrawingAllowed) {
        alert("Times's up! You can't draw anymore.");
        return;
    } else if (linesDrawn >= 3) {
        alert("You have used all 3 lines!");
        return;
    } else {
        isDrawing = true;
        previousPoint = {x: e.offsetX, y: e.offsetY};
    }
});


// Continue drawing on mouse move
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing || !previousPoint) return;
    ctx.beginPath();
    ctx.moveTo(previousPoint.x, previousPoint.y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    previousPoint = { x: e.offsetX, y: e.offsetY };
});

// Stop drawing on mouse up
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    linesDrawn++;
});

$(document).ready(function () {
    const $canvas = $('#drawingPanel');
    const $submitLink = $('#submitDrawing');

    $submitLink.on('click', function (event) {
        event.preventDefault(); 

        const drawingWord = "Snail";

        const imageData = $canvas[0].toDataURL("image/png");  

        
        $.ajax({ 
            url: "http://localhost:5434/save-drawing", 
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                DrawingWord: drawingWord,
                DrawingData: imageData
            }),
            success: function (response) {
                console.log("Success:", response);
                window.location.href = "guess.html"; 

            },
            error: function (xhr, status, error) { 
                console.error("Error:", error);   
                alert("Failed to save drawing.");
            }
        });
    });
});

