import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../service/board.service';
import { filter, Observable } from 'rxjs';
import { BoardsInterface } from '../../../shared/types/boards.interface';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<BoardsInterface>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }
    this.boardId = boardId;
    // Filter out null
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });
  }
}
