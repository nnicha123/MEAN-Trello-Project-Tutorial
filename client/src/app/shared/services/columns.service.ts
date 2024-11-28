import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnInterface } from '../types/column.interface';
import { environment } from '../../../environment/environment';
import { ColumnInputInterface } from '../types/columnInput.interface';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvents.enum';

@Injectable()
export class ColumnsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  joinBoard(boardId: string): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, { boardId });
  }

  getColumns(boardId: string): Observable<ColumnInterface[]> {
    const url = environment.apiUrl + '/boards/' + boardId + '/columns';
    return this.http.get<ColumnInterface[]>(url);
  }

  createColumn(columnInput: ColumnInputInterface): void {
    this.socketService.emit(SocketEventsEnum.columnsCreate, columnInput);
  }

  deleteColumn(boardId: string, columnId: string): void {
    this.socketService.emit(SocketEventsEnum.columnDelete, {
      boardId,
      columnId,
    });
  }

  updateColumn(
    boardId: string,
    columnId: string,
    fields: { title: string }
  ): void {
    this.socketService.emit(SocketEventsEnum.columnUpdate, {
      boardId,
      columnId,
      fields,
    });
  }
}
