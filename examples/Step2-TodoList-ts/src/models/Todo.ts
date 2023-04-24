import { v4 } from "uuid"

type TodoModelProps = {
  id?: string
  text: string
  isCompleted?: boolean
}

export default class TodoModel {
  id: string
  text: string
  isCompleted: boolean

  constructor({ id = v4(), text, isCompleted = false }: TodoModelProps) {
    this.id = id
    this.text = text
    this.isCompleted = isCompleted
  }
}
