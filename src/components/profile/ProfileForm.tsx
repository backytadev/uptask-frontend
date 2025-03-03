import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User, UserProfileForm } from '@/types';
import { updateProfile } from '@/api/ProfileAPI';
import ErrorMessage from '@/components/ErrorMessage';

type ProfileFormProps = {
  data: User;
};

export default function ProfileForm({ data }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({ defaultValues: data });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleEditProfile = (formData: UserProfileForm) => {
    mutate(formData);
  };

  return (
    <div className='mx-auto max-w-lg px-5 sm:px-0'>
      <h1 className='text-4xl font-black text-center sm:text-5xl'>Mi Perfil</h1>
      <p className='text-lg sm:text-xl font-light text-gray-500 mt-4 text-center'>
        Aquí puedes actualizar tu información
      </p>

      <form
        onSubmit={handleSubmit(handleEditProfile)}
        className='mt-10 bg-white shadow-lg p-6 sm:p-10 rounded-lg space-y-6'
        noValidate
      >
        <div className='space-y-2'>
          <label className='text-sm uppercase font-bold text-gray-700' htmlFor='name'>
            Nombre
          </label>
          <input
            id='name'
            type='text'
            placeholder='Tu Nombre'
            className='w-full mt-1 p-2 md:p-3  text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
            {...register('name', { required: 'Nombre de usuario es requerido.' })}
            aria-invalid={!!errors.name}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className='space-y-2'>
          <label className='text-sm uppercase font-bold text-gray-700' htmlFor='email'>
            E-mail
          </label>
          <input
            id='email'
            type='email'
            placeholder='Tu Email'
            className='w-full mt-1 p-2 md:p-3 border text-sm md:text-base border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
            {...register('email', {
              required: 'El e-mail es obligatorio',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'E-mail no válido',
              },
            })}
            aria-invalid={!!errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <button
          type='submit'
          disabled={isPending}
          className={`w-full font-bold text-base p-2 md:p-3 rounded-lg transition-all uppercase
              ${isPending ? 'bg-fuchsia-400 cursor-not-allowed opacity-75 animate-pulse text-fuchsia-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer'}`}
        >
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
