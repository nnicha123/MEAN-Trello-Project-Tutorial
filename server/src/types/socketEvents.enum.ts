export enum SocketEventsEnum {
  boardsJoin = "boards:join",
  boardsLeave = "boards:leave",
  boardsUpdate = "boards:update",
  boardsUpdateSuccess = "boards:updateSuccess",
  boardsUpdateFailure = "boards:updateFailure",
  boardDelete = "board:delete",
  boardDeleteSuccess = "board:deleteSuccess",
  boardDeleteFailure = "board:deleteFailure",
  columnsCreate = "columns:create",
  columnsCreateSuccess = "columns:createSuccess",
  columnsCreateFailure = "columns:createFailure",
  columnDelete = "column:delete",
  columnDeleteSuccess = "column:deleteSuccess",
  columnDeleteFailure = "column:deleteFailure",
  columnUpdate = "column:update",
  columnUpdateSuccess = "column:updateSuccess",
  columnUpdateFailure = "column:updateFailure",
  tasksCreate = "tasks:create",
  tasksCreateSuccess = "tasks:createSuccess",
  tasksCreateFailure = "tasks:createFailure",
}
