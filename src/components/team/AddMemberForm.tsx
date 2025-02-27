import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { TeamMemberForm } from '@/types';
import { findUserByEmail } from '@/api/TeamAPI';

import ErrorMessage from '@/components/ErrorMessage';
import SearchResult from '@/components/team/SearchResult';

export default function AddMemberForm() {
  const initialValues: TeamMemberForm = {
    email: '',
  };

  const params = useParams();
  const projectId = params.projectId!;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: findUserByEmail,
  });

  const handleSearchUser = async (formData: TeamMemberForm) => {
    mutation.mutate({ projectId, formData });
  };

  const resetData = () => {
    reset();
    mutation.reset();
  };

  return (
    <>
      <form className='mt-6 space-y-6' onSubmit={handleSubmit(handleSearchUser)} noValidate>
        <div className='flex flex-col gap-2'>
          <label className='text-base sm:text-xl font-medium' htmlFor='email'>
            E-mail de Usuario
          </label>
          <input
            id='email'
            type='email'
            placeholder='E-mail del usuario a agregar'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-fuchsia-500 focus:outline-none'
            {...register('email', {
              required: 'El Email es obligatorio',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'E-mail no válido',
              },
            })}
          />
          {errors.email && (
            <p className='text-red-600 text-sm'>
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            </p>
          )}
        </div>

        <button
          type='submit'
          className='w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-lg sm:text-xl py-3 rounded-lg transition-all'
        >
          Buscar Usuario
        </button>
      </form>

      <div className='mt-3'>
        {mutation.isPending && <p className='text-center text-lg font-semibold'>Cargando...</p>}
        {mutation.error && (
          <p className='text-center text-red-600'>
            <ErrorMessage>{mutation.error.message}</ErrorMessage>
          </p>
        )}
        {mutation.data && <SearchResult user={mutation.data} reset={resetData} />}
      </div>
    </>
  );
}
