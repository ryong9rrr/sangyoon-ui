import { v4 } from "uuid"

export default class TodoModel {
  constructor({ id = v4(), text, isCompleted = false }) {
    this.id = id
    this.text = text
    this.isCompleted = isCompleted
  }
}
