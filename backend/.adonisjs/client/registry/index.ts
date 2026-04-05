/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
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
