# Week 7: JavaScript Best Practices

This is my Week 7 project for IYF Weekend Academy Season 12. I used my Week 5 To-Do List as the starting point and worked on making the code easier to understand, test, maintain, and extend.

The main project is a To-Do List built with modular JavaScript. It saves tasks and the selected filter in the browser, and its task logic is covered by automated tests. I also included the Lesson 13 Shopping Cart mini-project and a page containing the five Week 7 daily challenges.

## Live demo

[Open my Week 7 project on GitHub Pages](https://quantums-meruit.github.io/iyf-s12-week-07-Quantums-meruit/)

The home page links to the To-Do List, Shopping Cart, and Daily Challenges. The site is deployed on GitHub Pages.

## Project features

### To-Do List

- Add tasks and trim unnecessary spaces from task text.
- Mark tasks as completed or active.
- Edit a task by double-clicking its text. Press **Enter** to save or **Escape** to cancel.
- Delete individual tasks or clear all completed tasks.
- Filter the list to show all, active, or completed tasks.
- Display the number of unfinished tasks and an empty-state message.
- Save tasks and the selected filter in browser localStorage, then restore them after a refresh.
- Use event delegation for task actions.

### Shopping Cart

- Browse a small sample product catalogue with prices in Kenyan shillings.
- Add products to the cart.
- Increase or decrease quantities and remove individual products.
- See the item count and subtotal update when the cart changes.
- Clear the cart and keep the cart contents after refreshing the page.

This is a learning project, not a real store: it does not process payments or place orders.

### Daily Challenges

The Daily Challenges page contains the five exercises from the Week 7 guide:

1. **Theme Persistence** — switch between light and dark themes and save the preference.
2. **Recent Searches** — save the five latest searches, remove duplicates, and reuse a previous search.
3. **Form Auto-Save** — save a draft every five seconds, restore it after a refresh, and clear it after submission.
4. **Refactor Challenge** — validate order data, calculate totals, use named constants, and handle invalid input.
5. **Code Review** — inspect my Week 6 Weather Dashboard and record review notes.

Challenge data is stored locally in the browser. It is not sent to a server.

## How the code is organised

| File or folder | Responsibility |
|---|---|
| index.html | To-Do List page structure |
| styles.css | Main To-Do List styling |
| js/app.js | Connects events, task logic, state, and rendering |
| js/state.js | Holds central application state and notifies subscribers |
| js/storage.js | Saves and loads tasks and the selected filter |
| js/todo-logic.js | Pure functions for adding, editing, filtering, toggling, deleting, counting, and clearing tasks |
| js/ui.js | Renders tasks and updates the interface |
| tests/todo-logic.test.js | Automated tests for pure task functions |
| cart/ | Shopping Cart mini-project |
| daily-challenges/ | Five interactive Week 7 exercises |
| .github/workflows/ | Automated quality checks and GitHub Pages deployment |
| eslint.config.js | ESLint 9 flat configuration |
| .prettierrc | Shared formatting rules |
| .gitignore | Excludes node_modules and other generated/local files |

## Run it locally

You need Node.js 22 or 24 and npm for the quality tools and tests.

1. Clone the repository:

   git clone https://github.com/Quantums-meruit/iyf-s12-week-07-Quantums-meruit.git
   cd iyf-s12-week-07-Quantums-meruit

2. Install the development dependencies:

   npm install

3. Start a local server from the project folder. For example, use the VS Code Live Server extension and open index.html.

   The project uses JavaScript modules, so it should be served over HTTP rather than opened directly through a file:// URL.

4. Open cart/index.html or daily-challenges/index.html to explore the other exercises.

## Quality checks

I used Node's built-in test runner, which is an accepted alternative to Vitest in the Week 7 guide.

Run the automated tests:

   npm test

Check JavaScript with ESLint:

   npm run lint

Check formatting with Prettier:

   npm run format:check

Format the project when needed:

   npm run format

The latest GitHub Actions quality run passed all 13 tests and ESLint. The Prettier formatting check is available as a local command and still needs to be run on the completed main branch.

The tests cover filtering, active-task counting, toggling, deleting, adding, clearing completed tasks, editing, empty input, missing IDs, and preserving the original array.

## What I learned

The biggest lesson for me this week was that a project becomes easier to work with when each file has a clear responsibility. In my original To-Do List, the task data, browser storage, event handling, and DOM updates lived together. Splitting those responsibilities helped me see how the parts communicate instead of treating the application as one large script.

I also learned why pure functions are useful. A function that receives an array and returns a new array can be tested without opening a browser or creating DOM elements. That made it possible to use Node's test runner to check task behaviour and edge cases.

Working with localStorage helped me understand that browser storage keeps strings, so arrays and objects need JSON serialization and parsing. I also practised loading saved values safely when storage is empty or contains invalid JSON.

The observer pattern gave me a way to keep the interface in sync with central state. When the task list or filter changes, the state module notifies the UI to render the latest data.

## Challenges I worked through

- **Splitting the original application:** deciding what belongs in task logic, state, storage, rendering, and the entry-point file took careful thought.
- **Keeping modules connected:** I had to make sure exported function names and imported names matched exactly.
- **Testing pure functions:** I learned to check both the returned result and whether the original array was left unchanged.
- **Preserving the original interface:** the JavaScript-generated elements need CSS class names that match the stylesheet. A mismatch can make correct JavaScript look broken.
- **Handling persistence:** saved JSON can be missing or invalid, so loading functions need safe fallbacks.
- **Maintaining code quality:** ESLint and Prettier check different things. ESLint finds code-quality problems, while Prettier keeps formatting consistent.

## Deployment

The repository includes a GitHub Actions workflow for GitHub Pages. It runs tests and ESLint before deploying the static site. Check the Actions tab for the latest deployment result and Settings → Pages if the live page does not load.

## Collaboration (Week 7)

This section is reserved for the Week 7 pair-review details. I will complete the partner information and add the actual review links once I have confirmed my classmate and their repository. I have kept the existing project work and PR history unchanged.

- **Team / partner:** To be added by me — classmate's name and GitHub profile.
- **Shared repo:** To be added by me — the classmate's Week 7 To-Do List repository.
- **PR I opened:** [Week 7 module-refactor PR #1](https://github.com/Quantums-meruit/iyf-s12-week-07-Quantums-meruit/pull/1) — merged into `main`.
- **PR I reviewed:** To be added by me — link to the actual pull request I review, including my inline review comments.

**Peer-review status:** The partner and reviewed-PR details are intentionally left as fill-in items until I complete the real collaboration. No classmate review is being claimed as completed yet.

## Further improvements

I would like to add more automated tests around browser storage and DOM interactions, improve keyboard accessibility, and explore how to organise a larger application into even smaller modules. For the Shopping Cart, a future improvement would be a checkout flow backed by a real server; the current cart is intentionally a frontend learning exercise.
