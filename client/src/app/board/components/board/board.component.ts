import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardService } from '../../service/board.service';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { BoardsInterface } from '../../../shared/types/boards.interface';
import { ColumnsService } from '../../../shared/services/columns.service';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { ColumnInputInterface } from '../../../shared/types/columnInput.interface';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEventsEnum } from '../../../shared/types/socketEvents.enum';
import { TaskInterface } from '../../../shared/types/tasks.interface';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskInputInterface } from '../../../shared/types/taskInput.interface';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  data$: Observable<{
    board: BoardsInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;
  // Behavioural subject always has initial value but not subject
  unsubscribe$ = new Subject<void>();

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private router: Router,
    private columnsService: ColumnsService,
    private socketService: SocketService,
    private tasksService: TasksService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }
    this.boardId = boardId;
    this.data$ = combineLatest([
      // Filter out null from boards
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      map(([board, columns, tasks]) => ({
        board,
        columns,
        tasks,
      }))
    );
  }

  ngOnInit(): void {
    this.columnsService.joinBoard(this.boardId);
    this.fetchData();
    this.initializeListeners();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchData(): void {
    this.boardsService
      .getBoard(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((board) => {
        this.boardService.setBoard(board);
      });
    this.columnsService
      .getColumns(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columns) => this.boardService.setColumns(columns));

    this.tasksService
      .getTasks(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tasks) => this.boardService.setTasks(tasks));
  }

  initializeListeners(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
      if (event instanceof NavigationStart && !event.url.includes('/boards/')) {
        console.log('leaving a page');
        this.boardService.leaveBoard(this.boardId);
      }
    });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => this.boardService.addTask(task));

    this.socketService
      .listen<BoardsInterface>(SocketEventsEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((board) => this.boardService.updateBoard(board));

    this.socketService
      .listen<void>(SocketEventsEnum.boardDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigateByUrl('/boards'));

    this.socketService
      .listen<string>(SocketEventsEnum.columnDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedColumn) => {
        this.boardService.updateColumn(updatedColumn);
      });

    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedTask) => this.boardService.updateTask(updatedTask));
  }

  createColumn(title: string): void {
    console.log('createColumn', title);
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };
    this.columnsService.createColumn(columnInput);
  }

  createTask(title: string, columnId: string): void {
    const taskInput: TaskInputInterface = {
      title,
      columnId,
      boardId: this.boardId,
    };
    this.tasksService.createTask(taskInput);
  }

  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }

  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }

  deleteBoard(): void {
    if (confirm('Are you sure you want to delete the board?')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }

  deleteColumn(columnId: string): void {
    this.columnsService.deleteColumn(this.boardId, columnId);
  }

  updateColumnName(columnName: string, columnId: string): void {
    this.columnsService.updateColumn(this.boardId, columnId, {
      title: columnName,
    });
  }

  openTask(taskId: string): void {
    this.router.navigate(['boards', this.boardId, 'tasks', taskId]);
  }
}
