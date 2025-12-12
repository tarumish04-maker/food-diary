import { Home, User } from 'lucide-react';

interface FooterNavProps {
  currentPage: 'home' | 'profile';
  onPageChange: (page: 'home' | 'profile') => void;
}

export function FooterNav({ currentPage, onPageChange }: FooterNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-around py-3">
          <button
            onClick={() => onPageChange('home')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'text-orange-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">ホーム</span>
          </button>
          <button
            onClick={() => onPageChange('profile')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              currentPage === 'profile'
                ? 'text-orange-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">プロフィール</span>
          </button>
        </div>
      </div>
    </div>
  );
}
