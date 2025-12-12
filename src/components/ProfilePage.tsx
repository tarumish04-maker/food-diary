import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  favoriteFood: string;
}

interface ProfilePageProps {
  onUpdateProfile: (profile: UserProfile) => void;
  profile: UserProfile;
}

export function ProfilePage({ onUpdateProfile, profile }: ProfilePageProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [favoriteFood, setFavoriteFood] = useState(profile.favoriteFood);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile({ name, bio, avatarUrl, favoriteFood });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(profile.name);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setFavoriteFood(profile.favoriteFood);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="mb-6">プロフィール</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">ニックネーム</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="ニックネームを入力"
            />
          ) : (
            <p className="text-gray-800">{name || '未設定'}</p>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">自己紹介</label>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={4}
              placeholder="自己紹介を入力"
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap">{bio || '未設定'}</p>
          )}
        </div>

        {/* Favorite Food */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">好きな食べ物</label>
          {isEditing ? (
            <input
              type="text"
              value={favoriteFood}
              onChange={(e) => setFavoriteFood(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="好きな食べ物を入力"
            />
          ) : (
            <p className="text-gray-800">{favoriteFood || '未設定'}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                保存
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              編集
            </button>
          )}
        </div>
      </div>
    </div>
  );
}