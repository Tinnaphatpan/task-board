/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.profile.update': {
    methods: ["PUT"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.update']['types'],
  },
  'profile.profile.upload_avatar': {
    methods: ["POST"],
    pattern: '/api/v1/account/avatar',
    tokens: [{"old":"/api/v1/account/avatar","type":0,"val":"api","end":""},{"old":"/api/v1/account/avatar","type":0,"val":"v1","end":""},{"old":"/api/v1/account/avatar","type":0,"val":"account","end":""},{"old":"/api/v1/account/avatar","type":0,"val":"avatar","end":""}],
    types: placeholder as Registry['profile.profile.upload_avatar']['types'],
  },
  'users.users.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.users.index']['types'],
  },
  'workspaces.workspaces.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/workspaces',
    tokens: [{"old":"/api/v1/workspaces","type":0,"val":"api","end":""},{"old":"/api/v1/workspaces","type":0,"val":"v1","end":""},{"old":"/api/v1/workspaces","type":0,"val":"workspaces","end":""}],
    types: placeholder as Registry['workspaces.workspaces.index']['types'],
  },
  'workspaces.workspaces.store': {
    methods: ["POST"],
    pattern: '/api/v1/workspaces',
    tokens: [{"old":"/api/v1/workspaces","type":0,"val":"api","end":""},{"old":"/api/v1/workspaces","type":0,"val":"v1","end":""},{"old":"/api/v1/workspaces","type":0,"val":"workspaces","end":""}],
    types: placeholder as Registry['workspaces.workspaces.store']['types'],
  },
  'workspaces.workspaces.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/workspaces/:id',
    tokens: [{"old":"/api/v1/workspaces/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workspaces/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workspaces/:id","type":0,"val":"workspaces","end":""},{"old":"/api/v1/workspaces/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workspaces.workspaces.show']['types'],
  },
  'workspaces.workspaces.update': {
    methods: ["PUT"],
    pattern: '/api/v1/workspaces/:id',
    tokens: [{"old":"/api/v1/workspaces/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workspaces/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workspaces/:id","type":0,"val":"workspaces","end":""},{"old":"/api/v1/workspaces/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workspaces.workspaces.update']['types'],
  },
  'workspaces.workspaces.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/workspaces/:id',
    tokens: [{"old":"/api/v1/workspaces/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workspaces/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workspaces/:id","type":0,"val":"workspaces","end":""},{"old":"/api/v1/workspaces/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workspaces.workspaces.destroy']['types'],
  },
  'boards.boards.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards',
    tokens: [{"old":"/api/v1/boards","type":0,"val":"api","end":""},{"old":"/api/v1/boards","type":0,"val":"v1","end":""},{"old":"/api/v1/boards","type":0,"val":"boards","end":""}],
    types: placeholder as Registry['boards.boards.index']['types'],
  },
  'boards.boards.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards',
    tokens: [{"old":"/api/v1/boards","type":0,"val":"api","end":""},{"old":"/api/v1/boards","type":0,"val":"v1","end":""},{"old":"/api/v1/boards","type":0,"val":"boards","end":""}],
    types: placeholder as Registry['boards.boards.store']['types'],
  },
  'boards.boards.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/:id',
    tokens: [{"old":"/api/v1/boards/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.boards.show']['types'],
  },
  'boards.boards.update': {
    methods: ["PUT"],
    pattern: '/api/v1/boards/:id',
    tokens: [{"old":"/api/v1/boards/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.boards.update']['types'],
  },
  'boards.boards.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/:id',
    tokens: [{"old":"/api/v1/boards/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.boards.destroy']['types'],
  },
  'boards.activity_logs.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/:boardId/activity',
    tokens: [{"old":"/api/v1/boards/:boardId/activity","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/activity","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/activity","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/activity","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/activity","type":0,"val":"activity","end":""}],
    types: placeholder as Registry['boards.activity_logs.index']['types'],
  },
  'boards.board_stats.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/:boardId/stats',
    tokens: [{"old":"/api/v1/boards/:boardId/stats","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/stats","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/stats","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/stats","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/stats","type":0,"val":"stats","end":""}],
    types: placeholder as Registry['boards.board_stats.index']['types'],
  },
  'boards.labels.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/:boardId/labels',
    tokens: [{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/labels","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"labels","end":""}],
    types: placeholder as Registry['boards.labels.index']['types'],
  },
  'boards.labels.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards/:boardId/labels',
    tokens: [{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/labels","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/labels","type":0,"val":"labels","end":""}],
    types: placeholder as Registry['boards.labels.store']['types'],
  },
  'boards.labels.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/labels/:id',
    tokens: [{"old":"/api/v1/boards/labels/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/labels/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/labels/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/labels/:id","type":0,"val":"labels","end":""},{"old":"/api/v1/boards/labels/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.labels.destroy']['types'],
  },
  'boards.labels.task_labels': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/tasks/:taskId/labels',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/labels","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels","type":0,"val":"labels","end":""}],
    types: placeholder as Registry['boards.labels.task_labels']['types'],
  },
  'boards.labels.attach_to_task': {
    methods: ["POST"],
    pattern: '/api/v1/boards/tasks/:taskId/labels/:labelId',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"labels","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":1,"val":"labelId","end":""}],
    types: placeholder as Registry['boards.labels.attach_to_task']['types'],
  },
  'boards.labels.detach_from_task': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/tasks/:taskId/labels/:labelId',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":0,"val":"labels","end":""},{"old":"/api/v1/boards/tasks/:taskId/labels/:labelId","type":1,"val":"labelId","end":""}],
    types: placeholder as Registry['boards.labels.detach_from_task']['types'],
  },
  'boards.board_members.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/:boardId/members',
    tokens: [{"old":"/api/v1/boards/:boardId/members","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/members","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/members","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/members","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['boards.board_members.index']['types'],
  },
  'boards.board_members.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards/:boardId/members',
    tokens: [{"old":"/api/v1/boards/:boardId/members","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/members","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/members","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/members","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['boards.board_members.store']['types'],
  },
  'boards.board_members.update': {
    methods: ["PUT"],
    pattern: '/api/v1/boards/:boardId/members/:userId',
    tokens: [{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"members","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['boards.board_members.update']['types'],
  },
  'boards.board_members.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/:boardId/members/:userId',
    tokens: [{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":0,"val":"members","end":""},{"old":"/api/v1/boards/:boardId/members/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['boards.board_members.destroy']['types'],
  },
  'boards.columns.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/:boardId/columns',
    tokens: [{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/columns","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"columns","end":""}],
    types: placeholder as Registry['boards.columns.index']['types'],
  },
  'boards.columns.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards/:boardId/columns',
    tokens: [{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"api","end":""},{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/:boardId/columns","type":1,"val":"boardId","end":""},{"old":"/api/v1/boards/:boardId/columns","type":0,"val":"columns","end":""}],
    types: placeholder as Registry['boards.columns.store']['types'],
  },
  'boards.columns.update': {
    methods: ["PUT"],
    pattern: '/api/v1/boards/columns/:id',
    tokens: [{"old":"/api/v1/boards/columns/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/columns/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/columns/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/columns/:id","type":0,"val":"columns","end":""},{"old":"/api/v1/boards/columns/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.columns.update']['types'],
  },
  'boards.columns.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/columns/:id',
    tokens: [{"old":"/api/v1/boards/columns/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/columns/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/columns/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/columns/:id","type":0,"val":"columns","end":""},{"old":"/api/v1/boards/columns/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.columns.destroy']['types'],
  },
  'boards.tasks.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/columns/:columnId/tasks',
    tokens: [{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"columns","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":1,"val":"columnId","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['boards.tasks.index']['types'],
  },
  'boards.tasks.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards/columns/:columnId/tasks',
    tokens: [{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"columns","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":1,"val":"columnId","end":""},{"old":"/api/v1/boards/columns/:columnId/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['boards.tasks.store']['types'],
  },
  'boards.tasks.update': {
    methods: ["PUT"],
    pattern: '/api/v1/boards/tasks/:id',
    tokens: [{"old":"/api/v1/boards/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.tasks.update']['types'],
  },
  'boards.tasks.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/tasks/:id',
    tokens: [{"old":"/api/v1/boards/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.tasks.destroy']['types'],
  },
  'boards.comments.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/tasks/:taskId/comments',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"comments","end":""}],
    types: placeholder as Registry['boards.comments.index']['types'],
  },
  'boards.comments.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards/tasks/:taskId/comments',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/comments","type":0,"val":"comments","end":""}],
    types: placeholder as Registry['boards.comments.store']['types'],
  },
  'boards.comments.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/comments/:id',
    tokens: [{"old":"/api/v1/boards/comments/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/comments/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/comments/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/comments/:id","type":0,"val":"comments","end":""},{"old":"/api/v1/boards/comments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.comments.destroy']['types'],
  },
  'boards.subtasks.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/tasks/:taskId/subtasks',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"subtasks","end":""}],
    types: placeholder as Registry['boards.subtasks.index']['types'],
  },
  'boards.subtasks.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards/tasks/:taskId/subtasks',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/subtasks","type":0,"val":"subtasks","end":""}],
    types: placeholder as Registry['boards.subtasks.store']['types'],
  },
  'boards.subtasks.toggle': {
    methods: ["PATCH"],
    pattern: '/api/v1/boards/subtasks/:id/toggle',
    tokens: [{"old":"/api/v1/boards/subtasks/:id/toggle","type":0,"val":"api","end":""},{"old":"/api/v1/boards/subtasks/:id/toggle","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/subtasks/:id/toggle","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/subtasks/:id/toggle","type":0,"val":"subtasks","end":""},{"old":"/api/v1/boards/subtasks/:id/toggle","type":1,"val":"id","end":""},{"old":"/api/v1/boards/subtasks/:id/toggle","type":0,"val":"toggle","end":""}],
    types: placeholder as Registry['boards.subtasks.toggle']['types'],
  },
  'boards.subtasks.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/subtasks/:id',
    tokens: [{"old":"/api/v1/boards/subtasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/subtasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/subtasks/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/subtasks/:id","type":0,"val":"subtasks","end":""},{"old":"/api/v1/boards/subtasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.subtasks.destroy']['types'],
  },
  'boards.task_attachments.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/boards/tasks/:taskId/attachments',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"attachments","end":""}],
    types: placeholder as Registry['boards.task_attachments.index']['types'],
  },
  'boards.task_attachments.store': {
    methods: ["POST"],
    pattern: '/api/v1/boards/tasks/:taskId/attachments',
    tokens: [{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"api","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"tasks","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":1,"val":"taskId","end":""},{"old":"/api/v1/boards/tasks/:taskId/attachments","type":0,"val":"attachments","end":""}],
    types: placeholder as Registry['boards.task_attachments.store']['types'],
  },
  'boards.task_attachments.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/boards/attachments/:id',
    tokens: [{"old":"/api/v1/boards/attachments/:id","type":0,"val":"api","end":""},{"old":"/api/v1/boards/attachments/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/boards/attachments/:id","type":0,"val":"boards","end":""},{"old":"/api/v1/boards/attachments/:id","type":0,"val":"attachments","end":""},{"old":"/api/v1/boards/attachments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['boards.task_attachments.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
