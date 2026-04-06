import type { HttpContext } from '@adonisjs/core/http'
import TaskDependency from '#models/task_dependency'
import Task from '#models/task'
import db from '@adonisjs/lucid/services/db'

export default class TaskDependenciesController {
  /** GET /tasks/:taskId/dependencies — tasks that this task is blocked by */
  async blockedBy({ params }: HttpContext) {
    const taskId = Number(params.taskId)
    const deps = await db
      .from('task_dependencies')
      .join('tasks', 'task_dependencies.depends_on_id', 'tasks.id')
      .where('task_dependencies.task_id', taskId)
      .select('tasks.id', 'tasks.title', 'tasks.priority', 'tasks.column_id as columnId')
    return deps
  }

  /** GET /tasks/:taskId/blocking — tasks that this task is blocking */
  async blocking({ params }: HttpContext) {
    const taskId = Number(params.taskId)
    const deps = await db
      .from('task_dependencies')
      .join('tasks', 'task_dependencies.task_id', 'tasks.id')
      .where('task_dependencies.depends_on_id', taskId)
      .select('tasks.id', 'tasks.title', 'tasks.priority', 'tasks.column_id as columnId')
    return deps
  }

  /** POST /tasks/:taskId/dependencies/:dependsOnId — add dependency */
  async store({ params, response }: HttpContext) {
    const taskId = Number(params.taskId)
    const dependsOnId = Number(params.dependsOnId)

    if (taskId === dependsOnId) {
      return response.badRequest({ error: 'Task ไม่สามารถ depend on ตัวเองได้' })
    }

    // Check both tasks exist
    const [task, dependsOn] = await Promise.all([
      Task.find(taskId),
      Task.find(dependsOnId),
    ])
    if (!task || !dependsOn) {
      return response.notFound({ error: 'Task not found' })
    }

    const existing = await TaskDependency.query()
      .where('task_id', taskId)
      .where('depends_on_id', dependsOnId)
      .first()

    if (existing) {
      return response.conflict({ error: 'Dependency already exists' })
    }

    // Prevent circular dependency
    const circular = await TaskDependency.query()
      .where('task_id', dependsOnId)
      .where('depends_on_id', taskId)
      .first()

    if (circular) {
      return response.badRequest({ error: 'Circular dependency detected' })
    }

    const dep = await TaskDependency.create({ taskId, dependsOnId })
    return response.created(dep)
  }

  /** DELETE /tasks/:taskId/dependencies/:dependsOnId — remove dependency */
  async destroy({ params, response }: HttpContext) {
    const taskId = Number(params.taskId)
    const dependsOnId = Number(params.dependsOnId)

    await TaskDependency.query()
      .where('task_id', taskId)
      .where('depends_on_id', dependsOnId)
      .delete()

    return response.noContent()
  }
}
