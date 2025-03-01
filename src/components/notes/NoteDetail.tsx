import { useMemo } from 'react';

import { toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Note } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/utils';
import { deleteNote } from '@/api/NoteAPI';

type NoteDetailProps = {
  note: Note;
};

export default function NoteDetail({ note }: NoteDetailProps) {
  const { data, isLoading } = useAuth();
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);

  const params = useParams();
  const projectId = params.projectId!;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('viewTask')!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  if (isLoading) return 'Cargando...';

  return (
    <div className='p-3 sm:p-4 flex items-start justify-between bg-white shadow-md rounded-lg my-4'>
      <div className='flex flex-col'>
        <p className='text-sm md:text-base text-slate-700 font-bold'>
          {note.content}
          <span className='block text-p md:text-base text-slate-500 mt-1'>
            Creado por: <span className='font-medium'>{note.createdBy.name}</span>
          </span>
        </p>
        <p className='text-xs text-slate-400 mt-1'>{formatDate(note.createdAt)}</p>
      </div>

      {canDelete && (
        <button
          type='button'
          className='bg-red-500 hover:bg-red-600 px-3 py-1 text-[12px] sm:text-sm text-white font-bold rounded-md transition-all cursor-pointer'
          onClick={() => mutate({ taskId, projectId, noteId: note._id })}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
