import { PhotoEntry } from '../App';
import { PhotoCard } from './PhotoCard';
import { CalendarView } from './CalendarView';

interface PhotoDiaryProps {
  photos: PhotoEntry[];
  viewMode: 'diary' | 'calendar';
  onDeletePhoto: (id: string) => void;
}

export function PhotoDiary({ photos, viewMode, onDeletePhoto }: PhotoDiaryProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#fffaf0' }}>
          <span className="text-4xl">🍜</span>
        </div>
        <p className="text-gray-500">まだ写真がありません</p>
        <p className="text-sm text-gray-400 mt-2">美味しい料理の記録を始めましょう</p>
      </div>
    );
  }

  if (viewMode === 'calendar') {
    return <CalendarView photos={photos} onDeletePhoto={onDeletePhoto} />;
  }

  // グループ化: 日付ごと
  const groupedByDate = photos.reduce((acc, photo) => {
    const date = photo.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, PhotoEntry[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-8">
      {sortedDates.map(date => {
        const dateObj = new Date(date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short'
        });

        return (
          <div key={date} className="space-y-4">
            <div className="sticky top-0 py-2 z-10" style={{ backgroundColor: '#fff8dc' }}>
              <h2 className="text-2xl">{formattedDate}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedByDate[date].map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onDelete={onDeletePhoto}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}