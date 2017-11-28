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
    Parses general page response and picks which function to run based off information given back
*/
function parseResponse (responseText){
    let response = responseText;
    let status = response['petfinder']['header']['status']['code']['$t'];
    if (status !== '100')
        return checkStatusCode(status); 

    let checker = response['petfinder'];

    if (checker['breeds']) {
        console.log("Function ran breed successfully!");
        return parseResponseBreed(response);
    } 
    if (checker['shelters']) {
        console.log("Function ran shelter successfully!");
        return parseResponseShelter(response);
    }
}

/*
Function parses response of when the user enters an animal
and creates an array of breeds of the 

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
@param responseText is JSON file received back

*/
function parseResponseShelter (responseText){
    let tableResponse = document.getElementById('step2');
    let response = responseText['petfinder']['shelters']['shelter'];
    if (!response) {
        alert("Incomplete API response or mismatched error");
        return;
    }
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");

    //Adds Bootstrap's CSS to the table
    table.className += "table table-bordered table-hover";
    var shelterArray = ["Name", "City", "Zipcode", "Shelter ID", "Email", "Map"];

    var tableRow = table.insertRow(-1);
    //Creates Table Header based off shelterArray labels
    for (let i = 0; i < shelterArray.length; i++) {
        var tableHeader = document.createElement("TH");
        var text = document.createTextNode(shelterArray[i]);
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
    }
    //10 columns down
    for (let i = 0; i < response.length; i++){
        tableRow = table.insertRow(-1);    
        //5 Header (rows)
        for (let j = 0; j < shelterArray.length; j++){
            let td = document.createElement("td");
            //Divides/Places information depending on header
            switch(j) {
                case 0:
                    console.log("0");
                    var tdText = document.createTextNode(response[i]['name']['$t']);
                    break;
                case 1:
                    console.log("1");
                    var tdText = document.createTextNode(response[i]['city']['$t']);
                    break;
                case 2:
                    console.log("2");
                    var tdText = document.createTextNode(response[i]['zip']['$t']);
                    break;
                case 3:
                    console.log("3");
                    var tdText = document.createTextNode(response[i]['id']['$t']);
                    break;
                case 4:
                    console.log("4");
                    var tdText = document.createTextNode(response[i]['email']['$t']);
                    break;
                case 5:
                    console.log("5");
                    let latitude = response[i]['latitude']['$t'];
                    let longitude = response[i]['longitude']['$t'];
                    var tdText = document.createTextNode(latitude + " , " + longitude);
                    break;
                default: var tdText = document.createTextNode("Error! Not a valid array number!");
            }
            td.appendChild(tdText);
            tableRow.appendChild(td);
        }
        tableBody.appendChild(tableRow); 
    }
    table.appendChild(tableBody);
    tableResponse.appendChild(table);
}


function createMap (latitude, longitude){

    // https://maps.googleapis.com/maps/api/staticmap?center=34.1476,-117.2555&key=AIzaSyDqFxTRcfeoBx0Mkjyv6oH1E0jQIPnTeS8&size=400x400


}
