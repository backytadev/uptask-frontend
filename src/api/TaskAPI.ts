import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { Project, TaskFormData } from '@/types';

interface TaskAPI {
  formData: TaskFormData;
  projectId: Project['_id'];
}

//* Create
export async function createTask({ projectId, formData }: TaskAPI) {
  try {
    const { data } = await api.post<string>(`/projects/${projectId}/tasks`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
