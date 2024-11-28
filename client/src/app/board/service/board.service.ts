import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardsInterface } from '../../shared/types/boards.interface';
import { SocketService } from '../../shared/services/socket.service';
import { SocketEventsEnum } from '../../shared/types/socketEvents.enum';
import { ColumnInterface } from '../../shared/types/column.interface';
import { TaskInterface } from '../../shared/types/tasks.interface';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardsInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardsInterface): void {
    this.board$.next(board);
  }

  setColumns(columns: ColumnInterface[]): void {
    this.columns$.next(columns);
  }

  setTasks(tasks: TaskInterface[]): void {
    this.tasks$.next(tasks);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }

  addColumn(column: ColumnInterface): void {
    const updatedColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updatedColumns);
  }

  addTask(task: TaskInterface): void {
    const updatedTasks = [...this.tasks$.getValue(), task];
    this.tasks$.next(updatedTasks);
  }

  updateBoard(updatedBoard: BoardsInterface): void {
    const board = this.board$.getValue();
    if (!board) {
      throw new Error('Board is not initialised');
    }
    this.board$.next({ ...board, title: updatedBoard.title });
  }

  deleteColumn(columnId: string): void {
    const updatedColumns = this.columns$
      .getValue()
      .filter((column) => column.id !== columnId);
    this.columns$.next(updatedColumns);
  }
}
