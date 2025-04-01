// Get references to DOM elements
export const dom = {
  tasksList: document.querySelector("#tasks_list"),
  taskTemplate: document.querySelector("#task_template"),
  doneCount: document.querySelector("#done_count"),
  totalCount: document.querySelector("#total_count"),
};

// Initialize data. Do we have anything stored?
if (localStorage.tasks) {
  let tasks = JSON.parse(localStorage.tasks);
  for (let task of tasks) {
    addItem(task);
  }
} else {
  // Add one empty task to start with
  addItem();
}

dom.tasksList.addEventListener("keydown", (e) => {
  if (!e.target.matches("input.title")) {
    // We are only interested in key events on the text field
    return;
  }

  let li = e.target.closest("li");

  // STEP 3: Use event delegation to use arrow keys to move between tasks
  if (e.key === "ArrowUp") {
    const previousTask = li.previousElementSibling;
    if (previousTask) {
      focusTask(previousTask);
    }
  } else if (e.key === "ArrowDown") {
    const nextTask = li.nextElementSibling;
    if (nextTask) {
      focusTask(nextTask);
    }
  }

  if (e.key === "Enter" && !e.repeat) {
    addItem();
  } else if (
    e.key === "Backspace" &&
    e.target.value.length === 0 &&
    !e.repeat
  ) {
    const previousSibling = li.previousElementSibling;
    li.querySelector(".delete").click();
    focusTask(previousSibling ?? dom.tasksList.firstElementChild);
    e.preventDefault(); // prevent data corruption
  }
});

// STEP 1: Use event delegation to listen for changes on all checkboxes
dom.tasksList.addEventListener("change", (e) => {
  if (e.target.matches(".done")) {
    updateCounts();
  }
});

// STEP 2: Use event delegation to implement the delete button
dom.tasksList.addEventListener("click", (e) => {
  // check if the clicked element is a .delete button
  if (e.target.matches(".delete")) {
    const li = e.target.closest("li");

    // determine the next element to focus on
    const previousSibling = li.previousElementSibling;
    const nextSibling = li.nextElementSibling;
    const focus = previousSibling ?? nextSibling;

    // remove the task
    li.remove();

    // update counts
    updateCounts();

    // focus on the determined target
    focusTask(focus);
  }
});

// Store data when page is closed
globalThis.addEventListener("beforeunload", () => {
  localStorage.tasks = JSON.stringify(getData());
});

/**
 * Add a new item at the end of the todo list
 * @param {Object} data data for the item to be added
 */
export function addItem(data = { done: false, title: "" }) {
  dom.tasksList.insertAdjacentHTML("beforeend", dom.taskTemplate.innerHTML);

  let element = dom.tasksList.lastElementChild;

  element.querySelector(".title").value = data.title;

  let done = element.querySelector(".done");
  done.checked = data.done;

  updateCounts();
  focusTask(element);
}

// STEP 4: Implement the "Clear completed" functionality
document
  .querySelector("#clear_completed")
  .addEventListener("click", clearCompleted);

/**
 * Delete all tasks that are marked as done
 */
export function clearCompleted() {
  // TODO implement this (see step 4)
  const completedTasks = dom.tasksList.querySelectorAll(".done:checked");

  // loop through all completed tasks and simulate a click on their delete button
  for (const task of completedTasks) {
    const li = task.closest("li");
    const deleteButton = li.querySelector(".delete");
    if (deleteButton) deleteButton.click();
  }
}

/**
 * Focus the title field of the specified task
 * @param {Node} element Reference to DOM element of the task to focus (or any of its descendants)
 */
export function focusTask(element) {
  element?.closest("li")?.querySelector("input.title").focus();
}

export function getData() {
  return Array.from(dom.tasksList.children).map((element) => ({
    title: element.querySelector(".title").value,
    done: element.querySelector(".done").checked,
  }));
}

function updateDoneCount() {
  dom.doneCount.textContent =
    dom.tasksList.querySelectorAll(".done:checked").length;
}

function updateTotalCount() {
  dom.totalCount.textContent = dom.tasksList.children.length;
}

// Update expressions etc when data changes
function updateCounts() {
  updateDoneCount();
  updateTotalCount();
}
