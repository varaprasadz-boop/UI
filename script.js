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
const shiftSelector = document.getElementById("shift-selector");
const shiftOptions = Array.from(document.querySelectorAll(".shift-option"));
const proceedShiftButton = document.getElementById("proceed-shift");
const cancelScanButton = document.getElementById("cancel-scan");
const capturePhotoButton = document.getElementById("capture-photo");
const backHomeButton = document.getElementById("back-home");
const scanShift = document.getElementById("scan-shift");
const confirmationTitle = document.getElementById("confirmation-title");
const summaryName = document.getElementById("summary-name");
const summaryTime = document.getElementById("summary-time");
const summaryShift = document.getElementById("summary-shift");
const redirectNote = document.getElementById("redirect-note");
const employeeName = document.getElementById("employee-name");
const employeeId = document.getElementById("employee-id");
const employeeRole = document.getElementById("employee-role");
const verifyShift = document.getElementById("verify-shift");
const successIcon = document.querySelector(".success-icon");

let selectedAction = "check-in";
let selectedShift = null;
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
  scanTimeoutId = 0;
  redirectTimeoutId = 0;
  redirectIntervalId = 0;
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function getCurrentShiftName() {
  const hour = new Date().getHours();
  if (hour >= 14) {
    return "Evening Shift";
  }
  if (hour >= 9) {
    return "General Shift";
  }
  return "Morning Shift";
}

function clearShiftSelection() {
  shiftOptions.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-selected", "false");
  });
  selectedShift = null;
  if (proceedShiftButton) {
    proceedShiftButton.disabled = true;
  }
}

function markCurrentShift() {
  const currentShiftName = getCurrentShiftName();
  shiftOptions.forEach((button) => {
    button.classList.toggle("is-current", button.dataset.shiftName === currentShiftName);
  });
}

function openShiftSelector() {
  if (!shiftSelector) {
    return;
  }

  selectedAction = "check-in";
  shiftSelector.hidden = false;
  clearShiftSelection();
  markCurrentShift();
}

function hideShiftSelector() {
  if (!shiftSelector) {
    return;
  }
  shiftSelector.hidden = true;
  clearShiftSelection();
}

function setShiftSelection(button) {
  const shiftName = button.dataset.shiftName;
  const shiftTime = button.dataset.shiftTime;
  if (!shiftName || !shiftTime) {
    return;
  }

  selectedShift = {
    name: shiftName,
    time: shiftTime,
  };

  shiftOptions.forEach((option) => {
    const isSelected = option === button;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-selected", String(isSelected));
  });

  if (proceedShiftButton) {
    proceedShiftButton.disabled = false;
  }
}

function updateShiftContext() {
  const hasShift = selectedAction === "check-in" && selectedShift;
  const shiftText = hasShift ? `${selectedShift.name} (${selectedShift.time})` : "";

  if (scanShift) {
    scanShift.hidden = !hasShift;
    scanShift.textContent = hasShift ? `Shift: ${shiftText}` : "";
  }

  if (verifyShift) {
    verifyShift.hidden = !hasShift;
    verifyShift.textContent = hasShift ? `Shift: ${shiftText}` : "";
  }

  if (summaryShift) {
    summaryShift.hidden = !hasShift;
    summaryShift.textContent = hasShift ? `Shift: ${selectedShift.name}` : "";
  }
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
    goHome();
  }, 5000);
}

function showConfirmation() {
  const title = ACTIONS[selectedAction] || ACTIONS["check-in"];
  confirmationTitle.textContent = title;
  summaryName.textContent = EMPLOYEE.name;
  summaryTime.textContent = getCurrentTimeLabel();
  updateShiftContext();
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
  updateShiftContext();
  activateScreen("scan");
  scanTimeoutId = window.setTimeout(() => {
    activateScreen("verify");
  }, 1700);
}

function goHome() {
  clearAllTimers();
  activateScreen("home");
  hideShiftSelector();
  updateShiftContext();
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

    if (action === "check-in") {
      openShiftSelector();
      return;
    }

    selectedShift = null;
    hideShiftSelector();
    startScanSequence(action);
  });
});

shiftOptions.forEach((button) => {
  button.addEventListener("click", () => {
    setShiftSelection(button);
  });
});

if (proceedShiftButton) {
  proceedShiftButton.addEventListener("click", () => {
    if (!selectedShift) {
      return;
    }

    startScanSequence("check-in");
  });
}

if (cancelScanButton) {
  cancelScanButton.addEventListener("click", () => {
    goHome();
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
    goHome();
  });
}

initEmployeeCard();
activateScreen("home");
hideShiftSelector();
updateShiftContext();

if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}
