import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardsInterface } from '../types/boards.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable()
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<BoardsInterface[]> {
    const url = environment.apiUrl + '/boards';
    return this.http.get<BoardsInterface[]>(url);
  }

  getBoard(boardId: string): Observable<BoardsInterface> {
    const url = environment.apiUrl + '/boards/' + boardId;
    return this.http.get<BoardsInterface>(url);
  }

  createBoard(title: string): Observable<BoardsInterface> {
    const url = environment.apiUrl + '/boards';
    return this.http.post<BoardsInterface>(url, { title });
  }
}
