const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

const selectedDateTitle = document.getElementById("selectedDateTitle");
const socialHoursInput = document.getElementById("socialHours");
const drinksInput = document.getElementById("drinks");
const smokeInput = document.getElementById("smoke");
const pornInput = document.getElementById("porn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const dayStatus = document.getElementById("dayStatus");

let currentDate = new Date();
let selectedDate = null;

const STORAGE_KEY = "discipline-days-data";

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDayScore(entry) {
  if (!entry) return null;

  let score = 0;

  if (entry.socialHours !== "" && Number(entry.socialHours) <= 1.5) score++;
  if (entry.drinks === "no") score++;
  if (entry.smoke === "no") score++;
  if (entry.porn === "no") score++;

  return score;
}

function getDayClass(entry) {
  if (!entry) return "gray";

  const score = getDayScore(entry);

  if (score === 4) return "green";
  if (score >= 2) return "orange";
  return "red";
}

function renderCalendar() {
  calendar.innerHTML = "";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(day => {
    const dayName = document.createElement("div");
    dayName.className = "day-name";
    dayName.textContent = day;
    calendar.appendChild(dayName);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendar.appendChild(empty);
  }

  const data = getData();

  for (let day = 1; day <= totalDays; day++) {
    const cellDate = new Date(year, month, day);
    const dateKey = formatDateKey(cellDate);
    const entry = data[dateKey];

    const dayCell = document.createElement("div");
    dayCell.className = `day ${getDayClass(entry)}`;
    dayCell.textContent = day;

    if (selectedDate && formatDateKey(selectedDate) === dateKey) {
      dayCell.classList.add("selected");
    }

    dayCell.addEventListener("click", () => {
      selectedDate = cellDate;
      loadSelectedDate();
      renderCalendar();
    });

    calendar.appendChild(dayCell);
  }
}

function loadSelectedDate() {
  if (!selectedDate) return;

  const dateKey = formatDateKey(selectedDate);
  const data = getData();
  const entry = data[dateKey] || {
    socialHours: "",
    drinks: "",
    smoke: "",
    porn: ""
  };

  selectedDateTitle.textContent = `Tracking: ${selectedDate.toDateString()}`;
  socialHoursInput.value = entry.socialHours;
  drinksInput.value = entry.drinks;
  smokeInput.value = entry.smoke;
  pornInput.value = entry.porn;

  updateDayStatus(entry);
}

function updateDayStatus(entry) {
  if (!selectedDate) {
    dayStatus.textContent = "No date selected.";
    return;
  }

  const score = getDayScore(entry);

  if (score === null) {
    dayStatus.textContent = "No data saved for this day.";
    return;
  }

  if (score === 4) {
    dayStatus.textContent = "Excellent day ✅ All goals met.";
  } else if (score >= 2) {
    dayStatus.textContent = "Partial day ⚠️ Some goals were missed.";
  } else {
    dayStatus.textContent = "Poor day ❌ Most goals were missed.";
  }
}

saveBtn.addEventListener("click", () => {
  if (!selectedDate) {
    alert("Please select a date from the calendar.");
    return;
  }

  const data = getData();
  const dateKey = formatDateKey(selectedDate);

  const entry = {
    socialHours: socialHoursInput.value,
    drinks: drinksInput.value,
    smoke: smokeInput.value,
    porn: pornInput.value
  };

  data[dateKey] = entry;
  saveData(data);
  updateDayStatus(entry);
  renderCalendar();

  alert("Day saved successfully.");
});

clearBtn.addEventListener("click", () => {
  if (!selectedDate) {
    alert("Please select a date first.");
    return;
  }

  const data = getData();
  const dateKey = formatDateKey(selectedDate);

  delete data[dateKey];
  saveData(data);

  socialHoursInput.value = "";
  drinksInput.value = "";
  smokeInput.value = "";
  pornInput.value = "";

  updateDayStatus(null);
  renderCalendar();
});

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
