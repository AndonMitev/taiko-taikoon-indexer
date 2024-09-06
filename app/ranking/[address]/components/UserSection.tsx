import { getTaikoUserHistory } from '@/app/actions/taiko-api';
import { formatTimestamp } from '@/lib/formatters';

export default async function UserSection({ address }: { address: string }) {
  const history = await getTaikoUserHistory({ address });

  return (
    <section className='space-y-2'>
      {history.map((item, idx) => (
        <div key={idx} className='flex justify-between items-center py-2'>
          <div>
            <span className='text-sm text-gray-500'>
              {formatTimestamp(item.date)}
            </span>
            <span className='ml-2'>{item.event}</span>
          </div>
          <span
            className={item.points === 0 ? 'text-gray-500' : 'text-green-500'}
          >
            {item.points === 0 ? 'Capped' : `${item.points} Points`}
          </span>
        </div>
      ))}
    </section>
  );
}
