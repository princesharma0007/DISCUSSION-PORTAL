let questions = JSON.parse(localStorage.getItem("questions")) || [];

let displayQuestion = document.querySelector("#display-question");
let rightSide = document.querySelector("#right-side");
let searchInput = document.querySelector("#search-input");
let newQuestionBtn = document.querySelector("#new-question-btn");
let leftSide = document.querySelector("#left-side");

display(); 
showQuestionForm();  

function showQuestionForm(){
    rightSide.dataset.id = "";

    rightSide.innerHTML = `
        <div class="text-center">
            <h2 class="text-4xl font-bold">WELCOME TO DISCUSSION PORTAL</h2>

            <h3 class="my-5 text-lg">
                Enter a subject and question to get started
            </h3>

            <input type="text" id="subject-input"  placeholder="Subject" class="w-96 rounded-lg border border-gray-500 px-4 py-2 outline-none" >

            <textarea id="question-box" placeholder="Question" class="mx-auto my-6 block h-40 w-96 rounded-lg border border-gray-500 px-4 py-3 outline-none" ></textarea>

            <button
                id="Submit-btn"
                class="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
            >
                Submit
            </button>
        </div>
    `;
}

function saveQuestions(){
    localStorage.setItem("questions", JSON.stringify(questions));
}

function addQuestion(item) {
    let div = document.createElement("div");

    div.className = "relative w-full bg-white border border-gray-300 p-5 mb-4 rounded-lg shadow-sm cursor-default";
    div.dataset.id = item.id;
    div.dataset.posttime = item.posttime;

    div.innerHTML = `
        <button class="favorite-btn absolute right-4 top-4 text-2xl">
            ${item.favorite ? "★" : "☆"}
        </button>
        <h3 class="question-subject text-xl font-bold pr-10"></h3>
        <p class="question-text my-2"></p>
        <h5 class="posted-time text-sm text-gray-500"></h5>
    `;
    let searchValue = searchInput.value.trim();
     div.querySelector(".question-subject").innerHTML = highlightText(String(item.subject ?? ""), searchValue);
     div.querySelector(".question-text").innerHTML = highlightText(String(item.question ?? ""), searchValue);
    displayQuestion.prepend(div);
}

function updatePostedTimes() {
    document.querySelectorAll("[data-posttime]").forEach(div => {
        let seconds = Math.floor((Date.now() - Number(div.dataset.posttime)) / 1000);

        let text = seconds < 10 ? "Just now" :
           seconds < 60 ? `${Math.floor(seconds)} sec ago` :
            seconds < 3600 ? `${Math.floor(seconds / 60)} min ago` :
            seconds < 86400 ? `${Math.floor(seconds / 3600)} hr ago` :
            `${Math.floor(seconds / 86400)} day ago`;

        div.querySelector(".posted-time").textContent = text;
    });
}

updatePostedTimes();
setInterval(updatePostedTimes, 1000);

function display(){

    displayQuestion.innerHTML = "";

    questions.forEach(function (item) {

        if (item.resolve !== true) {

            addQuestion(item);

        }

    });
}

function showQuestion(item){
  rightSide.dataset.id = item.id;
     rightSide.innerHTML = `
        <div>

            <div class="mb-6 flex items-center justify-between">

                <h2 class="text-2xl font-bold">
                    Question
                </h2>

                <button id="resolve-btn"class="rounded bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-700" >
                    Resolve
                </button>

            </div>

            <div class="rounded-lg border border-gray-300 bg-white p-5">

                <h3 id="question-subject" class="text-xl font-bold" ></h3>

                <p id="question-text" class="mt-2"></p>

            </div>

            <h2 class="mt-8 text-2xl font-bold">
                Response
            </h2>

            <div id="response-section" class="mt-4 max-h-60 overflow-y-auto pr-2"></div>

            <h2 class="mt-8 text-xl font-bold">
                Add Response
            </h2>

            <input type="text" id="response-name" placeholder="Enter Name" class="mt-4 w-full rounded border border-gray-400 px-3 py-2 outline-none">

            <textarea id="response-comment" placeholder="Enter Comment" class="mt-3 h-28 w-full rounded border border-gray-400 px-3 py-2 outline-none"></textarea>

            <button id="response-submit" class="mt-3 rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700" >
                Submit
            </button>

        </div>
    `;

    const subject = document.getElementById("question-subject");
    const question = document.getElementById("question-text");

    subject.textContent = String(item.subject ?? "");
    question.textContent = String(item.question ?? "");

    showResponses(item);
}

function highlightText(text, searchValue){
    if (searchValue === "") {
        return text;
    }

    return text.replace(
        new RegExp(searchValue, "gi"),
        `<mark class="bg-green-300 text-black px-1 rounded">$&</mark>`
    );
}

function showResponses(item){

    let responseSection =
        document.querySelector("#response-section");

    responseSection.innerHTML = "";

    let responses = [...item.responses];
    let sortedResponses = [];

    while (responses.length) {

        let maxIndex = 0;

        for (let i = 1; i < responses.length; i++) {

            if (responses[i].likes > responses[maxIndex].likes) {

                maxIndex = i;

            }

        }

        sortedResponses.push(responses[maxIndex]);

        responses.splice(maxIndex, 1);
    }

    sortedResponses.forEach(function (response) {

        addResponse(response);

    });
}

function addResponse(response){

    let responseSection =
        document.querySelector("#response-section");

    let div = document.createElement("div");

    div.className =
        "mb-3 rounded border border-gray-300 bg-white p-4 text-left";

    div.dataset.id = response.id;

    div.innerHTML = `
        <h3 class="response-name font-bold"></h3>

        <p class="response-comment mt-1"></p>

        <div class="mt-3 flex gap-4">

            <button class="like-btn text-gray-600">
                ♥ Like ${response.likes}
            </button>

            <button class="dislike-btn text-gray-600">
                Dislike ${response.dislikes}
            </button>

        </div>
    `;

    let name =
        div.querySelector(".response-name");

    let comment =
        div.querySelector(".response-comment");

    name.textContent = String(response.name ?? "");

    comment.textContent = String(response.comment ?? "");

    responseSection.appendChild(div);
}

displayQuestion.addEventListener("click", function (event){

    let questionDiv = event.target.closest("[data-id]");

    if (!questionDiv) return;

    let id = Number(questionDiv.dataset.id);

    let item = questions.find(function (question){

        return question.id === id;

    });

    if (!item) return;

    if (event.target.classList.contains("favorite-btn")) {

        item.favorite = !item.favorite;

        event.target.innerText =
            item.favorite ? "★" : "☆";

        saveQuestions();

        return;
    }

    showQuestion(item);
});

rightSide.addEventListener("click", function (event){

    if (event.target.id === "Submit-btn") {

        let subjectInput =
            document.querySelector("#subject-input");

        let questionInput =
            document.querySelector("#question-box");

        let subject =
            subjectInput.value.trim();

        let question =
            questionInput.value.trim();

        if (subject === "" || question === "") {

            alert("Please fill both fields");

            return;
        }

        let newQuestion = {

            id: Date.now(),

            subject: subject,

            question: question,

            posttime: Date.now(),

            responses: [],

            favorite: false,

            resolve: false

        };

        questions.push(newQuestion);

        saveQuestions();

        addQuestion(newQuestion);

        subjectInput.value = "";

        questionInput.value = "";

        return;
    }

    let itemId = Number(rightSide.dataset.id);

    let item = questions.find(function (question){

        return question.id === itemId;

    });

    if (!item) return;

    if (event.target.id === "response-submit") {

        let nameInput =
            document.querySelector("#response-name");

        let commentInput =
            document.querySelector("#response-comment");

        let name =
            nameInput.value.trim();

        let comment =
            commentInput.value.trim();

        if (name === "" || comment === "") {

            alert("Please fill both fields");

            return;
        }

        let response = {

            id: Date.now(),

            name: name,

            comment: comment,

            likes: 0,

            dislikes: 0

        };

        item.responses.push(response);

        saveQuestions();

        addResponse(response);

        nameInput.value = "";

        commentInput.value = "";

        return;
    }

    if (event.target.id === "resolve-btn") {

        item.resolve = true;

        saveQuestions();

        let questionDiv =
            document.querySelector(`[data-id="${item.id}"]`);

        if (questionDiv){

            questionDiv.remove();

        }

        showQuestionForm();

        return;
    }

    let responseDiv =
        event.target.closest("#response-section [data-id]");

    if (!responseDiv) return;

    let responseId =
        Number(responseDiv.dataset.id);

    let response =
        item.responses.find(function (response){

            return response.id === responseId;

        });

    if (!response) return;

    if (event.target.classList.contains("like-btn")) {

        response.likes++;

        event.target.innerText =
            `♥ Like ${response.likes}`;

        saveQuestions();
    }

    if (event.target.classList.contains("dislike-btn")) {

        response.dislikes++;

        event.target.innerText =
            `Dislike ${response.dislikes}`;

        saveQuestions();
    }
});

searchInput.addEventListener("input", function () {

    let value = searchInput.value.toLowerCase().trim();

    displayQuestion.innerHTML = "";

    questions.forEach(function (item) {

        if (
            item.resolve !== true &&
            item.subject.toLowerCase().includes(value)
        ) {
            addQuestion(item);
        }

    });
});

newQuestionBtn.addEventListener("click", function (){

    showQuestionForm();

});

leftSide.addEventListener("click", function (event){

    console.log("Capturing:", event.target);

}, true);

let header = document.querySelector("header");

if (header){

    header.addEventListener("click", function (){

        window.location.href = "index.html";

    });

}
