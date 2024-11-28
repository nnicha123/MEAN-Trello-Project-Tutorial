import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskInterface } from '../types/tasks.interface';
import { environment } from '../../../environment/environment';
import { SocketService } from './socket.service';

@Injectable()
export class TasksService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getTasks(boardId: string): Observable<TaskInterface[]> {
    const url = environment.apiUrl + '/boards/' + boardId + '/tasks';
    return this.http.get<TaskInterface[]>(url);
  }

  //   createTask(taskInput:TaskInputInterface):void{
  //     this.
  //   }
}
