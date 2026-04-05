import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    // Auth
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    // Profile
    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    // Boards
    router
      .group(() => {
        router.get('/', [controllers.Boards, 'index'])
        router.post('/', [controllers.Boards, 'store'])
        router.get('/:id', [controllers.Boards, 'show'])
        router.put('/:id', [controllers.Boards, 'update'])
        router.delete('/:id', [controllers.Boards, 'destroy'])

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
      })
      .prefix('boards')
      .as('boards')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
