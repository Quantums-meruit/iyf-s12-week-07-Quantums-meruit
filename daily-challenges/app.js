const THEME_KEY = "iyf-week7-theme";
const SEARCH_KEY = "iyf-week7-recent-searches";
const DRAFT_KEY = "iyf-week7-form-draft";
const REVIEW_KEY = "iyf-week7-weather-review";
const MAX_RECENT_SEARCHES = 5;
const AUTO_SAVE_INTERVAL_MS = 5000;
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Day 1: Theme Persistence.
const themeToggle = document.querySelector("#theme-toggle");
const themeStatus = document.querySelector("#theme-status");

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  themeToggle.textContent = theme === "dark"
    ? "Switch to light theme"
    : "Switch to dark theme";
}

let currentTheme = readStorage(THEME_KEY, "light");
if (!["light", "dark"].includes(currentTheme)) {
  currentTheme = "light";
}
applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  const saved = writeStorage(THEME_KEY, currentTheme);
  themeStatus.textContent = saved
    ? `Your ${currentTheme} theme preference has been saved.`
    : "Theme changed, but browser storage is unavailable.";
});

// Day 2: Recent Searches.
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResult = document.querySelector("#search-result");
const recentSearchSelect = document.querySelector("#recent-search-select");

let recentSearches = readStorage(SEARCH_KEY, []);
recentSearches = Array.isArray(recentSearches)
  ? recentSearches.filter((item) => typeof item === "string")
  : [];

function renderRecentSearches() {
  recentSearchSelect.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Recent searches…";
  recentSearchSelect.appendChild(placeholder);

  recentSearches.forEach((term) => {
    const option = document.createElement("option");
    option.value = term;
    option.textContent = term;
    recentSearchSelect.appendChild(option);
  });
}

function runSearch(term) {
  const cleanTerm = term.trim();

  if (!cleanTerm) {
    return;
  }

  recentSearches = recentSearches.filter(
    (item) => item.toLowerCase() !== cleanTerm.toLowerCase(),
  );
  recentSearches.unshift(cleanTerm);
  recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);

  const saved = writeStorage(SEARCH_KEY, recentSearches);
  searchResult.textContent = saved
    ? `You selected: ${cleanTerm}`
    : `You selected: ${cleanTerm}. Browser storage is unavailable, so history was not saved.`;

  renderRecentSearches();
  searchInput.value = cleanTerm;
  recentSearchSelect.value = "";
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch(searchInput.value);
});

recentSearchSelect.addEventListener("change", () => {
  if (recentSearchSelect.value) {
    runSearch(recentSearchSelect.value);
  }
});

renderRecentSearches();

// Day 3: Form Auto-Save.
const draftForm = document.querySelector("#draft-form");
const draftName = document.querySelector("#draft-name");
const draftNotes = document.querySelector("#draft-notes");
const draftStatus = document.querySelector("#draft-status");
const clearDraftButton = document.querySelector("#clear-draft");

function getDraft() {
  return {
    name: draftName.value,
    notes: draftNotes.value,
  };
}

function restoreDraft() {
  const draft = readStorage(DRAFT_KEY, null);

  if (!draft || typeof draft !== "object") {
    return;
  }

  draftName.value = typeof draft.name === "string" ? draft.name : "";
  draftNotes.value = typeof draft.notes === "string" ? draft.notes : "";
  draftStatus.textContent = "Your saved draft has been restored.";
}

function saveDraft() {
  const saved = writeStorage(DRAFT_KEY, getDraft());
  draftStatus.textContent = saved
    ? `Draft auto-saved at ${new Date().toLocaleTimeString()}.`
    : "Could not save the draft in this browser.";
}

restoreDraft();
const autoSaveId = window.setInterval(saveDraft, AUTO_SAVE_INTERVAL_MS);

draftForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearInterval(autoSaveId);

  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    draftStatus.textContent = "Submitted, but the browser could not clear the saved draft.";
    return;
  }

  draftForm.reset();
  draftStatus.textContent = "Submitted. The saved draft has been cleared.";
});

clearDraftButton.addEventListener("click", () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
    draftForm.reset();
    draftStatus.textContent = "Draft cleared.";
  } catch {
    draftStatus.textContent = "Could not clear the saved draft in this browser.";
  }
});

// Day 4: Refactor Challenge.
const orderItemsInput = document.querySelector("#order-items");
const calculateOrderButton = document.querySelector("#calculate-order");
const orderResult = document.querySelector("#order-result");

function validateOrderItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("The order must be an array of items.");
  }

  return items.map((item, index) => {
    const validItem =
      item &&
      typeof item.name === "string" &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 0;

    if (!validItem) {
      throw new TypeError(`Item ${index + 1} has invalid name, price, or quantity.`);
    }

    return item;
  });
}

function calculateOrderTotal(items) {
  const validItems = validateOrderItems(items);
  const subtotal = validItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const discount = subtotal > DISCOUNT_THRESHOLD
    ? subtotal * DISCOUNT_RATE
    : 0;

  return {
    subtotal,
    discount,
    total: subtotal - discount,
  };
}

calculateOrderButton.addEventListener("click", () => {
  try {
    const items = JSON.parse(orderItemsInput.value);
    const result = calculateOrderTotal(items);

    orderResult.textContent =
      `Subtotal: ${result.subtotal.toFixed(2)} · Discount: ${result.discount.toFixed(2)} · Total: ${result.total.toFixed(2)}`;
  } catch (error) {
    orderResult.textContent = `Unable to calculate order: ${error.message}`;
  }
});

// Day 5: Weather Dashboard Code Review notes.
const reviewNotes = document.querySelector("#review-notes");
const reviewStatus = document.querySelector("#review-status");

reviewNotes.value = readStorage(REVIEW_KEY, "");
reviewNotes.addEventListener("input", () => {
  const saved = writeStorage(REVIEW_KEY, reviewNotes.value);
  reviewStatus.textContent = saved
    ? "Review notes saved in this browser."
    : "Could not save review notes.";
});
