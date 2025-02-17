import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { Project, Task, TaskFormData, taskSchema } from '@/types';

interface TaskAPI {
  formData: TaskFormData;
  projectId: Project['_id'];
  taskId: Task['_id'];
  status: Task['status'];
}

//* Create task
export async function createTask({ projectId, formData }: Pick<TaskAPI, 'formData' | 'projectId'>) {
  try {
    const { data } = await api.post<string>(`/projects/${projectId}/tasks`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//* Get task by id
export async function getTaskById({ projectId, taskId }: Pick<TaskAPI, 'taskId' | 'projectId'>) {
  try {
    const { data } = await api(`/projects/${projectId}/tasks/${taskId}`);

    const res = taskSchema.safeParse(data);
    if (res.success) {
      return res.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//* Update task by id
export async function updateTaskById({
  projectId,
  taskId,
  formData,
}: Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}/tasks/${taskId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//! Delete task by id
export async function deleteTaskById({ projectId, taskId }: Pick<TaskAPI, 'taskId' | 'projectId'>) {
  try {
    const { data } = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//* Update task by id
export async function updateStatus({
  projectId,
  taskId,
  status,
}: Pick<TaskAPI, 'taskId' | 'projectId' | 'status'>) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}/tasks/${taskId}/status`, {
      status,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
