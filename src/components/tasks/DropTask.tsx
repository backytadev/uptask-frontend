import { useDroppable } from '@dnd-kit/core';

type DropTaskProps = {
  status: string;
};

export default function DropTask({ status }: DropTaskProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const style = {
    opacity: isOver ? 0.9 : 1,
    border: isOver ? '2px dashed #30a632' : '2px solid',
    transition: 'border 0.2s ease-in-out, opacity 0.2s ease-in-out',
    borderRadius: '8px',
    padding: '8px',
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className='text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500'
    >
      Soltar tarea aquí
    </div>
  );
}
