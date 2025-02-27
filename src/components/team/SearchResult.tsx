import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TeamMember } from '@/types';
import { addUserToProject } from '@/api/TeamAPI';

type SearchResultProps = {
  user: TeamMember;
  reset: () => void;
};

export default function SearchResult({ user, reset }: SearchResultProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate(location.pathname, { replace: true });
      queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] });
    },
  });

  const handleAddUserToProject = () => {
    mutate({ projectId, id: user._id });
  };

  return (
    <>
      <p className='mt-6 text-center text-lg font-semibold text-gray-700'>Resultado:</p>

      <div className='flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm mt-4'>
        <p className='text-lg font-semibold text-gray-800'>{user.name}</p>

        <button
          className='mt-3 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-sm cursor-pointer'
          onClick={handleAddUserToProject}
        >
          Agregar al Proyecto
        </button>
      </div>
    </>
  );
}
