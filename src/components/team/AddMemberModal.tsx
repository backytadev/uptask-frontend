import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

import AddMemberForm from '@/components/team/AddMemberForm';

export default function AddMemberModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const addMember = queryParams.get('addMember');
  const show = addMember ? true : false;

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-50'
          onClose={() => navigate(location.pathname, { replace: true })}
        >
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/60' />
          </TransitionChild>

          <div className='fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-10'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-lg sm:max-w-2xl lg:max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all p-6 sm:p-10 lg:p-12'>
                <DialogTitle as='h3' className='text-2xl sm:text-3xl lg:text-4xl font-black'>
                  Agregar Integrante al Equipo
                </DialogTitle>

                <p className='text-base sm:text-lg lg:text-xl font-bold mt-4'>
                  Busca el nuevo integrante por email{' '}
                  <span className='text-fuchsia-600'>para agregarlo al proyecto</span>
                </p>

                <div className='mt-6'>
                  <AddMemberForm />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
