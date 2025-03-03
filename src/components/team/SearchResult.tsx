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

  const { mutate, isPending } = useMutation({
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
      <p className='mt-6 text-center text-base md:text-lg font-semibold text-gray-700'>
        Resultado:
      </p>

      <div className='flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm mt-4'>
        <p className='text-base md:text-lg font-semibold text-gray-800'>{user.name}</p>

        <button
          type='submit'
          disabled={isPending}
          onClick={handleAddUserToProject}
          className={`font-bold p-2 px-4 rounded-lg text-base transition-all
    ${isPending ? 'bg-purple-400 cursor-not-allowed opacity-75 animate-pulse text-purple-600' : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'}`}
        >
          {isPending ? 'Agregando...' : '  Agregar al Proyecto'}
        </button>
      </div>
    </>
  );
}
