$(document).ready(function() {
    $.ajax({
        url: "http://localhost:5434/get-drawings",
        method: "GET",
        success: function (drawings) {
            if(drawings.length > 0)
            {
                const base64Data = drawings[0].imageData;
                const img = new Image();
                img.src = "data:image/png;base64," + base64Data;
                
                
                img.onload = function () {
                    const canvas = document.getElementById("guessedWordPanel");
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            }
            else if(drawings.length > 1) {
                const base64Data = drawings[1].imageData;
                const img = new Image();
                img.src = "data:image/png;base64," + base64Data;
                
                img.onload = function () {
                    const canvas = document.getElementById("guessedWordPanel");
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            }
            else {
                console.log("No drawings found in the database.");    
            }
        },
        error: function (xhr, status, error) {
            console.error("Error retrieving drawings.", error);
        }        
    });
});