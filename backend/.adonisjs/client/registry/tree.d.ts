/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
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
      update: typeof routes['profile.profile.update']
      uploadAvatar: typeof routes['profile.profile.upload_avatar']
    }
  }
  users: {
    users: {
      index: typeof routes['users.users.index']
    }
  }
  search: {
    search: {
      index: typeof routes['search.search.index']
    }
  }
  notifications: {
    notifications: {
      index: typeof routes['notifications.notifications.index']
      unreadCount: typeof routes['notifications.notifications.unread_count']
      markAllRead: typeof routes['notifications.notifications.mark_all_read']
      markRead: typeof routes['notifications.notifications.mark_read']
    }
  }
  boardTemplates: {
    boardTemplates: {
      index: typeof routes['boardTemplates.board_templates.index']
      apply: typeof routes['boardTemplates.board_templates.apply']
    }
  }
  workspaces: {
    workspaces: {
      index: typeof routes['workspaces.workspaces.index']
      store: typeof routes['workspaces.workspaces.store']
      show: typeof routes['workspaces.workspaces.show']
      update: typeof routes['workspaces.workspaces.update']
      destroy: typeof routes['workspaces.workspaces.destroy']
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
    activityLogs: {
      index: typeof routes['boards.activity_logs.index']
    }
    export: {
      boardCsv: typeof routes['boards.export.board_csv']
    }
    boardStats: {
      index: typeof routes['boards.board_stats.index']
    }
    labels: {
      index: typeof routes['boards.labels.index']
      store: typeof routes['boards.labels.store']
      destroy: typeof routes['boards.labels.destroy']
      taskLabels: typeof routes['boards.labels.task_labels']
      attachToTask: typeof routes['boards.labels.attach_to_task']
      detachFromTask: typeof routes['boards.labels.detach_from_task']
    }
    boardMembers: {
      index: typeof routes['boards.board_members.index']
      store: typeof routes['boards.board_members.store']
      update: typeof routes['boards.board_members.update']
      destroy: typeof routes['boards.board_members.destroy']
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
    comments: {
      index: typeof routes['boards.comments.index']
      store: typeof routes['boards.comments.store']
      destroy: typeof routes['boards.comments.destroy']
    }
    subtasks: {
      index: typeof routes['boards.subtasks.index']
      store: typeof routes['boards.subtasks.store']
      toggle: typeof routes['boards.subtasks.toggle']
      destroy: typeof routes['boards.subtasks.destroy']
    }
    taskAttachments: {
      index: typeof routes['boards.task_attachments.index']
      store: typeof routes['boards.task_attachments.store']
      destroy: typeof routes['boards.task_attachments.destroy']
    }
  }
}
