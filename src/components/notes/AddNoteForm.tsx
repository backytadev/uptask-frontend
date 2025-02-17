export default function AddNoteForm() {
  return (
    <>
      <form onSubmit={() => {}} className='space-y-3' noValidate>
        <div className='flex flex-col gap-2'>
          <label className='font-bold' htmlFor='content'>
            Crear Nota
          </label>
          <input
            type='text'
            id='content'
            placeholder='Contenido de la nota'
            className='w-full p-3 border border-gray-300'
          />
        </div>

        <input
          value='Crear Nota'
          type='submit'
          className='bg-fuchsia-600 hover:bg-fuchsia-700 w-fill p-2 text-white font-black cursor-pointer'
        />
      </form>
    </>
  );
}
