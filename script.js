let balance = document.getElementById('balance');
let money_income = document.getElementById('money-income');
let money_expense = document.getElementById('money-expense');
let list = document.getElementById('list');
let form = document.getElementById('form');
let category = document.getElementById('text');
let transactionType = document.getElementById("transactionType");
let amount = document.getElementById('amount');
let date = document.getElementById("date");


let  localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];


function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '' || date.value.trim() === '') {
        alert('Please add a Category and amount');
    } else {
        let transaction = {
            id: generateID(),
            text: category.value,
            amount: parseInt(amount.value),
            date: date.value
        };
        if(transactionType.value === "-"){
            transaction.amount = parseInt("-"+amount.value);
        }
        console.log(typeof(transaction.amount));

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        category.value = '';
        amount.value = '';
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign
    
    let sign = transaction.amount <0?"-":"+";

    let item = document.createElement('li');

    //adding the  class based on transaction type
    
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');



    item.innerHTML = `
    ${transaction.text} <span> ${transaction.date} </span> <span>${sign}${Math.abs(
        transaction.amount
    )}<button class="delete-btn" onclick="removeTransaction(${transaction.id
        })"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
      </svg></button></span> 
  `;

    list.appendChild(item);
}

// Update the values of balance, income and expense
function updateValues() {
    let amounts = transactions.map(transaction => transaction.amount);
    console.log(amounts);
    let total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    let income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    let expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);
    

     balance.textContent = "Rs. "+`${total}`;
     money_income.textContent = `${income}/-`;
     money_expense.textContent = `${expense}/-`;
}

// Removing the  transaction by ID from History
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// This function updates the local storage Values
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


// Function Initializer
function init() {
    list.textContent ='';

    transactions.forEach(addTransactionDOM);
    updateValues();
    
    
}

init();

form.addEventListener('submit', addTransaction);