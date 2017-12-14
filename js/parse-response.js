/*
    Checks status code of Petfinder API
    @param status is the code received after a request from the PetFinder API.
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
    Cleans dynamically created tables / content from website
    @param tableResponse is an HTML div where dynamic content is placed.
*/
function cleanTable(tableResponse) {
    if (typeof tableResponse == 'object') {
        while (tableResponse.firstChild) {
            tableResponse.removeChild(tableResponse.firstChild);
        }
    }
}

/*
    @param responseText is the JSON file received back
    Parses general page and picks which function to run based off information given back.
*/
function parseResponse (response){
    let status = response['petfinder']['header']['status']['code']['$t'];
    if (status !== '100')
        return checkStatusCode(status); 

    let checker = response['petfinder'];
    if (checker['shelters']) {
        let shelters = response['petfinder']['shelters']['shelter'];
        if (!shelters) {
            alert("Incomplete API response / mismatched error");
            return;             
        }
        else 
            return parseResponseShelter(shelters);
    }
    if (checker['pets']){
        let pets = response['petfinder']['pets']['pet'];
        if (!pets){
            alert("Incomplete API response / mismatched error");
            return;            
        }
        else
            return parseResponsePet(pets);
    }
}

/* 
    Dynamically creates a rows/grid to display pet information.
    @param response is the JSON file received back
*/

function parseResponsePet (response) {
    let content = document.getElementById('petContent');

    /*
    Var 'i' are the numbers of columns reaching var 'total', the max number of columns. 
        Each new column has a div separator.
    Var 'j' are the numbers of rows to fill each column up with content.
    Var 'Position' is used to traverse the json separately.
    */
    let total = 5;
    for (let i = 0, position = 0; i < total; i++) {
        let divRow = document.createElement("DIV");
        divRow.className += "row";
        for (let j = 0; j < 3; j++, position++){
            divRow.appendChild(createPetNode(position, response));
        }
        content.appendChild(divRow);
    }
}

/*
Creates a table based off API information on User shelter
@param response is the JSON file received back
*/
function parseResponseShelter (response){
    let tableResponse = document.getElementById('tableInsert');

    tableResponse.appendChild(createShelterTable(response));
    mapToggle = document.getElementsByClassName('mapToggleButton');

    //Creates Google Maps for individual shelters after list is made
    for (let i = 0; i < mapToggle.length; i++) {
        mapToggle[i].addEventListener('click', function () {
            var div = document.getElementsByClassName('visibility')[i];
            div.classList.toggle("show");
        });
    }
}

/* 
    Dynamically creates and returns pets in a node.
    For the purpose of this website, it's been modified to only do 4.
*/
function createPetNode(position, response) {
    let pet = document.createElement("DIV");

    pet.className += "col-md-3 col-sm-6 col-xs-12 thumbnail";
    let gender = document.createTextNode(response[position]['sex']['$t']);
    if (gender.nodeValue === 'F') {
        gender.nodeValue = "Female ";
    } else if (gender.nodeValue === 'M') {
        gender.nodeValue = "Male ";
    } else
        gender.nodeValue = "? ";
    let description = document.createTextNode(response[position]['description']['$t']);
    let age = document.createTextNode(response[position]['age']['$t']);
    let name = document.createTextNode(response[position]['name']['$t'] + ' [' + age.nodeValue + ' ' + gender.nodeValue + ' ' + response[position]['animal']['$t'] + ']');
    let picture = document.createElement('IMG');
    let temp = response[position]['media']['photos']['photo'];
    let ID = document.createTextNode('[' + response[position]['id']['$t'] + ']');
    //Searches API back for 'pn' sized pictures, ~300px in width.
    for (let i = 0; i < temp.length; i++) {
        if (temp[i]['@size'] == 'pn')
            picture.src = temp[i]['$t'];
    }
    let title = document.createElement('p');
    title.appendChild(name);
    pet.appendChild(title);
    pet.appendChild(picture);

    let paragraph = document.createElement('p');
    paragraph.appendChild(description);
    pet.appendChild(paragraph);
    console.log(pet);
    return pet;
}

/*
    Creates and returns a static google map node of a given coordinates
    @param latitude and logitude are used to create map
*/
function createMapNode (latitude, longitude){
    let url = "https://maps.googleapis.com/maps/api/staticmap?";
    const key = "AIzaSyDqFxTRcfeoBx0Mkjyv6oH1E0jQIPnTeS8";
    const zoom = "14";
    const size = "300x300";
    let googleMap = document.createElement("IMG");
    url += "center=" + latitude + "," + longitude + "&key=" + key + "&size=" + size + "&zoom=" + zoom;
    googleMap.src = url;
    googleMap.className += 'visibility';
    return googleMap;
}


/*
    Creates a table node of shelters based off user input
    @param response is json file passed to function.
*/
function createShelterTable (response) {
    var table = document.createElement("table");

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


    //Var 'i' is the number of table columns
    //Var 'j' is the number of table rows
    for (let i = 0; i < response.length; i++) {
        tableRow = table.insertRow(-1);
        for (let j = 0; j < arrayHeaders.length; j++) {
            let td = document.createElement("td");
            //Divides/Places information depending on table's header location.
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
                    var tdText = document.createTextNode("Error! Enountered an invalid array number to create table!");
                    break;
            }
            td.appendChild(tdText);
            tableRow.appendChild(td);
        }
        tableBody.appendChild(tableRow);
    }
    table.appendChild(tableBody);
    return table;
}