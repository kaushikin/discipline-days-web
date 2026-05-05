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
  const startDateInput = document.getElementById("startDate");

  if (!startDateInput) {
    alert("Start date box not found.");
    return;
  }

  const startDate = startDateInput.value;

  if (!startDate) {
    alert("Please choose a start date first.");
    return;
  }

  localStorage.setItem("startDate", startDate);
  updateDays();
}

function updateDays() {
  const daysCount = document.getElementById("daysCount");
  const message = document.getElementById("message");
  const startDateInput = document.getElementById("startDate");

  if (!daysCount || !message) {
    return;
  }

  const savedDate = localStorage.getItem("startDate");

  if (!savedDate) {
    daysCount.textContent = "0 Days";
    message.textContent = "Choose your start date to begin.";
    showBadges(0);
    return;
  }

  if (startDateInput) {
    startDateInput.value = savedDate;
  }

  const start = new Date(savedDate);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = today - start;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (days < 0) {
    daysCount.textContent = "0 Days";
    message.textContent = "Start date cannot be in the future.";
    showBadges(0);
    return;
  }

  daysCount.textContent = days + " Days 🔥";
  showBadges(days);

  if (days === 0) {
    message.textContent = "Today is your first day. Great start!";
  } else if (days === 1) {
    message.textContent = "1 day strong. Keep going!";
  } else if (days >= 7 && days < 30) {
    message.textContent = "Amazing! You crossed one week!";
  } else if (days >= 30) {
    message.textContent = "Excellent! You crossed 30 days!";
  } else {
    message.textContent = "Keep going. You are doing great!";
  }
}

function resetStreak() {
  const confirmReset = confirm("Are you sure you want to reset your streak?");

  if (confirmReset) {
    localStorage.removeItem("startDate");

    const startDateInput = document.getElementById("startDate");

    if (startDateInput) {
      startDateInput.value = "";
    }

    updateDays();
    alert("It is okay. Start again. You can do it.");
  }
}

function newQuote() {
  const quote = document.getElementById("quote");

  if (!quote) {
    return;
  }

  const randomNumber = Math.floor(Math.random() * quotes.length);
  quote.textContent = quotes[randomNumber];
}

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

  if (!reasonInput) {
    alert("Reason box not found.");
    return;
  }

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

  if (!reasonsList) {
    return;
  }

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

function showBadges(days) {
  const badgesDiv = document.getElementById("badges");

  if (!badgesDiv) {
    return;
  }

  badgesDiv.innerHTML = "";

  const badges = [];

  if (days >= 1) {
    badges.push("🏅 1 Day");
  }

  if (days >= 7) {
    badges.push("🔥 7 Days");
  }

  if (days >= 30) {
    badges.push("💪 30 Days");
  }

  if (days >= 100) {
    badges.push("👑 100 Days");
  }

  if (badges.length === 0) {
    badgesDiv.innerHTML = "<p>No badges yet. Start today!</p>";
    return;
  }

  badges.forEach(function(badgeText) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = badgeText;
    badgesDiv.appendChild(badge);
  });
}

updateDays();
newQuote();
showReasons();