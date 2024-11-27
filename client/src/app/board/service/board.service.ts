import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardsInterface } from '../../shared/types/boards.interface';
import { SocketService } from '../../shared/services/socket.service';
import { SocketEventsEnum } from '../../shared/types/socketEvents.enum';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardsInterface | null>(null);

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardsInterface): void {
    this.board$.next(board);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }
}
