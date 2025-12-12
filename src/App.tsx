import { useState, useEffect } from 'react';
import { PhotoUploader } from './components/PhotoUploader';
import { PhotoDiary } from './components/PhotoDiary';
import { ProfilePage, UserProfile } from './components/ProfilePage';
import { FooterNav } from './components/FooterNav';
import { Calendar, List } from 'lucide-react';
import bowlIcon from 'figma:asset/5903dd93b4f301921c46c1d1b929be56aa9d7637.png';

export interface PhotoEntry {
  id: string;
  imageUrl: string;
  date: string;
  memo: string;
  tags: string[];
  createdAt: number;
}

export const FOOD_CATEGORIES = [
  '和食',
  '洋食',
  'イタリアン',
  'フレンチ',
  '中華',
  '韓国料理',
  'エスニック',
  'ラーメン',
  'カレー',
  'スイーツ',
  'パン',
  'カフェ',
  '居酒屋',
  'ファストフード',
  'その他'
] as const;

export default function App() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [viewMode, setViewMode] = useState<'diary' | 'calendar'>('diary');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    bio: '',
    avatarUrl: '',
    favoriteFood: ''
  });

  // ローカルストレージから写真を読み込む
  useEffect(() => {
    const savedPhotos = localStorage.getItem('photoEntries');
    if (savedPhotos) {
      const parsed = JSON.parse(savedPhotos);
      // 既存データにtagsがない場合は空配列を追加
      const migratedPhotos = parsed.map((photo: any) => ({
        ...photo,
        tags: photo.tags || []
      }));
      setPhotos(migratedPhotos);
    }
  }, []);

  // ローカルストレージからプロフィールを読み込む
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  // 写真が更新されたらローカルストレージに保存
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('photoEntries', JSON.stringify(photos));
    }
  }, [photos]);

  // プロフィールが更新されたらローカルストレージに保存
  useEffect(() => {
    if (userProfile.name || userProfile.bio || userProfile.avatarUrl || userProfile.favoriteFood) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const handleAddPhoto = (photo: PhotoEntry) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    if (photos.length === 1) {
      localStorage.removeItem('photoEntries');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredPhotos = selectedTags.length > 0
    ? photos.filter(photo => photo.tags?.some(tag => selectedTags.includes(tag)))
    : photos;

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={bowlIcon} alt="bowl icon" className="w-12 h-12" />
            <h1 className="text-4xl" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>ごはんにっき</h1>
          </div>
          <p className="text-gray-600">美味しい思い出を記録しよう</p>
        </div>

        {currentPage === 'home' ? (
          <>
            {/* Photo Uploader */}
            <PhotoUploader onAddPhoto={handleAddPhoto} />

            {/* View Toggle */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => setViewMode('diary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'diary'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
                リスト表示
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                カレンダー表示
              </button>
            </div>

            {/* Photo Diary Display */}
            <PhotoDiary 
              photos={filteredPhotos} 
              viewMode={viewMode}
              onDeletePhoto={handleDeletePhoto}
            />

            {/* Tag Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
              <h3 className="mb-3">カテゴリーで絞り込み</h3>
              <div className="flex flex-wrap gap-2">
                {FOOD_CATEGORIES.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-3 text-sm text-gray-600 hover:text-gray-800"
                >
                  フィルターをクリア
                </button>
              )}
            </div>
          </>
        ) : (
          <ProfilePage profile={userProfile} onUpdateProfile={handleUpdateProfile} />
        )}
      </div>
      <FooterNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}