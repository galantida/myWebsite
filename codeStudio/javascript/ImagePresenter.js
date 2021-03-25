// call on page load to add needed elements to the dom.
function initImagePresenter() {
    document.body.innerHTML += "<div id=\"imagePresenterCover\" style=\"position:absolute; top:0px; left:0px; width:100%; height:100%;text-align:center;background-color:black;opacity:0.75;visibility:hidden;position:fixed;\" onclick=\"imagePresenterHide();\" ></div>";

    document.body.innerHTML += "<div id=\"imagePresenterPositioning\" style=\"position:fixed; top:100px; left:0px; width:100%; text-align:center;visibility:hidden;\" onclick=\"imagePresenterHide();\">"
        + "<div id=\"imagePresenterFrame\" class=\"imageFrame\" style=\"background-position:center;background-repeat:no-repeat;background-size:cover;margin:auto;border:5px solid white;\" >"
        + "</div></div>";
}

// function to call when an image is clicked
function imagePresenterPresent(imagePath, desiredWidth, desiredHeight) {
    // update image and size
    var frame = document.getElementById('imagePresenterFrame');
    frame.style.backgroundImage = "url('" + imagePath + "')";
    imagePresenterSize(imagePath, desiredWidth, desiredHeight);

    // display image and page cover
    document.getElementById('imagePresenterPositioning').style.visibility = "visible";
    document.getElementById('imagePresenterCover').style.visibility = "visible";
}

// hide image and remove page cover
function imagePresenterHide() {
    
    document.getElementById('imagePresenterPositioning').style.visibility = "hidden";
    document.getElementById('imagePresenterCover').style.visibility = "hidden";
}

function imagePresenterSize(imagePath, desiredWidth, desiredHeight) {
    const img = new Image();
    img.onload = function () {
        var frame = document.getElementById('imagePresenterFrame');

        if (desiredWidth != null) {
            // scaled based on a fixed width
            frame.style.width = desiredWidth + "px";
            var newHeight = (desiredWidth / this.width) * this.height;
            frame.style.height = newHeight + "px";
        }
        else {
            // scaled based on a fixed height
            frame.style.height = desiredHeight + "px";
            var newWidth = (desiredHeight / this.height) * this.width;
            frame.style.width = newWidth + "px";
        }
    }
    img.src = "" + imagePath + "";
}


