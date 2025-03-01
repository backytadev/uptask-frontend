import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { isManager } from '@/utils/policies';
import { getFullProject } from '@/api/ProjectAPI';

import TaskList from '@/components/tasks/TaskList';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import EditTaskData from '@/components/tasks/EditTaskData';
import TaskModalDetails from '@/components/tasks/TaskModalDetails';

export default function ProjectDetailsView() {
  const { data: user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getFullProject(projectId),
    retry: false,
  });

  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  if (isLoading || authLoading)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 -mt-[7rem]'>
        <div className='relative flex items-center justify-center'>
          <div className='animate-spin rounded-full border-4 border-gray-300 border-t-fuchsia-500 h-16 w-16'></div>
          <span className='absolute text-fuchsia-500 font-semibold'>💻</span>
        </div>
        <p className='mt-4 text-lg font-medium text-gray-600 animate-pulse'>
          Cargando Información del Proyecto...
        </p>
      </div>
    );

  if (isError) return <Navigate to='/404' />;

  if (data && user)
    return (
      <div className='p-5'>
        <h1 className='text-3xl sm:text-5xl font-black text-gray-900'>{data.projectName}</h1>
        <p className='text-lg sm:text-2xl font-light text-gray-600 mt-3'>{data.description}</p>

        {isManager(data.manager, user._id) && (
          <nav className='mt-6 flex flex-col sm:flex-row gap-3'>
            <button
              type='button'
              className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 text-white  font-semibold rounded-lg shadow-md transition-colors cursor-pointer'
              onClick={() => navigate(location.pathname + '?newTask=true')}
            >
              <PlusIcon className='w-6 h-6' />
              Agregar Tarea
            </button>

            <Link
              to='team'
              className='flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 px-6 py-3 text-white  font-semibold rounded-lg shadow-md transition-colors'
            >
              <UsersIcon className='w-6 h-6' />
              Colaboradores
            </Link>
          </nav>
        )}

        <div className='mt-6'>
          <TaskList tasks={data.tasks} canEdit={canEdit} />
        </div>

        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </div>
    );
}
