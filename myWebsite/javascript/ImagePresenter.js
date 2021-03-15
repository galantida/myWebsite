function DisplayImagePresenter(ImageID, ImagePath, width, height) {
    // get image information

    // update image
    Image = document.getElementById('ImagePresenterImage');
    Image.src = ImagePath;
    Image.width = width;
    Image.height = height;

    // update display 
    DisplayArea = document.getElementById('divImagePresenterDisplay');
    DisplayArea.style.top = (GetScroll() + 100) + 'px';
    DisplayArea.style.visibility = 'visible';
}

function HideImagePresenter() {
    document.getElementById('divImagePresenterDisplay').style.visibility = 'hidden';
}

function GetScroll() {
    if (window.pageYOffset != undefined) {
        return pageYOffset;
    }
    else {
        var sy, d = document, r = d.documentElement, b = d.body;
        sy = r.scrollTop || b.scrollTop || 0;
        return sy;
    }
}