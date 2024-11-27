import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardsInterface } from '../../shared/types/boards.interface';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardsInterface | null>(null);

  setBoard(board: BoardsInterface): void {
    this.board$.next(board);
  }
}
