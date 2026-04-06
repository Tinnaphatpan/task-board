/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.fs.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.profile.update': {
    methods: ["PUT"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
    }
  }
  'profile.profile.upload_avatar': {
    methods: ["POST"]
    pattern: '/api/v1/account/avatar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['uploadAvatar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['uploadAvatar']>>>
    }
  }
  'users.users.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
    }
  }
  'search.search.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
    }
  }
  'notifications.notifications.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['index']>>>
    }
  }
  'notifications.notifications.unread_count': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/notifications/unread-count'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['unreadCount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['unreadCount']>>>
    }
  }
  'notifications.notifications.mark_all_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/notifications/read-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markAllRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markAllRead']>>>
    }
  }
  'notifications.notifications.mark_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/notifications/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notifications_controller').default['markRead']>>>
    }
  }
  'boardTemplates.board_templates.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/board-templates'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board_templates_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board_templates_controller').default['index']>>>
    }
  }
  'boardTemplates.board_templates.apply': {
    methods: ["POST"]
    pattern: '/api/v1/board-templates/:key/apply'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { key: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board_templates_controller').default['apply']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board_templates_controller').default['apply']>>>
    }
  }
  'workspaces.workspaces.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/workspaces'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['index']>>>
    }
  }
  'workspaces.workspaces.store': {
    methods: ["POST"]
    pattern: '/api/v1/workspaces'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['store']>>>
    }
  }
  'workspaces.workspaces.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/workspaces/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['show']>>>
    }
  }
  'workspaces.workspaces.update': {
    methods: ["PUT"]
    pattern: '/api/v1/workspaces/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['update']>>>
    }
  }
  'workspaces.workspaces.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/workspaces/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workspaces_controller').default['destroy']>>>
    }
  }
  'boards.boards.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['index']>>>
    }
  }
  'boards.boards.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['store']>>>
    }
  }
  'boards.boards.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['show']>>>
    }
  }
  'boards.boards.update': {
    methods: ["PUT"]
    pattern: '/api/v1/boards/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['update']>>>
    }
  }
  'boards.boards.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/boards_controller').default['destroy']>>>
    }
  }
  'boards.activity_logs.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/:boardId/activity'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/activity_logs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/activity_logs_controller').default['index']>>>
    }
  }
  'boards.export.board_csv': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/:boardId/export/csv'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/export_controller').default['boardCsv']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/export_controller').default['boardCsv']>>>
    }
  }
  'boards.board_stats.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/:boardId/stats'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board_stats_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board_stats_controller').default['index']>>>
    }
  }
  'boards.labels.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/:boardId/labels'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['index']>>>
    }
  }
  'boards.labels.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/:boardId/labels'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['store']>>>
    }
  }
  'boards.labels.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/labels/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['destroy']>>>
    }
  }
  'boards.labels.task_labels': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/tasks/:taskId/labels'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['taskLabels']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['taskLabels']>>>
    }
  }
  'boards.labels.attach_to_task': {
    methods: ["POST"]
    pattern: '/api/v1/boards/tasks/:taskId/labels/:labelId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { taskId: ParamValue; labelId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['attachToTask']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['attachToTask']>>>
    }
  }
  'boards.labels.detach_from_task': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/tasks/:taskId/labels/:labelId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { taskId: ParamValue; labelId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['detachFromTask']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/labels_controller').default['detachFromTask']>>>
    }
  }
  'boards.board_members.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/:boardId/members'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['index']>>>
    }
  }
  'boards.board_members.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/:boardId/members'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['store']>>>
    }
  }
  'boards.board_members.update': {
    methods: ["PUT"]
    pattern: '/api/v1/boards/:boardId/members/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { boardId: ParamValue; userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['update']>>>
    }
  }
  'boards.board_members.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/:boardId/members/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { boardId: ParamValue; userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/board_members_controller').default['destroy']>>>
    }
  }
  'boards.columns.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/:boardId/columns'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['index']>>>
    }
  }
  'boards.columns.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/:boardId/columns'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { boardId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['store']>>>
    }
  }
  'boards.columns.update': {
    methods: ["PUT"]
    pattern: '/api/v1/boards/columns/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['update']>>>
    }
  }
  'boards.columns.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/columns/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/columns_controller').default['destroy']>>>
    }
  }
  'boards.tasks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/columns/:columnId/tasks'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { columnId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['index']>>>
    }
  }
  'boards.tasks.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/columns/:columnId/tasks'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { columnId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['store']>>>
    }
  }
  'boards.tasks.update': {
    methods: ["PUT"]
    pattern: '/api/v1/boards/tasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['update']>>>
    }
  }
  'boards.tasks.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/tasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['destroy']>>>
    }
  }
  'boards.comments.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/tasks/:taskId/comments'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['index']>>>
    }
  }
  'boards.comments.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/tasks/:taskId/comments'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['store']>>>
    }
  }
  'boards.comments.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/comments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['destroy']>>>
    }
  }
  'boards.subtasks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/tasks/:taskId/subtasks'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['index']>>>
    }
  }
  'boards.subtasks.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/tasks/:taskId/subtasks'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['store']>>>
    }
  }
  'boards.subtasks.toggle': {
    methods: ["PATCH"]
    pattern: '/api/v1/boards/subtasks/:id/toggle'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['toggle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['toggle']>>>
    }
  }
  'boards.subtasks.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/subtasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subtasks_controller').default['destroy']>>>
    }
  }
  'boards.task_attachments.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/tasks/:taskId/attachments'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_attachments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_attachments_controller').default['index']>>>
    }
  }
  'boards.task_attachments.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/tasks/:taskId/attachments'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_attachments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_attachments_controller').default['store']>>>
    }
  }
  'boards.task_attachments.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/attachments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_attachments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_attachments_controller').default['destroy']>>>
    }
  }
  'boards.task_dependencies.blocked_by': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/tasks/:taskId/dependencies'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['blockedBy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['blockedBy']>>>
    }
  }
  'boards.task_dependencies.blocking': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/boards/tasks/:taskId/blocking'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { taskId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['blocking']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['blocking']>>>
    }
  }
  'boards.task_dependencies.store': {
    methods: ["POST"]
    pattern: '/api/v1/boards/tasks/:taskId/dependencies/:dependsOnId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { taskId: ParamValue; dependsOnId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['store']>>>
    }
  }
  'boards.task_dependencies.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/boards/tasks/:taskId/dependencies/:dependsOnId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { taskId: ParamValue; dependsOnId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_dependencies_controller').default['destroy']>>>
    }
  }
}
