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

//initialize the page
function initialize(){
    //initialize the todo object
    todo = JSON.parse(localStorage.getItem("todo"));
    //if the todo object is not found in localStorage, create a new one
    if(todo == null){
        todo = {
            nextId: 0,
            tasks: {}
        };
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
        addSubtask(current_task.id);
        console.log("pressed");
    });
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
function addTask(){
    if(todo == null){
        alert("Error: todo object not initialized!");
        return;
    }
    
    todo.nextId += 1;

}

//adds a new subtask to a task
function addSubtask(taskId){
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
        console.log(template);
    }).catch(error => console.log(error));
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