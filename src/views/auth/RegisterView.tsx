import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { createAccount } from '@/api/AuthAPI';
import { UserRegistrationForm } from '@/types/index';

import ErrorMessage from '@/components/ErrorMessage';

export default function RegisterView() {
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
    },
  });

  const password = watch('password');

  const handleRegister = (formData: UserRegistrationForm) => {
    mutate(formData);
  };

  return (
    <>
      <div className='mx-auto max-w-lg sm:px-0'>
        <h1 className='text-4xl sm:text-5xl font-black text-white text-center'>Crear Cuenta</h1>
        <p className='text-lg sm:text-2xl font-light text-white mt-5 text-center'>
          Llena el formulario para{' '}
          <span className='text-fuchsia-500 font-bold'>crear tu cuenta</span>
        </p>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className='mt-10 flex flex-col gap-6 bg-white shadow-md p-6 sm:p-10 rounded-xl'
          noValidate
        >
          <div className='flex flex-col gap-2'>
            <label className='text-base sm:text-lg font-medium' htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              type='email'
              placeholder='Email de Registro'
              className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
              {...register('email', {
                required: 'El Email de registro es obligatorio',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'E-mail no válido',
                },
              })}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-base sm:text-lg font-medium' htmlFor='name'>
              Nombre
            </label>
            <input
              id='name'
              type='text'
              placeholder='Nombre de Registro'
              className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
              {...register('name', {
                required: 'El Nombre de usuario es obligatorio',
              })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-base sm:text-lg font-medium' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              placeholder='Password de Registro'
              className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
              {...register('password', {
                required: 'El Password es obligatorio',
                minLength: {
                  value: 8,
                  message: 'El Password debe ser mínimo de 8 caracteres',
                },
              })}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-base sm:text-lg font-medium' htmlFor='password_confirmation'>
              Repetir Password
            </label>
            <input
              id='password_confirmation'
              type='password'
              placeholder='Repite Password de Registro'
              className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
              {...register('password_confirmation', {
                required: 'Repetir Password es obligatorio',
                validate: (value) => value === password || 'Los Passwords no son iguales',
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type='submit'
            value='Registrarme'
            className='bg-fuchsia-600 w-full py-2 md:py-4 text-white uppercase  font-bold rounded-lg hover:bg-fuchsia-700 focus:ring-2 focus:ring-fuchsia-400 transition-all cursor-pointer'
          />
        </form>

        <nav className='mt-6 flex flex-col items-center space-y-3 text-sm md:text-base'>
          <Link
            to={'/auth/login'}
            className='text-slate-400 font-medium  hover:text-fuchsia-500 transition'
          >
            ¿Ya tienes cuenta? Inicia Sesión.
          </Link>
          <Link
            to={'/auth/forgot-password'}
            className='text-slate-400 font-medium  hover:text-fuchsia-500 transition'
          >
            ¿Olvidaste tu contraseña? Restablecer.
          </Link>
        </nav>
      </div>
    </>
  );
}
