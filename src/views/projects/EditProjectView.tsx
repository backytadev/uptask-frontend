import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';

import { getProjectById } from '@/api/ProjectAPI';
import EditProjectForm from '@/components/projects/EditProjectForm';

export default function EditProjectView() {
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-screen -mt-[8rem]'>
        <div className='animate-spin rounded-full border-4 border-gray-300 border-t-fuchsia-500 h-16 w-16'></div>
      </div>
    );

  if (isError) return <Navigate to='/404' />;

  if (data) return <EditProjectForm data={data} projectId={projectId} />;
}
