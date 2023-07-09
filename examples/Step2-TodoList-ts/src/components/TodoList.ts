import { Ui } from "sangyoon-ui"

import TodoItem from "./TodoItem"
import TodoModel from "../models/Todo"

interface TodoListProps {
  todos: TodoModel[]
  toggleTodo: (todoId: string) => void
  deleteTodo: (todoId: string) => void
}

const ACTION_TYPE = {
  TOGGLE: "TOGGLE",
  DELETE: "DELETE",
} as const

export default class TodoList extends Ui.Component<TodoListProps> {
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
    this.addEvent("click", ".todo-text", (e) => this.actionStrategy(e, ACTION_TYPE.TOGGLE))
    this.addEvent("click", ".todo-deleteBtn", (e) => this.actionStrategy(e, ACTION_TYPE.DELETE))
  }

  actionStrategy(e: Event, actionType: keyof typeof ACTION_TYPE) {
    if (!e.target) {
      return
    }
    const $li = (e.target as HTMLElement).closest("li")
    if (!$li) {
      return
    }
    const todoId = $li.id
    switch (actionType) {
      case ACTION_TYPE.TOGGLE: {
        this.handleToggle(todoId)
        return
      }
      case ACTION_TYPE.DELETE: {
        this.handleDelete(todoId)
        return
      }
      default: {
        return
      }
    }
  }

  handleToggle(todoId: string) {
    this.props.toggleTodo(todoId)
  }

  handleDelete(todoId: string) {
    this.props.deleteTodo(todoId)
  }
}
