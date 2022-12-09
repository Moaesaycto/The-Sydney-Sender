var total_generated = 0;
var curr_request = {};
var default_gen = 5;

var rangeElem = document.getElementById("range");

var rangeValue = function(){
    var newValue = rangeElem.value;
    var target = document.getElementById('rangeDisplay');
    if (newValue == 0) target.textContent = "Inner West";
    else if (newValue == 1) target.textContent = "City";
    else if (newValue == 2) target.textContent = "Outer Sydney";
    else if (newValue == 3) target.textContent = "Anywhere";
}

rangeElem.addEventListener("input", rangeValue);


var peopleElem = document.getElementById("people");

var peopleValue = function(){
    var newValue = peopleElem.value;
    var target = document.getElementById('peopleDisplay');
    if (newValue == 0) target.textContent = "Isolated";
    else if (newValue <= 3) target.textContent = "Some People";
    else if (newValue <= 7) target.textContent = "Crowded";
    else if (newValue <= 9) target.textContent = "Super Spreader";
}

peopleElem.addEventListener("input", peopleValue);


var physicalElem = document.getElementById("physical");

var physicalValue = function(){
    var newValue = physicalElem.value;
    var target = document.getElementById('physicalDisplay');
    if (newValue == 0) target.textContent = "Lazy";
    else if (newValue <= 4) target.textContent = "Some Walking";
    else if (newValue <= 7) target.textContent = "Work up a Sweat";
    else if (newValue <= 9) target.textContent = "Intense";
}

physicalElem.addEventListener("input", physicalValue);


var socialElem = document.getElementById("social");

var socialValue = function(){
    var newValue = socialElem.value;
    var target = document.getElementById('socialDisplay');
    if (newValue == 0) target.textContent = "Minimal Talking";
    else if (newValue <= 4) target.textContent = "Light Chit-Chat";
    else if (newValue <= 8) target.textContent = "Convo Centred";
    else if (newValue <= 9) target.textContent = "Introvert's Hell";
}

socialElem.addEventListener("input", socialValue);


var moneyElem = document.getElementById("money");

var moneyValue = function(){
    var newValue = moneyElem.value;
    var target = document.getElementById('moneyDisplay');
    if (newValue == 0) target.textContent = "Free";
    else if (newValue <= 4) target.textContent = "Cheap";
    else if (newValue <= 8) target.textContent = "Moderate";
    else if (newValue <= 9) target.textContent = "Mortgage";
}

moneyElem.addEventListener("input", moneyValue);


function submitReset() {
    document.getElementById("initmessage").textContent = "Your results will appear here.";
    if (total_generated == default_gen) document.getElementById("result_list").innerHTML = "";
    total_generated = 0;
    submit(null);
}

function submitAgain() {
    curr_request['start'] += default_gen;
    submit(curr_request);
}

function submit(json) {
    resetBackgrounds();
    if (checkForm() != 0) {
        document.getElementById("error").textContent = "Please fill out all aspects of the form.";
        document.getElementById("error").style.background = "rgb(234, 167, 167)";
        return;
    }

    if (json == null) {
        const resultElem = document.getElementById("results");
        resultElem.scrollIntoView({behavior: "smooth", block: "start"});
        json = createRequestJSON(default_gen);
        curr_request = json;
    }
    
    requestSubmit(json);
}

function checkForm() {
    const red = "rgb(234, 167, 167)";
    var food = document.querySelector('input[name = "food"]:checked');
    var alcohol = document.querySelector('input[name = "alcohol"]:checked');
    var transport = document.querySelector('input[name = "transport"]:checked');
    var time = document.querySelector('input[name = "time"]:checked');
    var freedom = document.querySelector('input[name = "freedom"]:checked');

    var unfilled = 0;
    if (food == null) {
        document.getElementById("question5").style.background = red;
        unfilled += 1;
    }
    if (alcohol == null) {
        document.getElementById("question6").style.background = red;
        unfilled += 1;
    }
    if (transport == null) {
        document.getElementById("question7").style.background = red;
        unfilled += 1;
    }
    if (time == null) {
        document.getElementById("question8").style.background = red;
        unfilled += 1;
    }
    if (freedom == null) {
        document.getElementById("question10").style.background = red;
        unfilled += 1;
    }

    return unfilled;
}

function resetBackgrounds() {
    const normal = "rgb(167, 216, 234)";
    document.getElementById("error").textContent = "";
    document.getElementById("error").style.background = normal;
    for (i = 5; i <= 10; i++) {
        if (i == 9) continue;
        document.getElementById("question".concat(i.toString())).style.background = normal;
    }
}

function displayResults(json) {
    var more_button = document.getElementById("load_button");
    if (more_button != null) {
        more_button.remove();
    }
    
    var results = document.getElementById("result_list");
    for (let i = json['start']; i < json['end']; i++) {
        curr_json = json[i.toString()]
        results.innerHTML += '<div class="resultcard"><h1>' + curr_json['result'] + '</h1><p>' + curr_json['result'] + " matched with a rating of " + curr_json['data'] + '</p></div>';
    }
    
    if (Object.keys(json).length - 2 == default_gen) {
        results.innerHTML += '<button class="more_button" onclick="submitAgain()" id="load_button">Load More</button>';
    }
    else {
        results.innerHTML += "<br><br>"
    }
}

function createRequestJSON(num) {
    var checkedValues = []; 
    var public = document.getElementById('publicTransport');
    var private = document.getElementById('privateTransport');

    if (public.checked) {
        checkedValues.push("public");
    }
    if (private.checked) {
        checkedValues.push("drive");
    }

    const json = {
        "range": parseInt(document.getElementById("range").value),
        "people": parseInt(document.getElementById("people").value),
        "physical": parseInt(document.getElementById("physical").value),
        "social": parseInt(document.getElementById("social").value),
        "food": document.querySelector('input[name = "food"]:checked').value == "yes",
        "alcohol": document.querySelector('input[name = "alcohol"]:checked').value == "yes",
        "transport": checkedValues,
        "time": document.querySelector('input[name = "time"]:checked').value,
        "money": parseInt(document.getElementById("money").value),
        "freedom": document.querySelector('input[name = "freedom"]:checked').value == "free",
        "start": total_generated,
        "load": num,
    }

    curr_request = json;
    total_generated += num;
    return json;

}

function requestSubmit(request) {
    fetch(`${window.origin}/submit`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(request),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    }).then(response => response.json()).then(json => displayResults(json));
}