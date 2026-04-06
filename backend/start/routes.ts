import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import RateLimitMiddleware from '#middleware/rate_limit_middleware'

const authRateLimit = () => new RateLimitMiddleware(10, 60_000)

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    // Auth
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store']).use([authRateLimit()])
        router.post('login', [controllers.AccessToken, 'store']).use([authRateLimit()])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    // Profile
    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
        router.put('/profile', [controllers.Profile, 'update'])
        router.post('/avatar', [controllers.Profile, 'uploadAvatar'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    // Users (search for assignment)
    router
      .group(() => {
        router.get('/', [controllers.Users, 'index'])
      })
      .prefix('users')
      .as('users')
      .use(middleware.auth())

    // Global search
    router
      .group(() => {
        router.get('/', [controllers.Search, 'index'])
      })
      .prefix('search')
      .as('search')
      .use(middleware.auth())

    // Notifications
    router
      .group(() => {
        router.get('/', [controllers.Notifications, 'index'])
        router.get('/unread-count', [controllers.Notifications, 'unreadCount'])
        router.patch('/read-all', [controllers.Notifications, 'markAllRead'])
        router.patch('/:id/read', [controllers.Notifications, 'markRead'])
      })
      .prefix('notifications')
      .as('notifications')
      .use(middleware.auth())

    // Workspaces
    router
      .group(() => {
        router.get('/', [controllers.Workspaces, 'index'])
        router.post('/', [controllers.Workspaces, 'store'])
        router.get('/:id', [controllers.Workspaces, 'show'])
        router.put('/:id', [controllers.Workspaces, 'update'])
        router.delete('/:id', [controllers.Workspaces, 'destroy'])
      })
      .prefix('workspaces')
      .as('workspaces')
      .use(middleware.auth())

    // Boards
    router
      .group(() => {
        router.get('/', [controllers.Boards, 'index'])
        router.post('/', [controllers.Boards, 'store'])
        router.get('/:id', [controllers.Boards, 'show'])
        router.put('/:id', [controllers.Boards, 'update'])
        router.delete('/:id', [controllers.Boards, 'destroy'])

        // Activity logs
        router.get('/:boardId/activity', [controllers.ActivityLogs, 'index'])

        // CSV Export
        router.get('/:boardId/export/csv', [controllers.Export, 'boardCsv'])

        // Stats
        router.get('/:boardId/stats', [controllers.BoardStats, 'index'])

        // Labels
        router.get('/:boardId/labels', [controllers.Labels, 'index'])
        router.post('/:boardId/labels', [controllers.Labels, 'store'])
        router.delete('/labels/:id', [controllers.Labels, 'destroy'])
        router.get('/tasks/:taskId/labels', [controllers.Labels, 'taskLabels'])
        router.post('/tasks/:taskId/labels/:labelId', [controllers.Labels, 'attachToTask'])
        router.delete('/tasks/:taskId/labels/:labelId', [controllers.Labels, 'detachFromTask'])

        // Board members
        router.get('/:boardId/members', [controllers.BoardMembers, 'index'])
        router.post('/:boardId/members', [controllers.BoardMembers, 'store'])
        router.put('/:boardId/members/:userId', [controllers.BoardMembers, 'update'])
        router.delete('/:boardId/members/:userId', [controllers.BoardMembers, 'destroy'])

        // Columns (nested under board)
        router.get('/:boardId/columns', [controllers.Columns, 'index'])
        router.post('/:boardId/columns', [controllers.Columns, 'store'])
        router.put('/columns/:id', [controllers.Columns, 'update'])
        router.delete('/columns/:id', [controllers.Columns, 'destroy'])

        // Tasks (nested under column)
        router.get('/columns/:columnId/tasks', [controllers.Tasks, 'index'])
        router.post('/columns/:columnId/tasks', [controllers.Tasks, 'store'])
        router.put('/tasks/:id', [controllers.Tasks, 'update'])
        router.delete('/tasks/:id', [controllers.Tasks, 'destroy'])

        // Comments (nested under task)
        router.get('/tasks/:taskId/comments', [controllers.Comments, 'index'])
        router.post('/tasks/:taskId/comments', [controllers.Comments, 'store'])
        router.delete('/comments/:id', [controllers.Comments, 'destroy'])

        // Subtasks (nested under task)
        router.get('/tasks/:taskId/subtasks', [controllers.Subtasks, 'index'])
        router.post('/tasks/:taskId/subtasks', [controllers.Subtasks, 'store'])
        router.patch('/subtasks/:id/toggle', [controllers.Subtasks, 'toggle'])
        router.delete('/subtasks/:id', [controllers.Subtasks, 'destroy'])

        // Attachments (nested under task)
        router.get('/tasks/:taskId/attachments', [controllers.TaskAttachments, 'index'])
        router.post('/tasks/:taskId/attachments', [controllers.TaskAttachments, 'store'])
        router.delete('/attachments/:id', [controllers.TaskAttachments, 'destroy'])
      })
      .prefix('boards')
      .as('boards')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
