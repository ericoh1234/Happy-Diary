import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNewEntry: () => void;
}

export function MobileMenu({ open, onClose, onNewEntry }: MobileMenuProps) {
  if (!open) return null;

  const handleNewEntryClick = () => {
    onClose();
    onNewEntry();
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">메뉴</h2>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
            <span className="sr-only">닫기</span>
            <i className="ri-close-line text-xl"></i>
          </Button>
        </div>
        <div className="py-4">
          <div className="px-4 space-y-1">
            <Button 
              variant="ghost" 
              className="flex items-center justify-start w-full px-2 py-2 text-base font-medium hover:bg-gray-50 text-gray-900"
              onClick={handleNewEntryClick}
            >
              <i className="ri-add-line text-gray-500 mr-3"></i>
              새 일기
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center justify-start w-full px-2 py-2 text-base font-medium hover:bg-gray-50 text-gray-900"
            >
              <i className="ri-settings-4-line text-gray-500 mr-3"></i>
              설정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
