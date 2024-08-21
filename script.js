let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const tabBtn = document.getElementById("tab-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const copyBtn = document.getElementById("copy-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `
      <li>
        <a href='${leads[i]}' target='_blank'>
          ${leads[i]} 
        </a>
        <button class="delete-this-btn" data-index="${i}">Delete</button>
      </li>
    `;
  }

  ulEl.innerHTML = listItems;

  document.querySelectorAll(".delete-this-btn").forEach(function (btn) {
    btn.addEventListener("click", (event) => {
      const index = parseInt(event.target.getAttribute("data-index"));

      myLeads.splice(index, 1);
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    });
  });
}

let copyLeads = "";
copyBtn.addEventListener("click", function () {
  for (let i = 0; i < myLeads.length; i++) {
    copyLeads += `${myLeads[i]}\n`;
  }
  navigator.clipboard.writeText(copyLeads);
});

inputBtn.addEventListener("click", function () {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});

deleteBtn.addEventListener("click", function () {
  const confirmDelete = confirm("Are you sure you want to delete all leads?");

  if (confirmDelete) {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
  }
});
