import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { PhotoEntry, FOOD_CATEGORIES } from '../App';

interface PhotoUploaderProps {
  onAddPhoto: (photo: PhotoEntry) => void;
}

export function PhotoUploader({ onAddPhoto }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (preview) {
      const newPhoto: PhotoEntry = {
        id: Date.now().toString(),
        imageUrl: preview,
        date,
        memo,
        tags: selectedTags,
        createdAt: Date.now(),
      };
      onAddPhoto(newPhoto);
      
      // リセット
      setPreview(null);
      setMemo('');
      setSelectedTags([]);
      setDate(new Date().toISOString().split('T')[0]);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setMemo('');
    setSelectedTags([]);
    setDate(new Date().toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-dashed border-orange-300 hover:border-orange-500 group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Upload className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <p className="text-orange-600">料理の写真を追加</p>
              <p className="text-sm text-gray-500">クリックして写真をアップロード</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">新しい写真を追加</h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className="block mb-2 text-sm text-gray-700">写真を選択</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Preview */}
            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Date Input */}
            <div>
              <label className="block mb-2 text-sm text-gray-700">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Tags Selection */}
            <div>
              <label className="block mb-2 text-sm text-gray-700">カテゴリー</label>
              <div className="flex flex-wrap gap-2">
                {FOOD_CATEGORIES.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Memo Input */}
            <div>
              <label className="block mb-2 text-sm text-gray-700">メモ</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="お店の名前や感想など..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!preview}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                追加
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}