//check the debug value in local storage if it is not found set it to false by default
let debug = localStorage.getItem("debug") == "true"
if(debug == null){
    debug = false;
    localStorage.setItem("debug", debug);
}

let todo = null;
let editing = false;
let current_task = null;

//template objects for tasks and subtasks id set to -1 to avoid conflicts with the actual ids
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

//initialize the page
function initialize(){

    //initialize the todo object
    todo = JSON.parse(localStorage.getItem("todo"));
    //if the todo object is not found in localStorage, create a new one
    if(todo == null){
        todo = {
            nextId: 0,
            tasks: []
        };
        if(debug){
            console.log("todo object not found, creating a new one");
        }
    }
    //initialize the button that opens the dialog box for creating a new task
    let showbutton = document.getElementById("dialog-button");
    showbutton.addEventListener("click", () => {
        popup = document.getElementById("create-dialog");
        popup.showModal();
        createNewTask();
    });

    //initialize the button that adds a new task in the dialog box
    let subtask_button = document.getElementById("subtask-button");
    subtask_button.addEventListener("click", () => {
        addSubtaskToForm(current_task.id);
        console.log("pressed");
    });
    if(debug){
        console.log("initialized");
    }
}

//delete subtask with id subtaskId
function deleteSubtask(subtaskId) {
    let subtask = document.getElementById(subtaskId);
    subtask.remove();
    if(debug){
        console.log("deleted subtask with id: " + subtaskId);
    }
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
    if(debug){
        console.log("toggled subtask with id: " + subtaskId + " to: " + toggled);
    }
}
//intializes the current_task variable with a new task object
function createNewTask(){
    if(todo == null){
        alert("Error: todo object not initialized!");
        return;
    }
    current_task = Object.assign({}, task_template);
    current_task.id = todo.nextId;
    
}
//finalizes the creation of a new task and adds it to the todo object
function addTaskToForm(){
    preventDefault();
    if(todo == null){
        alert("Error: todo object not initialized!");
        return;
    }
    
    todo.nextId += 1;
    //fetch the task name from the input field and the subtasks from their corresponding input fields
    current_task.text = document.getElementById("task-name").value;
    subtasks = document.querySelectorAll(".subtask-field");
    for(let i = 0; i < current_task.subtasks.length; i++){
        current_task.subtasks[i].text = subtasks[i].value;
    }
    //add the new task to the todo object tasks array
    todo.tasks.push(Object.assign({}, current_task));
    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));
    
    current_task = null;
    closeDialog();
    if(debug){
        console.log("added a new task");
    }
}

//adds a new subtask to a task
function addSubtaskToForm(taskId){
    if(todo == null){
        alert("Error: todo object not initialized!");
        return;
    }
    let subtaskContainer = document.getElementById("subtask-container");
    //initialize the current_subtask variable with a new subtask object and add it to the current task's subtasks array
    let current_subtask = Object.assign({}, subtask_template);
    current_subtask.id = current_task.subtasks.length;
    current_task.subtasks.push(current_subtask);
    //fetch the template for the subtask card from the templates folder
    //if the template is not found, log the error
    fetch("../templates/subtask.html").then(response => response.text()).then(template => {
        //replace the placeholders in the template with the actual values
        template = template.replaceAll("_task", taskId);
        template = template.replaceAll("_subid", current_subtask.id);
        //add the template to the subtask container
        subtaskContainer.innerHTML += template;
    }).catch(error => console.log(error));
    if(debug){
        console.log("added a new subtask to task with id: " + taskId);
    }
}

//clear the input fields and close the dialog
function closeDialog(){
    let dialog = document.getElementById("create-dialog");
    let taskInput = document.getElementById("task-name");
    let subtaskContainer = document.getElementById("subtask-container");

    taskInput.value = "";
    subtaskContainer.innerHTML = "";
    current_task = null;
    dialog.close();
    if(debug){
        console.log("closed dialog");
    }
}
//reset localstorage and reload the page
//used for debugging
function reset(){
    localStorage.clear();
    location.reload();
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