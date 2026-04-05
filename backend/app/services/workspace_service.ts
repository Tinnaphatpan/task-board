import Workspace from '#models/workspace'
import WorkspaceMember from '#models/workspace_member'

export class WorkspaceService {
  async listForUser(userId: number): Promise<Workspace[]> {
    const owned = await Workspace.query().where('owner_id', userId)
    const memberIds = await WorkspaceMember.query().where('user_id', userId).select('workspace_id')
    const memberWorkspaces = await Workspace.query().whereIn(
      'id',
      memberIds.map((m) => m.workspaceId!)
    )
    const all = [...owned, ...memberWorkspaces]
    return all.filter((w, i, self) => self.findIndex((x) => x.id === w.id) === i)
  }

  async create(userId: number, name: string, description?: string): Promise<Workspace> {
    return Workspace.create({ ownerId: userId, name, description })
  }

  async findById(workspaceId: number): Promise<Workspace | null> {
    return Workspace.find(workspaceId)
  }

  async update(workspace: Workspace, name: string, description?: string): Promise<Workspace> {
    workspace.name = name
    workspace.description = description ?? null
    await workspace.save()
    return workspace
  }

  async delete(workspace: Workspace): Promise<void> {
    await workspace.delete()
  }

  async isOwner(workspaceId: number, userId: number): Promise<boolean> {
    const workspace = await Workspace.find(workspaceId)
    return workspace?.ownerId === userId
  }

  async isMember(workspaceId: number, userId: number): Promise<boolean> {
    const workspace = await Workspace.find(workspaceId)
    if (workspace?.ownerId === userId) return true
    const member = await WorkspaceMember.query()
      .where('workspace_id', workspaceId)
      .where('user_id', userId)
      .first()
    return !!member
  }
}
