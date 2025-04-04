import { Entry } from "@shared/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface SimpleEntryListProps {
  entries: Entry[];
  isLoading: boolean;
  onEntryClick: (entry: Entry) => void;
  onEditClick: (entry: Entry) => void;
  onDeleteClick: (id: number) => void;
}

export function SimpleEntryList({ 
  entries, 
  isLoading, 
  onEntryClick, 
  onEditClick, 
  onDeleteClick 
}: SimpleEntryListProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "yyyy년 M월 d일", { locale: ko });
  };

  // Strip HTML tags for preview
  const getContentPreview = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.slice(0, 150) + (textContent.length > 150 ? '...' : '');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">내 일기 목록</h2>
      
      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">로딩 중...</p>
        </div>
      )}
      
      {!isLoading && entries.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">일기가 없습니다. 첫 번째 일기를 작성해보세요!</p>
        </div>
      )}
      
      {!isLoading && entries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out cursor-pointer"
              onClick={() => onEntryClick(entry)}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{entry.title}</h3>
                  <span className="text-sm text-gray-500">{formatDate(entry.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                  {getContentPreview(entry.content)}
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex justify-end space-x-2">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(entry);
                    }}
                  >
                    수정
                  </button>
                  <button 
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
                        onDeleteClick(entry.id);
                      }
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}