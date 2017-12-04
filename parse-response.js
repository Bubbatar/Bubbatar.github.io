/*
    Checks status code of API
    @param status is the code given back after a request from the PetFinder API
*/
function checkStatusCode(status) {
    let response = "Error Code: " + status;
    switch (status) {
        case '200':
            response += ". Invalid response!";
            break;
        case '201':
            response += ". Record is not found!";
            break;
        case '202':
            response += ". Daily limit was reached!";
            break;
        case '203':
            response += ". Invalid location input!";
            break;
        case '300':
            response += ". Unauthorized request!";
            break;
        case '301':
            response += ". Authenthication failure!";
            break;
        default:
            response += ". Internal error! Try again later.";
            break;
    }
    alert(response);
    return response;
}

/*
    @param responseText is the JSON file received back
    Parses general page response and picks which function to run based off information given back.
*/
function parseResponse (responseText){
    let response = responseText;
    let status = response['petfinder']['header']['status']['code']['$t'];
    if (status !== '100')
        return checkStatusCode(status); 

    let checker = response['petfinder'];
    if (checker['breeds']) {
        console.log("Function redirected to parseBreed successfully!");
        return parseResponseBreed(response);
    } 
    if (checker['shelters']) {
        console.log("Function redirected to parseShelter successfully!");
        return parseResponseShelter(response);
    }
}

/*
    Function parses response of when the user enters an animal
    and creates an array of breeds 
*/
function parseResponseBreed(responseText) {
    var response = responseText;
    var breedArray = [];
    var breedResult = response['petfinder']['breeds']['breed'];
    
    for (let i = 0; i < breedResult.length; i++) {
        breedArray.push(breedResult[i].$t);
    }
    introBreedNode.nodeValue = breedArray;
    return breedArray;
}

/*
Creates a table based off API information on User shelter
@param responseText is the JSON file received back

*/
function parseResponseShelter (responseText){
    let tableResponse = document.getElementById('tableInsert');
    let response = responseText['petfinder']['shelters']['shelter'];
    if (!response) {
        alert("Incomplete API response or mismatched error");
        return;
    }
    createShelterTable(tableResponse, response);
    mapToggle = document.getElementsByClassName('mapToggleButton');

    //Toggle view of google maps for individual shelters after the table is made
    for (let i = 0; i < mapToggle.length; i++) {
        mapToggle[i].addEventListener('click', function () {
            var div = document.getElementsByClassName('visibility')[i];
            div.classList.toggle("show");
        });
    }
}

function createShelterTable (tableSpot, response){
    var table = document.createElement("table");
    //Adds Bootstrap's CSS to the table
    table.className += "table table-bordered table-hover";
    var tableBody = document.createElement("tbody");
    var tableRow = table.insertRow(-1);
    //Creates Table Header based off arrayHeaders labels
    var arrayHeaders = ["Name", "City", "Zipcode", "Shelter ID", "Email", "Map"];
    for (let i = 0; i < arrayHeaders.length; i++) {
        var tableHeader = document.createElement("TH");
        var text = document.createTextNode(arrayHeaders[i]);
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
    }

    //X Columns down
    for (let i = 0; i < response.length; i++) {
        tableRow = table.insertRow(-1);
        //Y Headers (rows)
        for (let j = 0; j < arrayHeaders.length; j++) {
            let td = document.createElement("td");
            //Divides/Places information depending on header
            switch (j) {
                case 0:
                    var tdText = document.createTextNode(response[i]['name']['$t']);
                    break;
                case 1:
                    var tdText = document.createTextNode(response[i]['city']['$t']);
                    break;
                case 2:
                    var tdText = document.createTextNode(response[i]['zip']['$t']);
                    break;
                case 3:
                    var tdText = document.createTextNode(response[i]['id']['$t']);
                    break;
                case 4:
                    var tdText = document.createTextNode(response[i]['email']['$t']);
                    break;
                case 5:
                    let latitude = response[i]['latitude']['$t'];
                    let longitude = response[i]['longitude']['$t'];
                    var tdText = document.createElement("BUTTON");
                    tdText.className += "btn btn-light mapToggleButton";
                    var buttonText = document.createTextNode("Toggle Map");
                    tdText.appendChild(buttonText);
                    td.appendChild(createMapNode(latitude, longitude));
                    break;
                default:
                    var tdText = document.createTextNode("Error! Not a valid array number!");
                    break;
            }
            td.appendChild(tdText);
            tableRow.appendChild(td);
        }
        tableBody.appendChild(tableRow);
    }
    table.appendChild(tableBody);
    tableSpot.appendChild(table);
}

function createMapNode (latitude, longitude){
    let url = "https://maps.googleapis.com/maps/api/staticmap?";
    let key = "AIzaSyDqFxTRcfeoBx0Mkjyv6oH1E0jQIPnTeS8";
    let zoom = "13";
    let size = "300x300";
    let googleMap = document.createElement("IMG");
    url += "center=" + latitude + "," + longitude + "&key=" + key + "&size=" + size + "&zoom=" + zoom;
    googleMap.src = url;
    googleMap.className += 'visibility';
    return googleMap;
    //Example URL: https://maps.googleapis.com/maps/api/staticmap?center=34.1476,-117.2555&key=AIzaSyDqFxTRcfeoBx0Mkjyv6oH1E0jQIPnTeS8&size=400x400&zoom=13
}