const todoSubmit = document.querySelector('.todos__submit')
const todoList = document.querySelector('.todos__list')

/**
 * Setting up our local storage. If there's already todo items stored, we
 * display those. Otherwise, we create our initial todos array and holder for
 * generating a uniqueId.
 *
 * For this demo, the unique ID is simply incrementing as each list item is
 * created. Nothing too fancy here.
 *
 * The todos list is an array of objects with the following structure:
 * { id: uniqueId, task: "example task text", completed: false }
 */
if (!localStorage.getItem('todos')) {
  window.localStorage.setItem('uniqueId', 0)
  window.localStorage.setItem('todos', JSON.stringify([]))
} else {
  const todos = JSON.parse(window.localStorage.getItem('todos'))
  todos.forEach(todo => displayExistingListItem(todo))
}

/**
 * Register task input field event. We're listening for
 * the enter key to be pressed.
 */
todoSubmit.addEventListener('keydown', (e) => {
  if (e.keyCode == 13 && e.target.value) {
    addNewListItem(e.target.value)
    todoSubmit.value = ''
  }
})

/**
 * When we create a list item, we're creating two dom elements; a `li`
 * and a `span`. The span will wrap the todo text so that we can apply a
 * conditional class `strike` that will toggle the visual strikethrough
 * when todo items are marked as complete.
 *
 * @param {Object} item Ex. {id: 2, task: "Another one", completed: true}
 */
function createListItem(item){
  const li = document.createElement('li')
  li.classList.add('todos__list-item')
  li.setAttribute('data-id', item.id)

  const span = document.createElement('span')
  span.appendChild(document.createTextNode(item.task))
  span.setAttribute('id', `todo-${item.id}`)

  if (item.completed) {
    span.classList.add('strike')
  }

  li.appendChild(span)

  return li
}

/**
 * We call this function when the browser is refreshed or loaded
 * so that we can display a todo items from localStorage.
 *
 * @param {Object} item Ex. {id: 2, task: "Another one", completed: true}
 */
function displayExistingListItem(item){
  const li = createListItem(item)
  todoList.appendChild(li)

  addToggleButton(item.id, item.completed)
  addDeleteButton(li, item.id)
}

/**
 * Grabs the next "unique id" for the new todo item, creates the list item,
 * and add it to our view and localStorage.
 *
 * @param {String} value The todo string entered by the user.
 */
function addNewListItem(value) {
  const uniqueId = Number(window.localStorage.getItem('uniqueId'))
  const li = createListItem({id: uniqueId, task: value})

  todoList.appendChild(li)

  addToggleButton(uniqueId)
  addDeleteButton(li, uniqueId)
  addToStore(value)
}

/**
 * Adds a toggle button to the todo item so that we can mark it as
 * complete or not.
 *
 * @param {number} id           - The id of the todo list item.
 * @param {boolean} completed   - If the item is already completed or not.
 */
function addToggleButton(id, completed = false){
  const toggle = document.createElement('input')
  toggle.setAttribute('type', 'checkbox')

  const listItem = document.querySelector(`li[data-id="${id}"]`)
  listItem.insertBefore(toggle, listItem.firstChild)

  if (completed) { toggle.setAttribute('checked', '') }

  toggle.addEventListener('click', (e) => { toggleEventHandler(e, id) })
}

/**
 * When an todo item is toggled as complete or not complete, we update
 * localStorage with its new state. In the view, we add a class to the item
 * to display it with a strikethrough or not.
 *
 * @param {Object} e    - The dom object passed through from the toggle event.
 * @param {Number} id   - The id of the todo item that was toggled.
 */
function toggleEventHandler(e, id) {
  const todos = JSON.parse(window.localStorage.getItem('todos'))

  const updatedTodos = todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed
    }
    return todo
  })

  window.localStorage.setItem('todos', JSON.stringify(updatedTodos))

  const isChecked = e.target.hasAttribute('checked')
  const todoText = document.getElementById(`todo-${id}`)

  if (isChecked) {
    e.target.removeAttribute('checked')
    todoText.classList.remove('strike')
  } else {
    e.target.setAttribute('checked', '')
    todoText.classList.add('strike')
  }
}

/**
 * When we add a new todo text, we also need to append a delete button.
 * This function is used for both newly created todo items and for those
 * we pull into the view from localStorage.
 *
 * @param {Object} el  - The todo item we need to add a delete button to.
 * @param {Number} id  - The id of the todo item.
 */
function addDeleteButton(el, id){
  const button = document.createElement('button')
  const text = document.createTextNode('Delete')

  button.appendChild(text)
  el.appendChild(button)
  button.addEventListener('click', () => { removeElement(id) })
}

/**
 * Updating the view as well as the localStorage with a new
 * todo task.
 *
 * @param {String} task - The todo task string value.
 */
function addToStore(task){
  const uniqueId = Number(window.localStorage.getItem('uniqueId'))
  const newTodoItem = {id: uniqueId, task, completed: false}
  const todos = JSON.parse(window.localStorage.getItem('todos'))

  todos.push(newTodoItem)

  window.localStorage.setItem('todos', JSON.stringify(todos))
  incrementUniqueId()
}

/**
 * A helper function that increments the "uniqueId" value in localStorage.
 * We call this every time a new todo item is created. The value it generates
 * and stored will be the id for the next todo item.
 */
function incrementUniqueId() {
  let uniqueId = Number(window.localStorage.getItem('uniqueId')) + 1
  window.localStorage.setItem('uniqueId', uniqueId)
}

/**
 * Removes the todo item from localStroage as well as from the view.
 *
 * @param {Number} id  - The id of the todo item.
 */
function removeElement(id) {
  const todos = JSON.parse(window.localStorage.getItem('todos'))
  const updatedTodos = todos.filter(todo => todo.id !== id)
  window.localStorage.setItem('todos', JSON.stringify(updatedTodos))

  let elem = document.querySelector(`li[data-id="${id}"]`)
  return elem.parentNode.removeChild(elem);
}
