const SCREEN_IDS = ["home", "scan", "verify", "confirm"];
const ACTIONS = {
  "check-in": "Check-In Confirmed",
  "check-out": "Check-Out Confirmed",
  break: "Break Logged",
};

const EMPLOYEE = {
  name: "Aarav Sharma",
  id: "EMP-1042",
  role: "Department: Human Resources Manager",
};

const screens = SCREEN_IDS.reduce((accumulator, id) => {
  const element = document.getElementById(`screen-${id}`);
  if (element) {
    accumulator[id] = element;
  }
  return accumulator;
}, {});

const actionButtons = Array.from(document.querySelectorAll("[data-action]"));
const cancelScanButton = document.getElementById("cancel-scan");
const capturePhotoButton = document.getElementById("capture-photo");
const backHomeButton = document.getElementById("back-home");
const confirmationTitle = document.getElementById("confirmation-title");
const summaryName = document.getElementById("summary-name");
const summaryTime = document.getElementById("summary-time");
const redirectNote = document.getElementById("redirect-note");
const employeeName = document.getElementById("employee-name");
const employeeId = document.getElementById("employee-id");
const employeeRole = document.getElementById("employee-role");
const successIcon = document.querySelector(".success-icon");

let selectedAction = "check-in";
let scanTimeoutId = 0;
let redirectTimeoutId = 0;
let redirectIntervalId = 0;

function activateScreen(targetId) {
  SCREEN_IDS.forEach((screenId) => {
    const screen = screens[screenId];
    if (!screen) {
      return;
    }

    const isActive = screenId === targetId;
    screen.classList.toggle("is-active", isActive);
    screen.setAttribute("aria-hidden", String(!isActive));
  });
}

function clearAllTimers() {
  window.clearTimeout(scanTimeoutId);
  window.clearTimeout(redirectTimeoutId);
  window.clearInterval(redirectIntervalId);
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function startRedirectCountdown() {
  let secondsRemaining = 5;
  redirectNote.textContent = `Redirecting in ${secondsRemaining}s...`;

  redirectIntervalId = window.setInterval(() => {
    secondsRemaining -= 1;
    if (secondsRemaining > 0) {
      redirectNote.textContent = `Redirecting in ${secondsRemaining}s...`;
    }
  }, 1000);

  redirectTimeoutId = window.setTimeout(() => {
    window.clearInterval(redirectIntervalId);
    activateScreen("home");
  }, 5000);
}

function showConfirmation() {
  const title = ACTIONS[selectedAction] || ACTIONS["check-in"];
  confirmationTitle.textContent = title;
  summaryName.textContent = EMPLOYEE.name;
  summaryTime.textContent = getCurrentTimeLabel();
  redirectNote.textContent = "Redirecting in 5s...";

  activateScreen("confirm");

  if (successIcon) {
    successIcon.style.animation = "none";
    window.requestAnimationFrame(() => {
      successIcon.style.animation = "";
    });
  }

  startRedirectCountdown();
}

function startScanSequence(action) {
  clearAllTimers();
  selectedAction = action;
  activateScreen("scan");
  scanTimeoutId = window.setTimeout(() => {
    activateScreen("verify");
  }, 1700);
}

function initEmployeeCard() {
  employeeName.textContent = EMPLOYEE.name;
  employeeId.textContent = `ID Number: ${EMPLOYEE.id}`;
  employeeRole.textContent = EMPLOYEE.role;
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (!action) {
      return;
    }
    startScanSequence(action);
  });
});

if (cancelScanButton) {
  cancelScanButton.addEventListener("click", () => {
    clearAllTimers();
    activateScreen("home");
  });
}

if (capturePhotoButton) {
  capturePhotoButton.addEventListener("click", () => {
    clearAllTimers();
    showConfirmation();
  });
}

if (backHomeButton) {
  backHomeButton.addEventListener("click", () => {
    clearAllTimers();
    activateScreen("home");
  });
}

initEmployeeCard();
activateScreen("home");

if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}
