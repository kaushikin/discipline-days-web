const quotes = [
  "You are stronger than your habit.",
  "One day at a time.",
  "Small steps every day make big changes.",
  "Do not give up. Restart if needed.",
  "Discipline is built one choice at a time.",
  "Your future self will thank you.",
  "Stay strong. You can do this."
];

function saveStartDate() {
  const startDate = document.getElementById("startDate").value;

  if (!startDate) {
    alert("Please choose a start date first.");
    return;
  }

  localStorage.setItem("startDate", startDate);
  updateDays();
}

function updateDays() {
  const savedDate = localStorage.getItem("startDate");

  if (!savedDate) {
    document.getElementById("daysCount").textContent = "0 Days";
    document.getElementById("message").textContent = "Choose your start date to begin.";
    return;
  }

  document.getElementById("startDate").value = savedDate;

  const start = new Date(savedDate);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = today - start;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (days < 0) {
    document.getElementById("daysCount").textContent = "0 Days";
    document.getElementById("message").textContent = "Start date cannot be in the future.";
    return;
  }

  document.getElementById("daysCount").textContent = days + " Days 🔥";

  if (days === 0) {
    document.getElementById("message").textContent = "Today is your first day. Great start!";
  } else if (days === 1) {
    document.getElementById("message").textContent = "1 day strong. Keep going!";
  } else if (days >= 7 && days < 30) {
    document.getElementById("message").textContent = "Amazing! You crossed one week!";
  } else if (days >= 30) {
    document.getElementById("message").textContent = "Excellent! You crossed 30 days!";
  } else {
    document.getElementById("message").textContent = "Keep going. You are doing great!";
  }
}

function resetStreak() {
  const confirmReset = confirm("Are you sure you want to reset your streak?");

  if (confirmReset) {
    localStorage.removeItem("startDate");
    document.getElementById("startDate").value = "";
    updateDays();
    alert("It is okay. Start again. You can do it.");
  }
}

function newQuote() {
  const randomNumber = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").textContent = quotes[randomNumber];
}

updateDays();
newQuote();
function getReasons() {
  const savedReasons = localStorage.getItem("reasons");

  if (savedReasons) {
    return JSON.parse(savedReasons);
  }

  return [];
}

function saveReasons(reasons) {
  localStorage.setItem("reasons", JSON.stringify(reasons));
}

function addReason() {
  const reasonInput = document.getElementById("reasonInput");
  const reasonText = reasonInput.value.trim();

  if (!reasonText) {
    alert("Please write a reason first.");
    return;
  }

  const reasons = getReasons();
  reasons.push(reasonText);

  saveReasons(reasons);

  reasonInput.value = "";
  showReasons();
}

function showReasons() {
  const reasonsList = document.getElementById("reasonsList");
  const reasons = getReasons();

  reasonsList.innerHTML = "";

  reasons.forEach(function(reason, index) {
    const li = document.createElement("li");
    li.textContent = reason;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = function() {
      deleteReason(index);
    };

    li.appendChild(deleteButton);
    reasonsList.appendChild(li);
  });
}

function deleteReason(index) {
  const reasons = getReasons();

  reasons.splice(index, 1);

  saveReasons(reasons);
  showReasons();
}

showReasons();