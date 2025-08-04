document.addEventListener('DOMContentLoaded', function() {
    // Get all DOM elements
    const totalAmountInput = document.getElementById('total_amount');
    const setBudgetBtn = document.querySelector('.box:first-child button');
    const expenseTitleInput = document.querySelector('.box:nth-child(2) input:first-of-type');
    const expenseAmountInput = document.querySelector('.box:nth-child(2) input:nth-of-type(2)');
    const checkAmountBtn = document.querySelector('.box:nth-child(2) button');
    
    const totalBudgetDisplay = document.querySelector('.blue-card .names:first-child .total');
    const totalExpensesDisplay = document.querySelector('.blue-card .names:nth-child(2) span:last-child');
    const balanceDisplay = document.querySelector('.blue-card .names:nth-child(3) span:last-child');
    const expenseList = document.querySelector('.expense-list');
    
    // Initialize variables
    let totalBudget = 0;
    let totalExpenses = 0;
    let balance = 0;
    let expenses = [];

    // Clear the example expenses from the list on startup
    expenseList.innerHTML = '<div class="heading">Expense List</div>';

    // Set budget function
    setBudgetBtn.addEventListener('click', function() {
        const budgetValue = parseFloat(totalAmountInput.value);
        
        if (isNaN(budgetValue) || budgetValue <= 0) {
            alert('Please enter a valid positive number for budget');
            return;
        }
        
        totalBudget = budgetValue;
        totalBudgetDisplay.textContent = totalBudget;
        calculateBalance();
        totalAmountInput.value = '';
    });

    // Add expense function
    checkAmountBtn.addEventListener('click', function() {
        const title = expenseTitleInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);
        
        if (title === '') {
            alert('Please enter a title for the expense');
            return;
        }
        
        if (isNaN(amount)) {
            alert('Please enter a valid number for expense amount');
            return;
        }
        
        // Add to expenses array
        expenses.push({
            title: title,
            amount: amount
        });
        
        // Update total expenses
        totalExpenses += amount;
        totalExpensesDisplay.textContent = totalExpenses;
        
        // Create new expense item with original UI structure
        const expenseLine = document.createElement('div');
        expenseLine.className = 'expense-line';
        expenseLine.innerHTML = `
            <span class="expense-name">${title}</span>
            <span class="expense-value">${amount}</span>
            <div class="expense-icons">
                <img src="img/task-done-svgrepo-com.svg" alt="Done">
                <img src="img/bin-svgrepo-com.svg" alt="Delete" class="delete-expense">
            </div>
        `;
        
        // Add to expense list (after the heading)
        expenseList.appendChild(expenseLine);
        
        // Add delete functionality
        expenseLine.querySelector('.delete-expense').addEventListener('click', function() {
            // Remove from expenses array
            const index = expenses.findIndex(exp => exp.title === title && exp.amount === amount);
            if (index !== -1) {
                totalExpenses -= expenses[index].amount;
                expenses.splice(index, 1);
                totalExpensesDisplay.textContent = totalExpenses;
                calculateBalance();
            }
            expenseLine.remove();
        });
        
        // Update balance and clear inputs
        calculateBalance();
        expenseTitleInput.value = '';
        expenseAmountInput.value = '';
    });

    // Calculate balance function
    function calculateBalance() {
        balance = totalBudget - totalExpenses;
        balanceDisplay.textContent = balance;
        balanceDisplay.style.color = balance < 0 ? '#ff4444' : 'white';
    }
});