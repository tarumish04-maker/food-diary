import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoEntry } from '../App';
import { PhotoCard } from './PhotoCard';
import bowlIcon from 'figma:asset/5903dd93b4f301921c46c1d1b929be56aa9d7637.png';

interface CalendarViewProps {
  photos: PhotoEntry[];
  onDeletePhoto: (id: string) => void;
}

export function CalendarView({ photos, onDeletePhoto }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const photosByDate = photos.reduce((acc, photo) => {
    if (!acc[photo.date]) {
      acc[photo.date] = [];
    }
    acc[photo.date].push(photo);
    return acc;
  }, {} as Record<string, PhotoEntry[]>);

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayPhotos = photosByDate[dateStr] || [];

    days.push(
      <div key={day} className="aspect-square border border-gray-200 bg-white rounded-lg p-2 hover:shadow-md transition-shadow">
        <div className="text-sm text-gray-600 mb-1">{day}</div>
        {dayPhotos.length > 0 && (
          <div className="relative">
            <img
              src={dayPhotos[0].imageUrl}
              alt={`${dateStr}の写真`}
              className="w-full h-16 object-cover rounded"
            />
            {dayPhotos.length > 1 && (
              <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {dayPhotos.length}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayPhotos = photosByDate[dateStr] || [];
    if (dayPhotos.length > 0) {
      setSelectedDate(dateStr);
    }
  };

  const daysWithClick = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysWithClick.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayPhotos = photosByDate[dateStr] || [];

    daysWithClick.push(
      <div
        key={day}
        onClick={() => handleDayClick(day)}
        className={`aspect-square border border-gray-200 bg-white rounded-lg p-2 hover:shadow-md transition-shadow ${
          dayPhotos.length > 0 ? 'cursor-pointer' : ''
        }`}
      >
        <div className="text-sm text-gray-600 mb-1">{day}</div>
        {dayPhotos.length > 0 && (
          <div className="flex flex-col items-center justify-center h-12">
            <img src={bowlIcon} alt="food record" className="w-8 h-8 mb-1" />
            {dayPhotos.length > 1 && (
              <div className="text-xs text-orange-600 font-semibold">
                {dayPhotos.length}件
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Calendar Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl">
            {year}年 {month + 1}月
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <div key={day} className="text-center text-sm text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">{daysWithClick}</div>
      </div>

      {/* Selected Date Photos */}
      {selectedDate && photosByDate[selectedDate] && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              閉じる
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photosByDate[selectedDate].map(photo => (
              <PhotoCard key={photo.id} photo={photo} onDelete={onDeletePhoto} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}