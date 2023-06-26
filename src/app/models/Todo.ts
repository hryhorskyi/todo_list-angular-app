export class Todo {
  constructor(
    public id?: number,
    public title?: string,
    public completed?: boolean,
    public subTodos?: Todo[]
  ) {
    this.completed = false;
    this.subTodos = [];
  }
}
