import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { dashboardProjectSchema, Project, ProjectFormData } from '@/types';

interface ProjectAPI {
  formData: ProjectFormData;
  projectId: Project['_id'];
}

//* Create
export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post('/projects', formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//* Get all
export async function getProjects() {
  try {
    const { data } = await api('/projects');
    const response = dashboardProjectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//* Get by id
export async function getProjectById(id: Project['_id']) {
  try {
    const { data } = await api(`/projects/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//* Update
export async function updateProjectById({ formData, projectId }: ProjectAPI) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//! Delete
export async function deleteProjectById(id: Project['_id']) {
  try {
    const { data } = await api.delete<string>(`/projects/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
