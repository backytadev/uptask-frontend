import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

import { ProjectFormData } from '@/types';
import { createProject } from '@/api/ProjectAPI';

import ProjectForm from '@/components/projects/ProjectForm';

export default function CreateProjectView() {
  const navigate = useNavigate();

  const initialValues: ProjectFormData = {
    projectName: '',
    clientName: '',
    description: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/');
    },
  });

  const handleForm = (formData: ProjectFormData) => mutate(formData);
  return (
    <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='text-center sm:text-left'>
        <h1 className='text-4xl sm:text-5xl font-black'>Crear Proyecto</h1>
        <p className='text-lg sm:text-2xl font-light text-gray-500 mt-2'>
          Llena el siguiente formulario para crear un proyecto
        </p>
      </div>

      <nav className='my-6 flex justify-center sm:justify-start'>
        <Link
          to='/'
          className='bg-purple-500 hover:bg-purple-600 px-6 sm:px-10 py-3 text-white text-lg sm:text-xl font-bold rounded-lg transition-colors'
        >
          Volver a Proyectos
        </Link>
      </nav>

      <form
        className='mt-6 sm:mt-10 bg-white shadow-lg p-6 sm:p-10 rounded-lg border border-gray-200'
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <ProjectForm register={register} errors={errors} />

        <input
          type='submit'
          value='Crear Proyecto'
          className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full py-3 sm:py-4 text-white uppercase font-bold rounded-lg cursor-pointer transition-colors mt-2'
        />
      </form>
    </div>
  );
}
