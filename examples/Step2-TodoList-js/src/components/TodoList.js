import { Ui } from "sangyoon-ui"

import TodoItem from "./TodoItem.js"

export default class TodoList extends Ui.Component {
  template() {
    if (this.props.todos.length === 0) {
      return `
        <ul>todos is nothing.</ul>
      `
    }

    return `
      <ul>
        ${this.props.todos.map((todo) => TodoItem(todo)).join("")}
      </ul>
    `
  }

  setEvent() {
    this.addEvent("click", ".todo-text", (e) => this.actionStrategy(e, "toggle"))
    this.addEvent("click", ".todo-deleteBtn", (e) => this.actionStrategy(e, "delete"))
  }

  actionStrategy(e, actionType) {
    if (!e.target) {
      return
    }
    const $li = e.target.closest("li")
    if (!$li) {
      return
    }
    const todoId = $li.id
    switch (actionType) {
      case "toggle": {
        this.handleToggle(todoId)
        return
      }
      case "delete": {
        this.handleDelete(todoId)
        return
      }
      default: {
        return
      }
    }
  }

  handleToggle(todoId) {
    this.props.toggleTodo && this.props.toggleTodo(todoId)
  }

  handleDelete(todoId) {
    this.props.deleteTodo && this.props.deleteTodo(todoId)
  }
}
