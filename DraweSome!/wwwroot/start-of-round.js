
$(document).ready(function () {
    
    $("#next-round").on("click", function (e) {
        e.preventDefault(); 
        
        $.ajax({
            url: "http://localhost:5434/clear-drawings",
            method: "DELETE",
            success: function(response) {
                console.log(response);
                
                window.location.href = "start-of-round.html";
            },
            error: function(xhr, status, error) {
                console.error("Error clearing drawings.", error);
                alert("Could not clear drawings. Please try again.");
            }
        })
    })
})