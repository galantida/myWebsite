function initImagePresenter() {
    document.body.innerHTML += "<div id = \"divImagePresenterCover\" style = \"visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:100%;background-color:black;opacity:0.5;\" onclick=\"hideImagePresenter();\" >.</div>"
        + "<div id=\"divImagePresenterDisplay\" class=\"divImagePresenterDisplay\" onclick=\"hideImagePresenter();\">"
        + "<img id=\"ImagePresenterImage\" alt=\"Expanded\" src=\"\" class=\"imageFrame\" />"
        + "</div>";
}

function DisplayImagePresenter(ImageID, ImagePath, width, height) {
    // get image information

    // update image
    Image = document.getElementById('ImagePresenterImage');
    Image.src = ImagePath;
    Image.width = width;
    Image.height = height;

    var coverArea = document.getElementById('divImagePresenterCover').style.visibility = 'visible';

    // update display 
    var displayArea = document.getElementById('divImagePresenterDisplay');
    displayArea.style.top = (getScroll() + 100) + 'px';
    displayArea.style.visibility = 'visible';
}

function hideImagePresenter() {
    document.getElementById('divImagePresenterDisplay').style.visibility = 'hidden';
    document.getElementById('divImagePresenterCover').style.visibility = 'hidden';
}

function getScroll() {
    if (window.pageYOffset != undefined) {
        return pageYOffset;
    }
    else {
        var sy, d = document, r = d.documentElement, b = d.body;
        sy = r.scrollTop || b.scrollTop || 0;
        return sy;
    }
}


