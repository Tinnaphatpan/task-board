/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
  }
  boards: {
    boards: {
      index: typeof routes['boards.boards.index']
      store: typeof routes['boards.boards.store']
      show: typeof routes['boards.boards.show']
      update: typeof routes['boards.boards.update']
      destroy: typeof routes['boards.boards.destroy']
    }
    columns: {
      index: typeof routes['boards.columns.index']
      store: typeof routes['boards.columns.store']
      update: typeof routes['boards.columns.update']
      destroy: typeof routes['boards.columns.destroy']
    }
    tasks: {
      index: typeof routes['boards.tasks.index']
      store: typeof routes['boards.tasks.store']
      update: typeof routes['boards.tasks.update']
      destroy: typeof routes['boards.tasks.destroy']
    }
  }
}
