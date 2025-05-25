import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

// Get or create a unique token per browser
function getBrowserToken() {
  let token = localStorage.getItem("user_token");
  if (!token) {
    token = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem("user_token", token);
  }
  return token;
}

const browserToken = getBrowserToken(); // Unique per browser

// Firebase config
const firebaseConfig = {
  databaseURL: "https://compliment-generator-ba798-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Scoped references
const expensesRef = ref(database, `users/${browserToken}/expenses`);
const travelersRef = ref(database, `users/${browserToken}/travelers`);

// DOM elements
const expenseForm = document.getElementById("expense-form");
const totalExpensesAmountElement = document.getElementById("total-expenses-amount");
const expenseList = document.getElementById("expense-list");
const modal = document.getElementById("travelers-modal");
const openModalButton = document.getElementById("open-modal-button");
const closeButton = document.querySelector(".close-button");
const travelersForm = document.getElementById("travelers-form");
const travelerNameInput = document.getElementById("traveler-name");
const travelersList = document.getElementById("travelers-list");
const printButton = document.getElementById("print-travelers");
const printList = document.getElementById("print-traveler");
const printExpenseList = document.getElementById("print-expense-list");

document.getElementById("print-date").textContent = new Date().toLocaleDateString();
document.getElementById("receipt-id").textContent = Math.floor(Math.random() * 900000 + 100000);

let expenses = [];
let travelers = [];

// Modal open/close
openModalButton.addEventListener("click", () => modal.classList.add("display-modal"));
closeButton.addEventListener("click", () => modal.classList.remove("display-modal"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("display-modal");
});

// Forms
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleNewExpense();
});

travelersForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleNewTraveler();
});

// Print Button
printButton.addEventListener("click", () => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  document.getElementById("print-total").textContent = `$${total}`;

  // Traveler list
  printList.innerHTML = "";
  travelers.forEach((traveler) => {
    const item = document.createElement("li");
    item.style.display = "flex";
    item.style.alignItems = "center";

    const left = document.createElement("span");
    left.textContent = traveler.name;
    left.style.fontFamily = "monospace";

    const line = document.createElement("span");
    line.style.flex = "1";
    line.style.borderBottom = "1px dashed #999";
    line.style.margin = "0 10px";

    const right = document.createElement("span");
    right.textContent = `$${traveler.amountOwed}`;
    right.style.fontFamily = "monospace";

    item.appendChild(left);
    item.appendChild(line);
    item.appendChild(right);
    printList.appendChild(item);
  });

  // Expense list
  printExpenseList.innerHTML = "";
  expenses.forEach((expense) => {
    const item = document.createElement("li");
    item.style.display = "flex";
    item.style.alignItems = "center";

    const left = document.createElement("span");
    left.textContent = expense.category;
    left.style.fontFamily = "monospace";

    const line = document.createElement("span");
    line.style.flex = "1";
    line.style.borderBottom = "1px dashed #999";
    line.style.margin = "0 10px";

    const right = document.createElement("span");
    right.textContent = `$${parseFloat(expense.amount).toFixed(2)}`;
    right.style.textAlign = "right";
    right.style.fontFamily = "monospace";

    item.appendChild(left);
    item.appendChild(line);
    item.appendChild(right);
    printExpenseList.appendChild(item);
  });

  

  window.print();
  preparePrintData();
  // clear data a bit later or reload
  setTimeout(() => {
    remove(ref(database, `users/${browserToken}`));
    //location.reload(); // optional
  }, 5000);
});

// Add Expense
function handleNewExpense() {
  const category = document.getElementById("expense-category").value;
  const amount = parseInt(document.getElementById("expense-amount").value);
  if (!category || isNaN(amount)) return;
  const newRef = push(expensesRef);
  set(newRef, { category, amount });
  expenseForm.reset();
}

// Add Traveler
function handleNewTraveler() {
  const name = travelerNameInput.value.trim();
  if (!name) return;
  const newRef = push(travelersRef);
  set(newRef, { name });
  travelerNameInput.value = "";
}

// Remove Expense or Traveler
function deleteExpense(id) {
  remove(ref(database, `users/${browserToken}/expenses/${id}`));
}
function removeTraveler(id) {
  remove(ref(database, `users/${browserToken}/travelers/${id}`));
}

// Realtime listeners
onValue(expensesRef, (snapshot) => {
  expenses = [];
  snapshot.forEach((snap) => {
    const val = snap.val();
    val.id = snap.key;
    expenses.push(val);
  });
  updateDisplays();
});

onValue(travelersRef, (snapshot) => {
  travelers = [];
  snapshot.forEach((snap) => {
    const val = snap.val();
    val.id = snap.key;
    travelers.push(val);
  });
  updateDisplays();
});

// UI Update
function updateDisplays() {
  calculateAmountOwed();
  updateTotalExpensesAmount();
  updateExpenseList();
  updateTravelersList();
}

function calculateAmountOwed() {
  if (travelers.length === 0) return;
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const share = (total / travelers.length).toFixed(2);
  travelers.forEach((t) => (t.amountOwed = share));
}

function updateTotalExpensesAmount() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalExpensesAmountElement.textContent = "$" + total;
}

function updateExpenseList() {
  expenseList.innerHTML = "";
  expenses.forEach((e) => {
    const item = document.createElement("li");
    item.textContent = `${e.category}: $${e.amount}`;
    const btn = createDeleteButton(e.id, deleteExpense);
    item.appendChild(btn);
    expenseList.appendChild(item);
  });
}

function updateTravelersList() {
  travelersList.innerHTML = "";
  travelers.forEach((t) => {
    const item = document.createElement("div");
    item.classList.add("traveler-item");
    item.textContent = `${t.name}: $${t.amountOwed}`;
    const btn = createDeleteButton(t.id, removeTraveler);
    item.appendChild(btn);
    travelersList.appendChild(item);
  });
}

function createDeleteButton(id, cb) {
  const btn = document.createElement("button");
  btn.innerHTML = "<i class='fas fa-trash-alt'></i>";
  btn.addEventListener("click", () => cb(id));
  return btn;
}
