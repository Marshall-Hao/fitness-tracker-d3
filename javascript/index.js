const btns = document.querySelectorAll("button");
const form = document.querySelector("form");
const formAct = document.querySelector("form span");
const input = document.querySelector("input");
const error = document.querySelector("#error");

var activity = "running";

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // todo: get activity
    activity = e.target.dataset.activity;

    //todo: remove and add active class
    btns.forEach((btn) => btn.classList.remove("bg-green-500"));
    e.target.classList.add("bg-green-500");

    //todo: set id of input field
    input.setAttribute("id", activity);

    //todo: set text of form span
    formAct.textContent = activity;
  });
});
