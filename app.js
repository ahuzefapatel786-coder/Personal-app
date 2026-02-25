// DEFAULT PIN
let savedPin = localStorage.getItem("appPin") || "5253";

// LOGIN FUNCTION
function checkPin() {
    const enteredPin = document.getElementById("pinInput").value;
    if (enteredPin === savedPin) {
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        loadTransactions();
        loadMemories();
    } else {
        alert("Wrong PIN");
    }
}

// PAGE NAVIGATION
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
}

// CHANGE PIN
function changePin() {
    const newPin = document.getElementById("newPin").value;
    if (newPin.length === 4) {
        localStorage.setItem("appPin", newPin);
        savedPin = newPin;
        alert("PIN Updated Successfully");
        document.getElementById("newPin").value = "";
    } else {
        alert("PIN must be 4 digits");
    }
}

// CLEAR DATA
function clearData() {
    if (confirm("Are you sure? This will delete everything.")) {
        localStorage.clear();
        location.reload();
    }
}

//////////////////////////////////////////////////////
// BUDGET SECTION
//////////////////////////////////////////////////////

function addTransaction() {
    const particular = document.getElementById("particular").value;
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;
    const amount = document.getElementById("amount").value;

    if (!particular || !date || !amount) {
        alert("Please fill all fields");
        return;
    }

    const transaction = { particular, type, date, amount };

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    loadTransactions();

    document.getElementById("particular").value = "";
    document.getElementById("amount").value = "";
}

function loadTransactions() {
    const tbody = document.querySelector("#ledger tbody");
    tbody.innerHTML = "";

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactions.forEach(t => {
        const row = `
            <tr>
                <td>${t.date}</td>
                <td>${t.particular}</td>
                <td>${t.type}</td>
                <td>${t.amount}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

//////////////////////////////////////////////////////
// GALLERY SECTION
//////////////////////////////////////////////////////

function addMemory() {
    const fileInput = document.getElementById("photoInput");
    const date = document.getElementById("photoDate").value;
    const description = document.getElementById("description").value;

    if (!fileInput.files[0] || !date || !description) {
        alert("Please fill all fields");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const memory = {
            image: e.target.result,
            date,
            description
        };

        let memories = JSON.parse(localStorage.getItem("memories")) || [];
        memories.push(memory);
        localStorage.setItem("memories", JSON.stringify(memories));

        loadMemories();
    };

    reader.readAsDataURL(fileInput.files[0]);

    fileInput.value = "";
    document.getElementById("description").value = "";
}

function loadMemories() {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";

    let memories = JSON.parse(localStorage.getItem("memories")) || [];

    memories.sort((a, b) => new Date(b.date) - new Date(a.date));

    memories.forEach(m => {
        const memoryDiv = `
            <div class="memory">
                <h4>${m.date}</h4>
                <img src="${m.image}">
                <p>${m.description}</p>
            </div>
        `;
        timeline.innerHTML += memoryDiv;
    });
}