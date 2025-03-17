import { useState } from 'react';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

import { loginUser } from '@/api/AuthAPI';
import { UserLoginForm } from '@/types/index';

import ErrorMessage from '@/components/ErrorMessage';

export default function LoginView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      navigate('/');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  console.log(isSubmitting);

  const handleLogin = (formData: UserLoginForm) => {
    mutate(formData);
  };

  return (
    <>
      <h1 className='text-4xl md:text-5xl font-black text-white text-center'>Iniciar Sesión</h1>
      <p className='text-lg md:text-2xl font-light text-white mt-4 text-center'>
        Comienza a planear tus proyectos{' '}
        <span className='text-fuchsia-500 font-bold'>iniciando sesión en este formulario</span>
      </p>
      <p className='text-amber-500 font-medium italic text-center mt-2'>
        NOTA: El servidor de Render, demora en conectar de 30 a 40 seg, por favor espera, muchas
        gracias. 🙌🏻😃
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className='space-y-6 p-6 md:p-8 mt-8 bg-white shadow-lg rounded-xl max-w-md w-full mx-auto'
        noValidate
      >
        <div className='flex flex-col gap-2'>
          <label className='font-medium  text-gray-700'>Email</label>
          <input
            id='email'
            type='email'
            placeholder='Email de Registro'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition'
            {...register('email', {
              required: 'El Email es obligatorio',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'E-mail no válido',
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium  text-gray-700'>Password</label>
          <input
            type='password'
            placeholder='Password de Registro'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition'
            {...register('password', {
              required: 'El Password es obligatorio',
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full p-2 md:p-3 text-base font-bold uppercase rounded-lg transition focus:ring-2 focus:ring-fuchsia-500 
          ${isSubmitting ? 'bg-fuchsia-400 cursor-not-allowed opacity-75 animate-pulse text-fuchsia-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer'}`}
        >
          {isSubmitting ? 'Conectando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <nav className='mt-6 flex flex-col items-center space-y-3 text-sm md:text-base'>
        <Link
          to={'/auth/register'}
          className='text-slate-400 hover:text-fuchsia-500 font-medium transition'
        >
          ¿No tienes cuenta? Crea Una.
        </Link>
        <Link
          to={'/auth/forgot-password'}
          className='text-slate-400 hover:text-fuchsia-500 font-medium transition'
        >
          ¿Olvidaste tu contraseña? Restablecer.
        </Link>
      </nav>

      <div className='text-white mt-8 p-4 bg-gray-800 rounded-lg shadow-md'>
        <button
          className='w-full flex justify-between items-center text-lg font-semibold cursor-pointer text-white bg-gray-900 p-3 rounded-md hover:bg-gray-700 transition'
          onClick={() => setIsOpen(!isOpen)}
        >
          📌 Credenciales de Prueba
          {isOpen ? (
            <ChevronUpIcon className='w-5 h-5 text-fuchsia-400 transition-transform duration-300' />
          ) : (
            <ChevronDownIcon className='w-5 h-5 text-fuchsia-400 transition-transform duration-300' />
          )}
        </button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='mt-3 space-y-3'>
            {[
              { email: 'jhon@uptask.com', password: 'Abcd12345%' },
              { email: 'maria@uptask.com', password: 'Abcd12345#' },
              { email: 'mathias@uptask.com', password: 'Abcd12345$' },
            ].map((cred, index) => (
              <div key={index} className='p-3 bg-gray-900 rounded-md text-center'>
                <p className='font-medium'>
                  ✉️ <span className='text-fuchsia-400'>Usuario:</span> {cred.email}
                </p>
                <p className='font-medium'>
                  🔑 <span className='text-fuchsia-400'>Contraseña:</span> {cred.password}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
