function ajax(url, handler) {
    var req = new XMLHttpRequest();
    if (!req) {
        alert('Browser not supported.');
        return;
    }

    req.onreadystatechange = function () {
        var resp;
        if (this.readyState === XMLHttpRequest.DONE) {
            console.log(req);
            if (this.status === 200) {
                resp = this.responseText;
                handler(resp);
            } else {
                handler('Ajax error, status: ' + this.status);
            }
        }
    };
    req.open('GET', url);
    req.send();
}

/*
    The PetFinder API only supports JSONP for cross-domain JavaScript requests.
    I researched/implemented a JSONP request without JQuery below.
*/
function requestJSONP(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName("body")[0].appendChild(script);

    script.onload = function () {
        this.remove();
    };
    console.log("Successfully ran JSONP");
}
