import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'boards.boards.index': { paramsTuple?: []; params?: {} }
    'boards.boards.store': { paramsTuple?: []; params?: {} }
    'boards.boards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.boards.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.columns.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.columns.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.columns.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.columns.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.index': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
    'boards.tasks.store': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
    'boards.tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'boards.boards.index': { paramsTuple?: []; params?: {} }
    'boards.boards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.columns.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.tasks.index': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'boards.boards.index': { paramsTuple?: []; params?: {} }
    'boards.boards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.columns.index': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.tasks.index': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'boards.boards.store': { paramsTuple?: []; params?: {} }
    'boards.columns.store': { paramsTuple: [ParamValue]; params: {'boardId': ParamValue} }
    'boards.tasks.store': { paramsTuple: [ParamValue]; params: {'columnId': ParamValue} }
  }
  PUT: {
    'boards.boards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.columns.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'boards.boards.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.columns.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'boards.tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}