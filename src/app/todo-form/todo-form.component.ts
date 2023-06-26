import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Todo, TodoListService } from '../todo-list/todo-list.service';

interface SubTodo {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {
  @Input() refresh!: () => void;

  validateForm!: FormGroup;
  showSubTodos = false;

  get subTodosControls(): FormArray {
    return this.validateForm.get('subTodos') as FormArray;
  }

  addSubTodo(): void {
    this.subTodosControls.push(this.createSubTodoFormGroup());
  }

  removeSubTodo(index: number): void {
    this.subTodosControls.removeAt(index);
  }

  toggleSubTodos(): void {
    this.showSubTodos = !this.showSubTodos;
    if (!this.showSubTodos) {
      this.clearSubTodos();
    }
  }

  submitForm(value: { title: string }): void {
    if (this.validateForm.valid) {
      const todo: Todo = {
        title: value.title,
        subTodos: this.getSubTodos()
      };
      this.todoListService.create(todo).subscribe(() => {
        this.nzMessageService.info('Todo created');
        this.refresh();
        this.clearForm();
      });
    }
  }

  private createSubTodoFormGroup(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required]],
      completed: false
    });
  }

  private getSubTodos(): SubTodo[] {
    return this.subTodosControls.value.map((subTodo: { title: string, completed: boolean }) => ({
      title: subTodo.title,
      completed: subTodo.completed
    }));
  }

  private clearSubTodos(): void {
    this.subTodosControls.clear();
  }

  private clearForm(): void {
    this.validateForm.reset();
    this.clearSubTodos();
    this.showSubTodos = false;
  }

  constructor(
    private fb: FormBuilder,
    private todoListService: TodoListService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      subTodos: this.fb.array([])
    });
  }
}
