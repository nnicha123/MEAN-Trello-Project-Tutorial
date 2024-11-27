import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardsInterface } from '../../../shared/types/boards.interface';

@Component({
  selector: 'boards',
  templateUrl: './boards.component.html',
})
export class BoardsComponent implements OnInit {
  boards: BoardsInterface[] = [];
  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boardsService
      .getBoards()
      .subscribe((boards) => (this.boards = boards));
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
    });
  }
}
