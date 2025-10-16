// ==================== GLOBAL VARIABLES ====================
let totalBudget = 0;
let totalExpenses = 0;
let expenses = [];

// ==================== DOM ELEMENTS ====================
const budgetInput = document.getElementById('budgetInput');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const expenseTitle = document.getElementById('expenseTitle');
const expenseAmount = document.getElementById('expenseAmount');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const totalBudgetDisplay = document.getElementById('totalBudget');
const totalExpensesDisplay = document.getElementById('totalExpenses');
const balanceDisplay = document.getElementById('balance');
const expenseList = document.getElementById('expenseList');
const expenseCount = document.getElementById('expenseCount');

// ==================== EVENT LISTENERS ====================

// Set Budget Button Click
setBudgetBtn.addEventListener('click', setBudget);

// Add Expense Button Click
addExpenseBtn.addEventListener('click', addExpense);

// Clear All Button Click
clearAllBtn.addEventListener('click', clearAllExpenses);

// Enter key support for inputs
budgetInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setBudget();
    }
});

expenseAmount.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addExpense();
    }
});

expenseTitle.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        expenseAmount.focus();
    }
});

// ==================== CORE FUNCTIONS ====================

/**
 * Set the total budget
 */
function setBudget() {
    const budget = parseFloat(budgetInput.value);
    
    // Validation
    if (isNaN(budget) || budget <= 0) {
        showAlert('Please enter a valid budget amount', 'error');
        budgetInput.focus();
        return;
    }
    
    totalBudget = budget;
    budgetInput.value = '';
    
    updateDisplay();
    showAlert('Budget set successfully!', 'success');
    
    // Add a nice animation to the budget stat
    animateValue(totalBudgetDisplay, 0, budget);
}

/**
 * Add a new expense
 */
function addExpense() {
    const title = expenseTitle.value.trim();
    const amount = parseFloat(expenseAmount.value);
    
    // Validation
    if (title === '') {
        showAlert('Please enter an expense title', 'error');
        expenseTitle.focus();
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showAlert('Please enter a valid expense amount', 'error');
        expenseAmount.focus();
        return;
    }
    
    // Create expense object
    const expense = {
        id: Date.now(),
        title: title,
        amount: amount,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    };
    
    // Add to expenses array
    expenses.push(expense);
    totalExpenses += amount;
    
    // Update UI
    renderExpenseList();
    updateDisplay();
    
    // Clear inputs
    expenseTitle.value = '';
    expenseAmount.value = '';
    expenseTitle.focus();
    
    // Show success message
    showAlert('Expense added successfully!', 'success');
    
    // Show clear all button if there are expenses
    if (expenses.length > 0) {
        clearAllBtn.style.display = 'block';
    }
}

/**
 * Delete a specific expense
 */
function deleteExpense(id) {
    const index = expenses.findIndex(exp => exp.id === id);
    
    if (index !== -1) {
        // Subtract from total
        totalExpenses -= expenses[index].amount;
        
        // Remove from array
        expenses.splice(index, 1);
        
        // Update UI
        renderExpenseList();
        updateDisplay();
        
        showAlert('Expense deleted successfully!', 'success');
        
        // Hide clear all button if no expenses
        if (expenses.length === 0) {
            clearAllBtn.style.display = 'none';
        }
    }
}

/**
 * Clear all expenses
 */
function clearAllExpenses() {
    if (expenses.length === 0) return;
    
    if (confirm('Are you sure you want to delete all expenses?')) {
        expenses = [];
        totalExpenses = 0;
        
        renderExpenseList();
        updateDisplay();
        
        clearAllBtn.style.display = 'none';
        showAlert('All expenses cleared!', 'success');
    }
}

/**
 * Render the expense list
 */
function renderExpenseList() {
    expenseList.innerHTML = '';
    
    if (expenses.length === 0) {
        // Show empty state
        expenseList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No expenses yet. Add your first expense to get started!</p>
            </div>
        `;
    } else {
        // Render all expenses (newest first)
        const sortedExpenses = [...expenses].reverse();
        
        sortedExpenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'expense-item';
            expenseItem.innerHTML = `
                <div class="expense-info">
                    <div class="expense-title">${escapeHtml(expense.title)}</div>
                    <div class="expense-date">${expense.date}</div>
                    <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                </div>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    🗑️ Delete
                </button>
            `;
            
            expenseList.appendChild(expenseItem);
        });
    }
}

/**
 * Update all display values
 */
function updateDisplay() {
    // Update budget display
    totalBudgetDisplay.textContent = `$${totalBudget.toFixed(2)}`;
    
    // Update expenses display
    totalExpensesDisplay.textContent = `$${totalExpenses.toFixed(2)}`;
    
    // Calculate and update balance
    const balance = totalBudget - totalExpenses;
    balanceDisplay.textContent = `$${balance.toFixed(2)}`;
    
    // Change balance color based on value
    const balanceStatItem = balanceDisplay.closest('.stat-item');
    if (balance < 0) {
        balanceStatItem.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)';
    } else if (balance < totalBudget * 0.2) {
        balanceStatItem.style.background = 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)';
    } else {
        balanceStatItem.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
    
    // Update expense count
    expenseCount.textContent = `${expenses.length} item${expenses.length !== 1 ? 's' : ''}`;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    `;
    
    if (type === 'success') {
        alert.style.background = 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)';
    } else if (type === 'error') {
        alert.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)';
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

/**
 * Animate number counting
 */
function animateValue(element, start, end, duration = 600) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = `${current.toFixed(2)}`;
    }, 16);
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Save data to localStorage (for future enhancement)
 */
function saveToLocalStorage() {
    const data = {
        totalBudget: totalBudget,
        totalExpenses: totalExpenses,
        expenses: expenses
    };
    localStorage.setItem('budgetTrackerData', JSON.stringify(data));
}

/**
 * Load data from localStorage (for future enhancement)
 */
function loadFromLocalStorage() {
    const data = localStorage.getItem('budgetTrackerData');
    if (data) {
        const parsed = JSON.parse(data);
        totalBudget = parsed.totalBudget || 0;
        totalExpenses = parsed.totalExpenses || 0;
        expenses = parsed.expenses || [];
        
        renderExpenseList();
        updateDisplay();
        
        if (expenses.length > 0) {
            clearAllBtn.style.display = 'block';
        }
    }
}

// ==================== INITIALIZE APP ====================

/**
 * Initialize the application
 */
function init() {
    // Uncomment the line below if you want to enable localStorage persistence
    // loadFromLocalStorage();
    
    // Initial display update
    updateDisplay();
    
    // Add focus to budget input on load
    budgetInput.focus();
    
    console.log('Budget Tracker initialized successfully! 💰');
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}