import { Entry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface EntryCardProps {
  entry: Entry;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EntryCard({ entry, onView, onEdit, onDelete }: EntryCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking a button
    if (!(e.target as HTMLElement).closest('button')) {
      onView();
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "yyyy년 M월 d일", { locale: ko });
  };

  // Strip HTML tags for preview
  const getContentPreview = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.slice(0, 150);
  };

  return (
    <div
      className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition duration-150 ease-in-out cursor-pointer"
      onClick={handleClick}
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
        <div className="flex items-center justify-between text-sm">
          <div className="flex space-x-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              일상
            </span>
          </div>
          <div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-gray-500 transition-colors" 
              onClick={onEdit}
              aria-label="편집"
            >
              <i className="ri-edit-line"></i>
            </Button>
            <Button
              variant="ghost"
              size="icon" 
              className="ml-2 text-gray-400 hover:text-red-500 transition-colors" 
              onClick={onDelete}
              aria-label="삭제"
            >
              <i className="ri-delete-bin-line"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
