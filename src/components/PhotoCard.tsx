import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { PhotoEntry } from '../App';

interface PhotoCardProps {
  photo: PhotoEntry;
  onDelete: (id: string) => void;
}

export function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsExpanded(true)}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
      >
        <div className="relative aspect-square">
          <img
            src={photo.imageUrl}
            alt={photo.memo || '写真'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
        </div>
        <div className="p-4">
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {photo.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {photo.memo && (
            <p className="text-gray-700 line-clamp-2">{photo.memo}</p>
          )}
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl">
                {new Date(photo.date + 'T00:00:00').toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (confirm('この写真を削除しますか？')) {
                      onDelete(photo.id);
                      setIsExpanded(false);
                    }
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <img
                src={photo.imageUrl}
                alt={photo.memo || '写真'}
                className="w-full rounded-lg mb-4"
              />
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {photo.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {photo.memo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{photo.memo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}