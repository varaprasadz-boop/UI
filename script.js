const themeToggleButton = document.getElementById("theme-toggle");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

const THEME_STORAGE_KEY = "web-ui-theme";

function updateThemeButtonLabel(theme) {
  if (!themeToggleButton) {
    return;
  }

  themeToggleButton.textContent = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeButtonLabel(theme);
}

function getPreferredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function createTaskElement(title, priority) {
  const item = document.createElement("li");
  item.className = "task-item";

  const copy = document.createElement("div");
  copy.className = "task-copy";

  const taskTitle = document.createElement("strong");
  taskTitle.textContent = title;

  const badge = document.createElement("span");
  badge.className = `badge ${priority.toLowerCase()}`;
  badge.textContent = priority;

  copy.append(taskTitle, badge);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "task-remove";
  removeButton.setAttribute("aria-label", `Remove task ${title}`);
  removeButton.textContent = "Remove";

  item.append(copy, removeButton);
  return item;
}

if (themeToggleButton) {
  const theme = getPreferredTheme();
  applyTheme(theme);

  themeToggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

if (taskForm && taskList) {
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const titleField = taskForm.elements.namedItem("taskTitle");
    const priorityField = taskForm.elements.namedItem("taskPriority");
    if (!(titleField instanceof HTMLInputElement) || !(priorityField instanceof HTMLSelectElement)) {
      return;
    }

    const title = titleField.value.trim();
    const priority = priorityField.value;
    if (!title) {
      titleField.focus();
      return;
    }

    taskList.prepend(createTaskElement(title, priority));
    titleField.value = "";
    priorityField.value = "Medium";
    titleField.focus();
  });

  taskList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    if (!target.classList.contains("task-remove")) {
      return;
    }

    const item = target.closest(".task-item");
    if (item) {
      item.remove();
    }
  });
}
