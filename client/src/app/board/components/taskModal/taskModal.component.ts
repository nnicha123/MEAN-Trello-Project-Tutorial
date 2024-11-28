import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'task-modal',
  templateUrl: './taskModal.component.html',
})
export class TaskModalComponent {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!boardId) {
      throw new Error('Cannot get boardId from url');
    }
    if (!taskId) {
      throw new Error('Cannot get taskId from url');
    }
    this.boardId = boardId;
    this.taskId = taskId;
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }
}
