import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NoteFormData } from '@/types';
import { createNote } from '@/api/NoteAPI';
import ErrorMessage from '@/components/ErrorMessage';

export default function AddNoteForm() {
  const params = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const projectId = params.projectId!;
  const taskId = queryParams.get('viewTask')!;

  const initialValues: NoteFormData = {
    content: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  const handleAddNote = (formData: NoteFormData) => {
    mutate({ formData, taskId, projectId });
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleAddNote)} className='space-y-3' noValidate>
        <div className='flex flex-col gap-2'>
          <label className='font-bold text-sm md:text-base' htmlFor='content'>
            Crear Nota
          </label>
          <input
            type='text'
            id='content'
            placeholder='Contenido de la nota'
            className='w-full p-2 sm:p-3 border text-sm md:text-base border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none'
            {...register('content', {
              required: 'El contenido de la nota es obligatorio.',
            })}
          />
          {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
        </div>

        <input
          value='CREAR NOTA'
          type='submit'
          className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 md:p-3 text-sm md:text-base text-white font-black cursor-pointer rounded-md uppercase'
        />
      </form>
    </>
  );
}
