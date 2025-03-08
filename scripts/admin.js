//load the admin page and set the checkbox to the current debug mode if it doesnt exist create it and set it to false
function loadAdmin(){
    debug = localStorage.getItem("debug") == "true"
    if(debug == null){
        debug = false;
        localStorage.setItem("debug", debug);
    }
    checkbox = document.getElementById("debug-checkbox");
    checkbox.innerHTML = `<img style="filter: invert(1);" src="img/check_${debug ? "1" : "0"}.svg" alt="checkmark">`;
    console.log("done");
}
//toggle debug mode and save the value to localstorage
function toggleDebug(){
    debug = localStorage.getItem("debug") == "true"
    if(debug == null){
        debug = false;
    }
    checkbox = document.getElementById("debug-checkbox");
    checkbox.innerHTML = `<img style="filter: invert(1);" src="img/check_${debug ? "0" : "1"}.svg" alt="checkmark">`;
    localStorage.setItem("debug", !debug);
}
//reset the localstorage and reload the page
function reset(){
    localStorage.clear();
    location.reload();
}