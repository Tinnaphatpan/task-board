import Task from '#models/task'
import Column from '#models/column'

export class TaskService {
  async listTasksByColumn(columnId: number): Promise<Task[]> {
    return Task.query().where('column_id', columnId).orderBy('position', 'asc')
  }

  async createTask(
    columnId: number,
    createdBy: number,
    data: {
      title: string
      description?: string
      priority?: string
      dueDate?: string
      assigneeId?: number
    }
  ): Promise<Task> {
    const lastTask = await Task.query()
      .where('column_id', columnId)
      .orderBy('position', 'desc')
      .first()
    const position = lastTask ? lastTask.position! + 1 : 0

    return Task.create({
      columnId,
      createdBy,
      title: data.title,
      description: data.description,
      priority: data.priority ?? 'medium',
      dueDate: data.dueDate ? (data.dueDate as any) : null,
      assigneeId: data.assigneeId ?? null,
      position,
    })
  }

  async findTaskById(taskId: number): Promise<Task | null> {
    return Task.find(taskId)
  }

  async updateTask(
    task: Task,
    data: {
      title?: string
      description?: string
      priority?: string
      dueDate?: string
      assigneeId?: number
      columnId?: number
    }
  ): Promise<Task> {
    if (data.title !== undefined) task.title = data.title
    if (data.description !== undefined) task.description = data.description ?? null
    if (data.priority !== undefined) task.priority = data.priority ?? null
    if (data.dueDate !== undefined) task.dueDate = data.dueDate as any
    if (data.assigneeId !== undefined) task.assigneeId = data.assigneeId ?? null
    if (data.columnId !== undefined) task.columnId = data.columnId
    await task.save()
    return task
  }

  async deleteTask(task: Task): Promise<void> {
    await task.delete()
  }

  async getColumnById(columnId: number): Promise<Column | null> {
    return Column.find(columnId)
  }

  async listColumnsByBoard(boardId: number): Promise<Column[]> {
    return Column.query().where('board_id', boardId).orderBy('position', 'asc')
  }

  async createColumn(boardId: number, name: string, position: number): Promise<Column> {
    return Column.create({ boardId, name, position })
  }

  async updateColumn(column: Column, name: string): Promise<Column> {
    column.name = name
    await column.save()
    return column
  }

  async deleteColumn(column: Column): Promise<void> {
    await column.delete()
  }
}
