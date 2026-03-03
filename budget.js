let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function toggleForm() {
    document.getElementById("formSection").classList.toggle("hidden");
}

function toggleTable() {
    document.getElementById("tableSection").classList.toggle("hidden");
    renderTable();
}

document.getElementById("budgetForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        id: Date.now(),
        date: document.getElementById("date").value,
        type: document.getElementById("type").value,
        amount: parseFloat(document.getElementById("amount").value),
        remarks: document.getElementById("remarks").value
    };

    transactions.push(data);
    saveToStorage();
    calculateTotals();
    renderTable();
    this.reset();
});

function calculateTotals() {
    let income = 0, expense = 0, hasana = 0, quarterly = 0, provided = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        if (t.type === "expense") expense += t.amount;
        if (t.type === "hasana") hasana += t.amount;
        if (t.type === "quarterly") quarterly += t.amount;
        if (t.type === "provided") provided += t.amount;
    });

    document.getElementById("totalIncome").innerText = income;
    document.getElementById("totalExpense").innerText = expense;
    document.getElementById("totalHasana").innerText = hasana;
    document.getElementById("totalQuarterly").innerText = quarterly;
    document.getElementById("totalProvided").innerText = provided;

    const balance = income - expense - hasana - quarterly - provided;
    document.getElementById("currentBalance").innerText = balance;
}

function renderTable() {
    const table = document.getElementById("transactionTable");
    table.innerHTML = "";

    transactions.forEach(t => {
        table.innerHTML += `
            <tr>
                <td>${t.date}</td>
                <td>${t.type}</td>
                <td>${t.amount}</td>
                <td>${t.remarks}</td>
                <td>
                    <button onclick="edit(${t.id})">Edit</button>
                    <button onclick="remove(${t.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function remove(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToStorage();
    calculateTotals();
    renderTable();
}

function edit(id) {
    const t = transactions.find(x => x.id === id);
    document.getElementById("date").value = t.date;
    document.getElementById("type").value = t.type;
    document.getElementById("amount").value = t.amount;
    document.getElementById("remarks").value = t.remarks;
    remove(id);
    toggleForm();
}

function downloadPDF() {
    window.print();
}

function downloadExcel() {
    let csv = "Date,Type,Amount,Remarks\n";
    transactions.forEach(t => {
        csv += `${t.date},${t.type},${t.amount},${t.remarks}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "budget.csv";
    link.click();
}

calculateTotals();