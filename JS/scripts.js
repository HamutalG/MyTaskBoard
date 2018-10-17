
//Add A Stickynote Function
function add() {

    inputValue = document.getElementById("task").value;
    inputValue2 = document.getElementById("date").value;
    inputValue3 = document.getElementById("time").value;

    var noteObj = { task: inputValue, date: inputValue2, time: inputValue3 };

    createSticky([noteObj]);

    addStickiesToStorage([noteObj]);

    document.getElementById("task").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";

}

// Create a new sticky note
function createSticky(stickyNotesArr) {
    if (stickyNotesArr) {

        for (let i = 0; i < stickyNotesArr.length; i++) {

            var notesContainer = document.getElementsByClassName("notesContainer")[0];
            var notesRow = document.getElementsByClassName("notesRow")[0];

            var stickyDiv = document.createElement("div");
            stickyDiv.setAttribute("class", "stickynote col-sm-2");

            var note = document.createElement("p");
            note.setAttribute("class", "stickytask");
            note.innerText = stickyNotesArr[i].task;

            var note2 = document.createElement("p");
            note2.setAttribute("class", "stickydate");
            note2.innerText = stickyNotesArr[i].date + "\n" + stickyNotesArr[i].time;

            var dateAndTime = document.createElement("div");

            var glyph = document.createElement("span");
            glyph.setAttribute("class", "glyphicon glyphicon-trash");
            glyph.setAttribute("onclick", "fade(this.parentElement);")
            glyph.setAttribute("slot", i);
            glyph.onclick = function () {
                deleteSticky(this);
            }

            notesContainer.appendChild(notesRow);
            notesRow.appendChild(stickyDiv);
            stickyDiv.appendChild(note);
            stickyDiv.appendChild(note2);
            stickyDiv.appendChild(glyph);
            note2.appendChild(dateAndTime);

        }
    }
}

// Add a stickynote to the local storage
function addStickiesToStorage(noteObj) {

    var stickyInfoArray = new Array();
    var currentInStorage = JSON.parse(localStorage.getItem("notesArr"));

    if (localStorage.getItem("notesArr")) {
        for (let i = 0; i < currentInStorage.length; i++) {
            stickyInfoArray.push(currentInStorage[i]);
        }
    }

    stickyInfoArray.push(noteObj[noteObj.length - 1]);

    localStorage.setItem("notesArr", JSON.stringify(stickyInfoArray));
}

// Return the information of a stickynote from local storage when refreshing the page
function stickyOnLoad() {

    var currentInStorage = JSON.parse(localStorage.getItem("notesArr"));

    if (currentInStorage) {

        createSticky(currentInStorage);

    }
}

// Deleting a stickynote from local storage (as well as from the "view")
function deleteSticky(objToDelete) {
    var currentSaved = JSON.parse(localStorage.getItem("notesArr"));

    if (currentSaved.length == 1) {
        localStorage.removeItem("notesArr");
    }

    else {
        currentSaved.splice(objToDelete.slot, 1);
        var newCleanArr = JSON.stringify(currentSaved);
        localStorage.setItem("notesArr", newCleanArr);
    }

    fade(objToDelete.parentElement);
}

// Fade out when deleting a stickynote
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {

        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }

        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;

    }, 50);
}

// Errors
function generateErrors() {

    var errArr = new Array();
    var errDiv = document.getElementsByClassName("errors")[0];
    var errList = document.getElementsByClassName("errorList")[0];
    var taskInput = document.getElementById("task").value;
    var dateInput = document.getElementById("date").value;
    var timeInput = document.getElementById("time").value;

    errList.innerHTML = "";

    if (taskInput == "") {
        errArr.push("You must enter a task!");
    }

    if (dateInput == "") {
        errArr.push("You must enter a date!");
    }

    if (timeInput != "" && !isValidTime(timeInput)) {

        errArr.push("You must enter a valid time! (hh:mm)");
    }

    if (dateInput != "" && !isValidDate(dateInput)) {
        errArr.push("You must enter a valid date! (mm/dd/yyyy) ");

    }

    if (errArr.length > 0) {
        for (let i = 0; i < errArr.length; i++) {
            var newLi = document.createElement("li");
            newLi.innerHTML = "<h3>" + errArr[i] + "</h3>";
            errList.appendChild(newLi);
            errDiv.appendChild(errList);
        }
    }

    else {
        add();
    }
}

// Format the input time (time input not required)
function isValidTime(time) {
    let a = true;
    var time_arr = time.split(":");

    if (time_arr.length != 2) {
        a = false;
    }

    else {
        if (isNaN(time_arr[0]) || isNaN(time_arr[1])) {
            a = false;
        }

        if (time_arr[0] < 24 && time_arr[1] < 60) { }

        else {
            a = false;
        }

        if (time == "") {
            a = false;
        }
    }

    return a;
}

// Format the input date
function isValidDate(str) {

    // mm-dd-yyyy 
    var regex = /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})\s*(\d{0,2}):?(\d{0,2}):?(\d{0,2})/,
        parts = regex.exec(str);

    if (parts) {
        var date = new Date((+parts[3]), (+parts[1]) - 1, (+parts[2]), (+parts[4]), (+parts[5]), (+parts[6]));
        if ((date.getDate() == parts[2]) && (date.getMonth() == parts[1] - 1) && (date.getFullYear() == parts[3])) {
            return date;
        }
    }

    return false;

}
