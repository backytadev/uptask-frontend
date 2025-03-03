import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NoteFormData } from '@/types';
import { createNote } from '@/api/NoteAPI';
import ErrorMessage from '@/components/ErrorMessage';

export default function AddNoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
    onSettled: () => {
      setIsSubmitting(false);
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

        <button
          type='submit'
          disabled={isPending || isSubmitting}
          className={`w-full p-2 md:p-3 text-base font-bold uppercase rounded-lg transition focus:ring-2 focus:ring-fuchsia-500
          ${isPending || isSubmitting ? 'bg-fuchsia-400 cursor-not-allowed opacity-75 animate-pulse text-fuchsia-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer'}`}
        >
          {isPending || isSubmitting ? 'Creando...' : 'Crear Nota'}
        </button>
      </form>
    </>
  );
}
