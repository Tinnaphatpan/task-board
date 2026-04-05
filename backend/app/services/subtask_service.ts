import Subtask from '#models/subtask'

export class SubtaskService {
  async listSubtasks(taskId: number): Promise<Subtask[]> {
    return Subtask.query().where('task_id', taskId).orderBy('position', 'asc')
  }

  async createSubtask(taskId: number, title: string, position: number): Promise<Subtask> {
    return Subtask.create({ taskId, title, position, completed: false })
  }

  async toggleSubtask(subtask: Subtask): Promise<Subtask> {
    subtask.completed = !subtask.completed
    await subtask.save()
    return subtask
  }

  async deleteSubtask(subtask: Subtask): Promise<void> {
    await subtask.delete()
  }

  async findSubtaskById(subtaskId: number): Promise<Subtask | null> {
    return Subtask.find(subtaskId)
  }
}
