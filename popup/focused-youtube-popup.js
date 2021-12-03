/* Toggle material toggle span element switch */
let toggleElements = document.getElementsByClassName("toggle");
let toggleFunction =  (e)=> {
    //search siblings for the checkbox input, toggle it upon click
    let toggleCheckbox = e.originalTarget.parentNode.firstElementChild;
    toggleCheckbox.checked = !toggleCheckbox.checked;
}

Array.from(toggleElements).forEach((e) => {
    e.addEventListener('click', toggleFunction);
});

