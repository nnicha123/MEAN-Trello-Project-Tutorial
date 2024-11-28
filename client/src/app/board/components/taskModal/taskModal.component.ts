import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../service/board.service';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { TaskInterface } from '../../../shared/types/tasks.interface';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { FormBuilder } from '@angular/forms';
import { TasksService } from '../../../shared/services/tasks.service';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEventsEnum } from '../../../shared/types/socketEvents.enum';

@Component({
  selector: 'task-modal',
  templateUrl: './taskModal.component.html',
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{ task: TaskInterface; columns: ColumnInterface[] }>;
  unsubscribe$ = new Subject<void>();

  columnForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private socketService: SocketService
  ) {
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!boardId) {
      throw new Error('Cannot get boardId from url');
    }
    if (!taskId) {
      throw new Error('Cannot get taskId from url');
    }
    this.boardId = boardId;
    this.taskId = taskId;
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => tasks.find((task) => task.id === this.taskId)),
      filter(Boolean)
    );
    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({ task, columns }))
    );

    this.columnForm = this.fb.group({
      columnId: [''],
    });

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId !== columnId && columnId) {
          this.tasksService.updateTask(this.boardId, task.id, { columnId });
        }
      });

    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.goToBoard());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }
  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });
  }
  updateTaskDescription(taskDescription: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: taskDescription,
    });
  }

  deleteTask(): void {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }
}
