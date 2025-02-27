import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { ProjectFormData } from '@/types';
import ErrorMessage from '@/components/ErrorMessage';

type ProjectFormProps = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
};

export default function ProjectForm({ register, errors }: ProjectFormProps) {
  return (
    <>
      <div className='mb-5 space-y-2'>
        <label
          htmlFor='projectName'
          className='text-sm md:text-base font-medium uppercase text-gray-700'
        >
          Nombre del Proyecto
        </label>
        <input
          id='projectName'
          className='w-full mt-1 p-2 md:p-3 border text-sm md:text-base border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
          type='text'
          placeholder='Escribe el nombre del proyecto'
          {...register('projectName', {
            required: 'El título del proyecto es obligatorio',
          })}
        />
        {errors.projectName && <ErrorMessage>{errors.projectName.message}</ErrorMessage>}
      </div>

      <div className='mb-5 space-y-2'>
        <label
          htmlFor='clientName'
          className='text-sm md:text-base font-medium uppercase text-gray-700'
        >
          Nombre del Cliente
        </label>
        <input
          id='clientName'
          className='w-full mt-1 p-2 md:p-3 border text-sm md:text-base border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
          type='text'
          placeholder='Nombre del Cliente'
          {...register('clientName', {
            required: 'El nombre del cliente es obligatorio',
          })}
        />
        {errors.clientName && <ErrorMessage>{errors.clientName.message}</ErrorMessage>}
      </div>

      <div className='mb-5 space-y-2'>
        <label
          htmlFor='description'
          className='text-sm md:text-base font-medium uppercase text-gray-700'
        >
          Descripción
        </label>
        <textarea
          id='description'
          className='w-full mt-1 p-2 md:p-3 border text-sm md:text-base border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
          placeholder='Escribe una breve descripción del proyecto'
          {...register('description', {
            required: 'Una descripción del proyecto es obligatoria',
          })}
        />
        {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
      </div>
    </>
  );
}
