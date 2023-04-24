export default function TodoItem(todo) {
  return `
    <li id="${todo.id}">
      <span class="todo-text" style="${
        todo.isCompleted ? "text-decoration:line-through" : ""
      }">${todo.text}</span>
      <button class="todo-deleteBtn">del</button>    
    </li>
  `
}
