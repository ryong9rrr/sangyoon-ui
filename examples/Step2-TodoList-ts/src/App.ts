import { ui } from "sangyoon-ui"

import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import TodoModel from "./models/Todo"

interface AppState {
  todos: TodoModel[]
}

export default class App extends ui.Component<{}, AppState> {
  initState() {
    return {
      todos: [],
    }
  }

  template() {
    return `
      <main>
        <h1>TodoList</h1>
        <div id="TodoForm"></div>
        <div id="TodoList"></div>
      </main>
    `
  }

  setChildren() {
    this.addComponent(TodoForm, "#TodoForm", {
      addTodo: this.addTodo.bind(this),
    })

    this.addComponent(TodoList, "#TodoList", {
      todos: this.state.todos,
      toggleTodo: this.toggleTodo.bind(this),
      deleteTodo: this.deleteTodo.bind(this),
    })
  }

  addTodo(text: string) {
    const nextTodos = [...this.state.todos, new TodoModel({ text })]
    this.setState({
      todos: nextTodos,
    })
  }

  toggleTodo(todoId: string) {
    const nextTodos = this.state.todos.map(({ ...todo }) => {
      if (todo.id === todoId) {
        return new TodoModel({ ...todo, isCompleted: !todo.isCompleted })
      }
      return new TodoModel({ ...todo })
    })
    this.setState({ todos: nextTodos })
  }

  deleteTodo(todoId: string) {
    const nextTodos = this.state.todos.filter(
      ({ ...todo }) => todo.id !== todoId,
    )
    this.setState({ todos: nextTodos })
  }
}
