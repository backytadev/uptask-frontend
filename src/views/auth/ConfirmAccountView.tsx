import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';

import { ConfirmToken } from '@/types';
import { confirmAccount } from '@/api/AuthAPI';

export default function ConfirmAccountView() {
  const [token, setToken] = useState<ConfirmToken['token']>('');

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    },
  });

  const handleChange = (token: ConfirmToken['token']) => {
    setToken(token);
  };

  const handleComplete = (token: ConfirmToken['token']) => {
    mutate({ token });
  };

  return (
    <>
      <h1 className='text-5xl font-black text-white'>Confirma tu Cuenta</h1>
      <p className='text-2xl font-light text-white mt-5'>
        Ingresa el código que recibiste {''}
        <span className=' text-fuchsia-500 font-bold'> por e-mail</span>
      </p>

      <form className='space-y-4 md:space-y-5 p-5 md:p-10 rounded-lg bg-white mt-10'>
        <label className='font-normal text-xl md:text-2xl text-center block'>
          Código de 6 dígitos
        </label>

        <div className='flex justify-center flex-wrap md:flex-nowrap gap-2 md:gap-5'>
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
          </PinInput>
        </div>
      </form>

      <nav className='mt-10 flex flex-col space-y-4 text-sm md:text-base'>
        <Link
          to='/auth/request-code'
          className='text-slate-400 font-medium text-center hover:text-fuchsia-500 transition'
        >
          Solicitar un nuevo código
        </Link>
      </nav>
    </>
  );
}
