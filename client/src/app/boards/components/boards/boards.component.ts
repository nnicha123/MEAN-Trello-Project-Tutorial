import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardsInterface } from '../../../shared/types/boards.interface';
import { SocketService } from '../../../shared/services/socket.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'boards',
  templateUrl: './boards.component.html',
})
export class BoardsComponent implements OnInit, OnDestroy {
  boards: BoardsInterface[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boardsService
      .getBoards()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((boards) => (this.boards = boards));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createBoard(title: string): void {
    this.boardsService
      .createBoard(title)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((createdBoard) => {
        this.boards = [...this.boards, createdBoard];
      });
  }
}
