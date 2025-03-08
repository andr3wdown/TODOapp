//check the debug value in local storage if it's not found set it to false by default
if(localStorage.getItem("debug") == null){
    localStorage.setItem("debug", false);
}
let debug = localStorage.getItem("debug") == "true";

let todo = null;
let current_task = null;
let editing = false;
let editing_subId = 0;

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
        //createNewTask();
    });
    
    //initialize the button that adds a new task in the dialog box
    let subtask_button = document.getElementById("subtask-button");
    subtask_button.addEventListener("click", () => {
        addSubtaskToForm(todo.nextId);
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
//toggles the completion status of the task with taskId and changes the icon for the subtaks on the page
function togglePageSubtask(subtaskId){
    //get the task and subtask ids from the subtaskId
    console.log(subtaskId);
    console.log(subtaskId.split("-")[0]);
    taskId = parseInt(subtaskId.split("-")[0]);
    subId = parseInt(subtaskId.split("-")[1]);
    //toggle the subtask in the todo object
    
    toggleSubtask(subtaskId);
    console.log(todo);
    console.log(taskId);
    console.log(subId);
    todo.tasks[taskId].subtasks[subId].completed = !todo.tasks[taskId].subtasks[subId].completed;
    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));
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
function addTaskToPage(){
    event.preventDefault();
    //check for errors
    if(todo == null){
        alert("Error: todo object not initialized!");
        console.log("todo object not initialized");
        return;
    }
    let current_task = Object.assign({}, task_template);
    current_task.id = todo.nextId;
    //fetch the task name from the input field and the subtasks from their corresponding input fields
    current_task.text = document.getElementById("task-name").value;
    //check if the task name is empty and if it is show an alert and return
    if(current_task.text == ""){
        alert("Error: task name cannot be empty!");
        console.log("task name cannot be empty");
        return;
    }
    //get all the subtasks from the form and add them to the current task's subtasks array
    subtasks = document.querySelectorAll(".subtask-form-card");
    for(let i = 0; i < subtasks.length; i++){
        current_task.subtasks.push(Object.assign({}, subtask_template));
        current_task.subtasks[i].text = subtasks[i].querySelector(".subtask-field").value;
        current_task.subtasks[i].id = i;
        current_task.subtasks[i].completed = subtasks[i].querySelector(".subtask-complete").getAttribute("toggled") == "true" ? true : false;
    }
    //add the new task to the todo object tasks array
    todo.tasks.push(Object.assign({}, current_task));

    //add the new task to the page
    createTaskElement(current_task);

    //increment the nextId for the todo object and reset the current_task variable
    todo.nextId += 1;
    editing_subId = 0;

    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));
    closeDialog();
    if(debug){
        console.log("added a new task");
    }
}
//cretes the task element and adds it to the task container in the page
function createTaskElement(task){
    let taskContainer = document.getElementById("task-container");
    //fetch the template for the task card from the templates folder
    //if the template is not found, log the error
    fetch("../templates/task.html").then(response => response.text()).then(template => {
        //replace the placeholders in the template with the actual values
        template = template.replaceAll("_task", task.id);
        template = template.replace("_title", task.text);
        //fetch the template for the subtask card from the templates folder loop through subtasks in the task add it to the task element template
        //if the template is not found, log the error
        fetch("../templates/subtask.html").then(response => response.text()).then(subtemplate => {
            subtasks = "";
            for(let i = 0; i < task.subtasks.length; i++){
                let subtask = task.subtasks[i];
                let sub = subtemplate.replaceAll("_task", task.id); 
                sub = sub.replaceAll("_subid", subtask.id);
                sub = sub.replace("_subtask_title", subtask.text);
                sub = sub.replace("_toggled", subtask.completed ? "true" : "false");
                sub = sub.replace("_img", subtask.completed ? "check_1" : "check_0");
                subtasks += sub;
            }
            template = template.replace("_subtasks", subtasks);
            //add the modified template to the task container
            taskContainer.innerHTML += template;
        }).catch(error => console.log(error));
    }).catch(error => console.log(error));
}

//adds a new subtask to a task
function addSubtaskToForm(taskId){
    if(todo == null){
        alert("Error: todo object not initialized!");
        return;
    }
    let subtaskContainer = document.getElementById("form-subtask-container");

    //fetch the template for the subtask card from the templates folder
    //if the template is not found, log the error
    fetch("../templates/subtask_form.html").then(response => response.text()).then(template => {
        //replace the placeholders in the template with the actual values
        template = template.replaceAll("_task", taskId);
        template = template.replaceAll("_subid", editing_subId);
        editing_subId += 1;
        //add the template to the subtask container while keeping the previous values
        let titles = subtaskContainer.querySelectorAll(".subtask-field");
        let values = [];
        for(let i = 0; i < titles.length; i++){
            values.push(titles[i].value);
        }
        subtaskContainer.innerHTML += template;
        titles = subtaskContainer.querySelectorAll(".subtask-field");
        for(let i = 0; i < titles.length; i++){
            titles[i].value = i >= values.length ? "" : values[i];
        }
    
    }).catch(error => console.log(error));
    if(debug){
        console.log("added a new subtask to task with id: " + taskId);
    }
}

//clear the input fields and close the dialog
function closeDialog(){
    let dialog = document.getElementById("create-dialog");
    let taskInput = document.getElementById("task-name");
    let subtaskContainer = document.getElementById("form-subtask-container");

    editing_subId = 0;
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
