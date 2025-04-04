import { useEffect, useState } from "react";
import { Entry } from "@shared/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface SimpleEntryDialogProps {
  entry: Entry | null;
  open: boolean;
  onClose: () => void;
}

export function SimpleEntryDialog({ entry, open, onClose }: SimpleEntryDialogProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  if (!entry || !isOpen) {
    return null;
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "yyyy년 M월 d일 HH:mm", { locale: ko });
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={handleClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div 
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {entry.title}
                </h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(entry.createdAt)}
              </p>
            </div>
            
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }}></div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
              onClick={handleClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}