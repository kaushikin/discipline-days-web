let currentDate = new Date();
let selectedDate = null;

const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");

const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

const selectedDateTitle = document.getElementById("selectedDateTitle");
const socialHoursInput = document.getElementById("socialHours");
const drinksInput = document.getElementById("drinks");
const smokeInput = document.getElementById("smoke");
const pornInput = document.getElementById("porn");

// Phase 1 fields
const moodInput = document.getElementById("mood");
const triggerInput = document.getElementById("trigger");
const notesInput = document.getElementById("notes");

const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const dayStatus = document.getElementById("dayStatus");

const STORAGE_KEY = "disciplineDaysData";

function getSavedData() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return {};
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Could not read saved data:", error);
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatReadableDate(dateKey) {
  const parts = dateKey.split("-");
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}-${month}-${year}`;
}

function dateFromKey(dateKey) {
  const parts = dateKey.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);

  return new Date(year, month, day);
}

function getMoodLabel(mood) {
  const moods = {
    happy: "😊 Happy",
    motivated: "🔥 Motivated",
    calm: "😌 Calm",
    stressed: "😣 Stressed",
    angry: "😡 Angry",
    lonely: "😔 Lonely",
    bored: "🥱 Bored",
    tired: "😴 Tired",
    anxious: "😰 Anxious"
  };

  return moods[mood] || "";
}

function getTriggerLabel(trigger) {
  const triggers = {
    none: "None",
    stress: "Stress",
    boredom: "Boredom",
    loneliness: "Loneliness",
    "late-night-scrolling": "Late night scrolling",
    "friends-party": "Friends / Party",
    anger: "Anger",
    urge: "Strong urge",
    habit: "Old habit",
    other: "Other"
  };

  return triggers[trigger] || "";
}

function getDayResult(dayData) {
  if (!dayData) {
    return "gray";
  }

  const socialHours = Number(dayData.socialHours);
  const drinks = dayData.drinks;
  const smoke = dayData.smoke;
  const porn = dayData.porn;

  if (
    dayData.socialHours === "" ||
    drinks === "" ||
    smoke === "" ||
    porn === ""
  ) {
    return "orange";
  }

  if (drinks === "yes" || smoke === "yes" || porn === "yes") {
    return "red";
  }

  if (socialHours > 1.5) {
    return "orange";
  }

  return "green";
}

function getStatusText(dayData) {
  if (!dayData) {
    return "No data for this day.";
  }

  const result = getDayResult(dayData);

  let mainText = "No data for this day.";

  if (result === "green") {
    mainText = "Good day ✅ You followed your discipline goals.";
  }

  if (result === "orange") {
    mainText = "Partial day 🟠 You did okay, but there is room to improve.";
  }

  if (result === "red") {
    mainText = "Poor day 🔴 It is okay. Learn and try again tomorrow.";
  }

  const details = [];

  if (dayData.mood) {
    details.push(`Mood: ${getMoodLabel(dayData.mood)}`);
  }

  if (dayData.trigger) {
    details.push(`Trigger: ${getTriggerLabel(dayData.trigger)}`);
  }

  if (dayData.notes) {
    details.push("Notes saved 📝");
  }

  if (details.length > 0) {
    return `${mainText} ${details.join(" | ")}`;
  }

  return mainText;
}

function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long"
  });

  monthYear.textContent = `${monthName} ${year}`;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  weekDays.forEach(function(day) {
    const weekDayDiv = document.createElement("div");
    weekDayDiv.className = "weekday";
    weekDayDiv.textContent = day;
    calendar.appendChild(weekDayDiv);
  });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  for (let i = 0; i < startDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty";
    calendar.appendChild(emptyDiv);
  }

  const savedData = getSavedData();

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const dayData = savedData[dateKey];

    const dayDiv = document.createElement("button");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = day;

    const result = getDayResult(dayData);
    dayDiv.classList.add(result);

    if (selectedDate === dateKey) {
      dayDiv.classList.add("selected");
    }

    dayDiv.onclick = function() {
      selectDate(dateKey);
    };

    calendar.appendChild(dayDiv);
  }

  renderDashboard();
}

function selectDate(dateKey) {
  selectedDate = dateKey;

  selectedDateTitle.textContent = `Selected date: ${formatReadableDate(dateKey)}`;

  const savedData = getSavedData();
  const dayData = savedData[dateKey];

  if (dayData) {
    socialHoursInput.value = dayData.socialHours || "";
    drinksInput.value = dayData.drinks || "";
    smokeInput.value = dayData.smoke || "";
    pornInput.value = dayData.porn || "";

    if (moodInput) {
      moodInput.value = dayData.mood || "";
    }

    if (triggerInput) {
      triggerInput.value = dayData.trigger || "";
    }

    if (notesInput) {
      notesInput.value = dayData.notes || "";
    }

    dayStatus.textContent = getStatusText(dayData);
  } else {
    socialHoursInput.value = "";
    drinksInput.value = "";
    smokeInput.value = "";
    pornInput.value = "";

    if (moodInput) {
      moodInput.value = "";
    }

    if (triggerInput) {
      triggerInput.value = "";
    }

    if (notesInput) {
      notesInput.value = "";
    }

    dayStatus.textContent = "No data for this day.";
  }

  renderCalendar();
}

function saveSelectedDay() {
  if (!selectedDate) {
    alert("Please select a date first.");
    return;
  }

  const socialHours = socialHoursInput.value;
  const drinks = drinksInput.value;
  const smoke = smokeInput.value;
  const porn = pornInput.value;

  const mood = moodInput ? moodInput.value : "";
  const trigger = triggerInput ? triggerInput.value : "";
  const notes = notesInput ? notesInput.value.trim() : "";

  if (socialHours === "" || drinks === "" || smoke === "" || porn === "") {
    alert("Please fill all main discipline fields before saving.");
    return;
  }

  const savedData = getSavedData();

  savedData[selectedDate] = {
    socialHours: socialHours,
    drinks: drinks,
    smoke: smoke,
    porn: porn,
    mood: mood,
    trigger: trigger,
    notes: notes
  };

  saveData(savedData);

  dayStatus.textContent = getStatusText(savedData[selectedDate]);

  renderCalendar();

  alert("Day saved successfully.");
}

function clearSelectedDay() {
  if (!selectedDate) {
    alert("Please select a date first.");
    return;
  }

  const confirmClear = confirm("Are you sure you want to clear this day?");

  if (!confirmClear) {
    return;
  }

  const savedData = getSavedData();

  delete savedData[selectedDate];

  saveData(savedData);

  socialHoursInput.value = "";
  drinksInput.value = "";
  smokeInput.value = "";
  pornInput.value = "";

  if (moodInput) {
    moodInput.value = "";
  }

  if (triggerInput) {
    triggerInput.value = "";
  }

  if (notesInput) {
    notesInput.value = "";
  }

  dayStatus.textContent = "Day cleared.";

  renderCalendar();
}

function goToPreviousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function goToNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function showEmergencyHelp() {
  const helpBox = document.getElementById("helpBox");

  if (!helpBox) {
    return;
  }

  helpBox.classList.toggle("hidden");
}

function calculateCurrentStreak(savedData) {
  let streak = 0;
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  while (true) {
    const dateKey = formatDateKey(today);
    const dayData = savedData[dateKey];

    if (getDayResult(dayData) === "green") {
      streak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateBestStreak(savedData) {
  const greenDates = Object.keys(savedData)
    .filter(function(dateKey) {
      return getDayResult(savedData[dateKey]) === "green";
    })
    .sort();

  if (greenDates.length === 0) {
    return 0;
  }

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < greenDates.length; i++) {
    const previousDate = dateFromKey(greenDates[i - 1]);
    const currentDateItem = dateFromKey(greenDates[i]);

    const difference =
      (currentDateItem - previousDate) / (1000 * 60 * 60 * 24);

    if (difference === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
  }

  return bestStreak;
}

function renderDashboard() {
  const currentStreakEl = document.getElementById("currentStreak");
  const bestStreakEl = document.getElementById("bestStreak");
  const goodDaysEl = document.getElementById("goodDays");
  const disciplineScoreEl = document.getElementById("disciplineScore");
  const disciplineLevelEl = document.getElementById("disciplineLevel");
  const levelMessageEl = document.getElementById("levelMessage");

  if (
    !currentStreakEl ||
    !bestStreakEl ||
    !goodDaysEl ||
    !disciplineScoreEl ||
    !disciplineLevelEl ||
    !levelMessageEl
  ) {
    return;
  }

  const savedData = getSavedData();

  const currentStreak = calculateCurrentStreak(savedData);
  const bestStreak = calculateBestStreak(savedData);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  let goodDays = 0;
  let partialDays = 0;
  let poorDays = 0;
  let trackedDays = 0;

  Object.keys(savedData).forEach(function(dateKey) {
    const date = dateFromKey(dateKey);

    if (date.getFullYear() === year && date.getMonth() === month) {
      const result = getDayResult(savedData[dateKey]);

      if (result === "green") {
        goodDays++;
        trackedDays++;
      } else if (result === "orange") {
        partialDays++;
        trackedDays++;
      } else if (result === "red") {
        poorDays++;
        trackedDays++;
      }
    }
  });

  let score = 0;

  if (trackedDays > 0) {
    score = Math.round(
      ((goodDays * 100 + partialDays * 50 + poorDays * 0) /
        (trackedDays * 100)) *
        100
    );
  }

  let level = "Beginner";
  let message = "Start tracking to unlock your level.";

  if (score >= 90) {
    level = "👑 Discipline Legend";
    message = "Elite level. Keep protecting your peace and discipline.";
  } else if (score >= 75) {
    level = "🔥 Discipline Hero";
    message = "Great work. You are building serious self-control.";
  } else if (score >= 50) {
    level = "💪 Discipline Builder";
    message = "Good progress. Fix small leaks and keep going.";
  } else if (trackedDays > 0) {
    level = "🌱 Discipline Beginner";
    message = "Nice start. Learn from each day and come back stronger.";
  }

  if (currentStreak >= 7) {
    message = `${message} Your streak is heating up.`;
  }

  if (currentStreak >= 30) {
    message = "Massive respect. You are proving discipline daily.";
  }

  currentStreakEl.textContent = currentStreak;
  bestStreakEl.textContent = bestStreak;
  goodDaysEl.textContent = goodDays;
  disciplineScoreEl.textContent = score + "%";
  disciplineLevelEl.textContent = level;
  levelMessageEl.textContent = message;
}

window.showEmergencyHelp = showEmergencyHelp;

if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", goToPreviousMonth);
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener("click", goToNextMonth);
}

if (saveBtn) {
  saveBtn.addEventListener("click", saveSelectedDay);
}

if (clearBtn) {
  clearBtn.addEventListener("click", clearSelectedDay);
}

if (calendar && monthYear) {
  renderCalendar();
} else {
  console.error("Calendar HTML elements are missing. Check index.html IDs.");
}