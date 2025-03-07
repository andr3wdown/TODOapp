let todo = null;
let editing = false;
let current_task = null;
let task_template = {
    id: -1,
    text: "",
    subtasks: [],
    completed: false
};
let subtask_template = {
    id: -1,
    text: "",
    completed: false
};

//initialize the todo object from local storage if it exists otherwise create a new empty one
function initialize(){
    try{
        todo = JSON.parse(localStorage.getItem("todo"));
    }
    catch{
        todo = {
            nextId: 0,
            tasks: {}
        };
    }
}

//delete subtask with id subtaskId
function deleteSubtask(subtaskId) {
    let subtask = document.getElementById(subtaskId);
    subtask.remove();
}

//toggles the completion status of the subtask with subtaskId and changes the icon
function toggleSubtask(subtaskId){
    let subtask = document.getElementById(subtaskId);
    let checkbox = subtask.querySelector('.subtask-complete');
    let toggled = checkbox.getAttribute("toggled") == "true" ? true : false;

    //change icon depending on the previous state of toggled
    checkbox.innerHTML = `<img class="icon" src="img/check_${toggled ? "0" : "1"}.svg" alt="checkmark">`;
    //change toggled to new state
    if(toggled){
        checkbox.setAttribute("toggled", "false");
        toggled = false;
    }
    else{
        checkbox.setAttribute("toggled", "true");
        toggled = true;
    }
}

//adds a new subtask to a task
function addSubtask(taskId){
    if(todo == null){
        alert("Error: todo object not initialized!");
        return;
    }
    let subtaskContainer = document.getElementById("subtask-container");
    current_subtask = Object.assign({}, subtask_template);
    //fetch the template for a subtask card from templates folder
    //if the template is not found, log the error
    fetch("../templates/subtask.html").then(response => response.text()).then(template => {
        template.replaceAll("_task", todo.nextId);
        template.replaceAll("_subid", );
        subtaskContainer.innerHTML += template;
        console.log(template);
    }).catch(error => console.log(error));
}




/*
//starts editing subtask with id subtaskId
function startEditSubtask(subtaskId){
    let subtask = document.getElementById(subtaskId);
    let subtaskText = subtask.querySelector(".subtask-text");
    let subtaskInput = document.createElement("input");
    subtaskInput.classList.add("subtask-text");
    subtaskInput.value = subtaskText.innerText;
    subtask.replaceChild(subtaskInput, subtaskText);
}
//saves changes to subtask with id subtaskId
function saveSubtask(subtaskId){
    let subtask = document.getElementById(subtaskId);
    let subtaskInput = subtask.querySelector(".subtask-text");
    let subtaskText = document.createElement("p");
    subtaskText.classList.add("subtask-text");
    subtaskText.innerText = subtaskInput.value;
    subtask.replaceChild(subtaskText, subtaskInput);
}
*/