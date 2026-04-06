import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'profile.profile.upload_avatar': { paramsTuple?: []; params?: {} }
    'users.users.index': { paramsTuple?: []; params?: {} }
    'search.search.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.unread_count': { paramsTuple?: []; params?: {} }
    'notifications.notifications.mark_all_read': { paramsTuple?: []; params?: {} }
    'notifications.notifications.mark_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workspaces.workspaces.index': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.store': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workspaces.workspaces.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workspaces.workspaces.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.index': { paramsTuple?: []; params?: {} }
    'boards.boards.store': { paramsTuple?: []; params?: {} }
    'boards.boards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.activity_logs.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.export.board_csv': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.board_stats.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.labels.task_labels': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.labels.attach_to_task': { paramsTuple: [ParamValue,ParamValue]; params: {'taskId': ParamValue,'labelId': ParamValue} }
    'boards.labels.detach_from_task': { paramsTuple: [ParamValue,ParamValue]; params: {'taskId': ParamValue,'labelId': ParamValue} }
    'boards.board_members.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.board_members.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.board_members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'boardId': ParamValue,'userId': ParamValue} }
    'boards.board_members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'boardId': ParamValue,'userId': ParamValue} }
    'boards.columns.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.columns.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.columns.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.columns.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.index': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
    'boards.tasks.store': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
    'boards.tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.comments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.comments.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.comments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.subtasks.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.subtasks.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.subtasks.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.subtasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.task_attachments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.task_attachments.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.task_attachments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'users.users.index': { paramsTuple?: []; params?: {} }
    'search.search.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.unread_count': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.index': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.index': { paramsTuple?: []; params?: {} }
    'boards.boards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.activity_logs.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.export.board_csv': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.board_stats.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.task_labels': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.board_members.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.columns.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.tasks.index': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
    'boards.comments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.subtasks.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.task_attachments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'users.users.index': { paramsTuple?: []; params?: {} }
    'search.search.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.unread_count': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.index': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.index': { paramsTuple?: []; params?: {} }
    'boards.boards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.activity_logs.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.export.board_csv': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.board_stats.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.task_labels': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.board_members.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.columns.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.tasks.index': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
    'boards.comments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.subtasks.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.task_attachments.index': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.upload_avatar': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.store': { paramsTuple?: []; params?: {} }
    'boards.boards.store': { paramsTuple?: []; params?: {} }
    'boards.labels.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.labels.attach_to_task': { paramsTuple: [ParamValue,ParamValue]; params: {'taskId': ParamValue,'labelId': ParamValue} }
    'boards.board_members.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.columns.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.tasks.store': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
    'boards.comments.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.subtasks.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
    'boards.task_attachments.store': { paramsTuple: [ParamValue]; params: {'taskId': ParamValue} }
  }
  PUT: {
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'workspaces.workspaces.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.board_members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'boardId': ParamValue,'userId': ParamValue} }
    'boards.columns.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'notifications.notifications.mark_all_read': { paramsTuple?: []; params?: {} }
    'notifications.notifications.mark_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.subtasks.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'workspaces.workspaces.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.labels.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.labels.detach_from_task': { paramsTuple: [ParamValue,ParamValue]; params: {'taskId': ParamValue,'labelId': ParamValue} }
    'boards.board_members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'boardId': ParamValue,'userId': ParamValue} }
    'boards.columns.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.comments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.subtasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.task_attachments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}