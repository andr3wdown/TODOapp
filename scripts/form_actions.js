//check the debug value in local storage if it's not found set it to false by default
if(localStorage.getItem("debug") == null){
    localStorage.setItem("debug", false);
}
let debug = localStorage.getItem("debug") == "true";

let todo = null;
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
        setForm("Create a new task", "Create task", () => addTaskToPage("uncomplete-task-container"));
        popup = document.getElementById("create-dialog");
        popup.showModal();
    });
    
    //initialize the button that adds a new subtask in the dialog box
    let subtask_button = document.getElementById("subtask-button");
    subtask_button.addEventListener("click", () => {
        addSubtaskToForm(todo.nextId);
    });

    //set event listener for resetting field border colors
    document.addEventListener("click", (event) => {
        let input_field = document.getElementById("task-name");
        input_field.style.border = "2px solid black";
        let form = document.getElementById("form-subtask-container");
        let subtask_fields = form.querySelectorAll(".subtask-field");
        for(let i = 0; i < subtask_fields.length; i++){
            subtask_fields[i].style.border = "2px solid black";
        }
    });

    loadTasks();
    if(debug){
        console.log("initialized");
    }
}

//load the tasks from the todo object in localStorage
function loadTasks(){
    if(debug){
        console.log("Found tasks: " + todo.tasks.length);
    }
    for(let i = 0; i < todo.tasks.length; i++){
        let complete = todo.tasks[i].completed;
        createTaskElement(todo.tasks[i], complete ? "complete-task-container" : "uncomplete-task-container");
    }
    if(debug){
        console.log("loaded tasks");
    }
}
//reset the border colors of the form fields
function resetFormBorders(){
    let inputfield = document.getElementById("task-name");
    inputfield.style.border = "2px solid black";

    let subtask_fields = subtasks[i].querySelectorAll(".subtask-field");
    for(let i = 0; i < subtask_fields.length; i++){
        subtask_fields[i].style.border = "2px solid black";
    }
}

//clear the task containers and reload the tasks from the todo object
function reloadTasks(){
    let complete = document.getElementById("complete-task-container");
    let uncomplete = document.getElementById("uncomplete-task-container");
    complete.innerHTML = "";
    uncomplete.innerHTML = "";
    loadTasks();
}

//delete subtask with id subtaskId
function deleteSubtask(subtaskId) {
    let subtask = document.getElementById(subtaskId);
    subtask.remove();
    if(debug){
        console.log("deleted subtask with id: " + subtaskId);
    }
}
//delete subtask with id subtaskId from the todo object and the page
function deletePageSubtask(subtaskId){
    //get the task and subtask ids from the subtaskId
    let taskId = parseInt(subtaskId.split("-")[0]);
    let subId = parseInt(subtaskId.split("-")[1]);

    //get the task and filter out the subtask from the todo object
    let task = todo.tasks.filter(task => task.id == taskId)[0];
    task.subtasks = task.subtasks.filter(subtask => subtask.id != subId);

    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));

    deleteSubtask(subtaskId);
}
//delete task with id taskId
function deleteTask(taskId){
    let task = document.getElementById(taskId);
    
    task.remove();
    //delete the task from the todo object
    todo.tasks = todo.tasks.filter(task => task.id != taskId);
    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));
    if(debug){
        console.log("deleted task with id: " + taskId);
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
    taskId = parseInt(subtaskId.split("-")[0]);
    subId = parseInt(subtaskId.split("-")[1]);

    //get the task and subtask from the todo object
    let task = todo.tasks.filter(task => task.id == taskId)[0];
    let subtask = task.subtasks.filter(subtask => subtask.id == subId)[0];
    //toggle the subtask in the todo
    subtask.completed = !subtask.completed;

    toggleSubtask(subtaskId);
    
    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));
}

//toggle task between completed or uncompleted
function toggleTask(taskId){
    if(debug){
        console.log("toggling task with id: " + taskId);
    }
    let task_element = document.getElementById(taskId);

    //find the task in the todo object and toggle the completed status
    let task = todo.tasks.filter(task => task.id == parseInt(taskId))[0];
    task.completed = !task.completed;

    //update the button
    let button = task_element.querySelector(".task-complete-button");
    button.innerHTML = `
            <p>${task.completed ? "uncomplete" : "complete"} task</p>
            <img class="icon" src="img/check_${task.completed ? "1": "0"}.svg" alt="">
            `;
    let task_html = task_element.outerHTML;

    //remove the task from the page and then add it to the correct task container
    task_element.remove();
    if(debug){
        console.log("removed task with id: " + taskId);
    }
    let task_container = task.completed ? "complete-task-container" : "uncomplete-task-container";
    document.getElementById(task_container).innerHTML += task_html;
    
    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));
}

//finalizes the creation of a new task and adds it to the todo object
function addTaskToPage(task_container){
    event.preventDefault();
    //check for errors
    if(todo == null){
        alert("Error: todo object not initialized!");
        console.log("todo object not initialized");
        return;
    }
    
    let current_task = parseTaskFromForm(todo.nextId);
    if(current_task == null){
        return;
    }
    //add the new task to the todo object tasks array
    todo.tasks.push(Object.assign({}, current_task));

    //add the new task to the page
    createTaskElement(current_task, task_container);

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


//gets the data for the task from the form and returns it
function parseTaskFromForm(taskId){
    let current_task = Object.assign({}, task_template);
    //I have no idea why this is necessary but it is otherwise a empty subtask is added to the new task for each existing task on the page
    current_task.subtasks = [];

    current_task.id = taskId;
    //fetch the task name from the input field and the subtasks from their corresponding input fields
    current_task.text = document.getElementById("task-name").value;
    //check if the task name is empty and if it is change field border to red and return
    if(current_task.text == ""){
        let inputfield = document.getElementById("task-name");
        inputfield.focus();
        inputfield.style.border = "2px solid red";
        console.log("task name cannot be empty");
        return;
    }
    //get all the subtasks from the form
    subtasks = document.querySelectorAll(".subtask-form-card");

    if(debug){
        console.log("found subtasks:" + subtasks.length);
        for(let i = 0; i < subtasks.length; i++){
            console.log(subtasks[i]);
        }  
    }

    //add the subtasks to the current task
    for(let i = 0; i < subtasks.length; i++){
        current_task.subtasks.push(Object.assign({}, subtask_template));
        //check if the subtask name is empty and if it is change field border to red and return
        if(subtasks[i].querySelector(".subtask-field").value == ""){
            let inputfield = subtasks[i].querySelector(".subtask-field");
            inputfield.focus();
            inputfield.style.border = "2px solid red";
            console.log("subtask name cannot be empty");
            return;
        }
        current_task.subtasks[i].text = subtasks[i].querySelector(".subtask-field").value;
        current_task.subtasks[i].id = i;
        current_task.subtasks[i].completed = subtasks[i].querySelector(".subtask-complete").getAttribute("toggled") == "true" ? true : false;
    }

    return current_task;
}
//cretes the task element and adds it to the task container in the page
function createTaskElement(task, task_container, taskId=""){
    let taskContainer = document.getElementById(task_container);
    //fetch the template for the task card from the templates folder
    //if the template is not found, log the error
    fetch("../templates/task.html").then(response => response.text()).then(template => {
        //replace the placeholders in the template with the actual values
        template = template.replaceAll("_task", task.id);
        template = template.replace("_title", task.text);
        template = template.replace("_button", `
            <p>${task.completed ? "uncomplete" : "complete"} task</p>
            <img class="icon" src="img/check_${task.completed ? "1": "0"}.svg" alt="">
            `);
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
            //add the modified template to the task container if taskId is empty otherwise replace the task with the same id
            if(taskId == ""){
                taskContainer.innerHTML += template;
            }
            else{
                let task_element = document.getElementById(taskId);
                task_element.outerHTML = template;
            }
            
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
//edit an existing task
function addExistingTaskToForm(taskId, task){
    document.getElementById("task-name").value = task.text;
    let subtaskContainer = document.getElementById("form-subtask-container");
    //fetch the template for the subtask card from the templates folder
    //if the template is not found, log the error
    fetch("../templates/subtask_form.html").then(response => response.text()).then(template => {
        //replace the placeholders in the template with the actual values
        editing_subId = getSubtaskEditingId(task);
        template = template.replaceAll("_task", taskId);
        for(let i = 0; i < task.subtasks.length; i++){
            let temp = template.replaceAll("_subid", task.subtasks[i].id);
            subtaskContainer.innerHTML += temp;

            let subtask_element = subtaskContainer.querySelector(`#edit${taskId}-${task.subtasks[i].id}`);
            subtask_element.querySelector(".subtask-field").setAttribute("value", task.subtasks[i].text);
            subtask_element.querySelector(".subtask-complete").setAttribute("toggled", task.subtasks[i].completed ? "true" : "false");
            subtask_element.querySelector(".subtask-complete").innerHTML = `<img class="icon" src="img/check_${task.subtasks[i].completed ? "1" : "0"}.svg" alt="checkmark">`;
        }
    }).catch(error => console.log(error));
}

//initialize the form with the correct title, button and submit function
function setForm(title, button, onSubmit){
    document.getElementById("form-title").value = title;
    document.getElementById("task-button").innerHTML = button;
    document.getElementById("task-form").onsubmit = onSubmit;
}
//get the next id for a subtask in a task
function getSubtaskEditingId(task){
    if(task.subtasks.length == 0){
        return 0;
    }

    let max = -1;
    for(let i = 0; i < task.subtasks.length; i++){
        if(task.subtasks[i].id > max){
            max = task.subtasks[i].id;
        }
    }
    return max + 1;
}
//start editing the task with taskId and fill the form with the task data
function startEditTask(taskId){
    if(todo == null){
        alert("Error: todo object not initialized!");
        return;
    }
    //get the task from the todo object
    let task = todo.tasks.filter(task => task.id == taskId)[0];
    
    setForm("Edit task", "Edit task", () => finalizeEditTask(taskId));
    addExistingTaskToForm(taskId, task);

    //open the dialog box
    popup = document.getElementById("create-dialog");
    popup.showModal();
}
//finalize the editing of a task and update the task on the page
function finalizeEditTask(taskId){
    event.preventDefault();
    //swap the old task with the new one
    let current_task = parseTaskFromForm(parseInt(taskId));
    if(current_task == null){
        return;
    }
    let old_task = todo.tasks.filter(task => task.id == parseInt(taskId))[0];
    current_task.completed = old_task.completed;
    let index = todo.tasks.indexOf(old_task);
    todo.tasks[index] = current_task;
    //update the localStorage with the new todo object
    localStorage.setItem("todo", JSON.stringify(todo));
    //update the task on the page
    createTaskElement(current_task, current_task.completed ? "complete-task-container" : "uncomplete-task-container", taskId);

    closeDialog();
    if(debug){
        console.log("edited task with id: " + taskId);
    }
}
// sort tasks by id
function sortById(){
    todo.tasks.sort((a, b) => a.id - b.id);
    localStorage.setItem("todo", JSON.stringify(todo));
    reloadTasks();
}
//sort tasks by name
function sortByName(){
    todo.tasks.sort((a, b) => a.text.localeCompare(b.text));
    localStorage.setItem("todo", JSON.stringify(todo));
    reloadTasks();
}

//clear the input fields and close the dialog
function closeDialog(){
    let dialog = document.getElementById("create-dialog");
    let taskInput = document.getElementById("task-name");
    let subtaskContainer = document.getElementById("form-subtask-container");

    editing_subId = 0;
    taskInput.value = "";
    subtaskContainer.innerHTML = "";
    dialog.close();
    if(debug){
        console.log("closed dialog");
    }
}

//clear all completed tasks
function clearCompletedTasks(){
    todo.tasks = todo.tasks.filter(task => !task.completed);
    localStorage.setItem("todo", JSON.stringify(todo));
    reloadTasks();
    if(debug){
        console.log("cleared completed tasks");
    }
}

//reset localstorage and reload the page
//used for debugging
function reset(){
    localStorage.clear();
    location.reload();
}
