import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNewEntry: () => void;
  onMobileMenuToggle: () => void;
}

export function Header({ onNewEntry, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-primary text-xl font-bold">행복한 일기</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                <i className="ri-settings-4-line mr-1"></i>
                설정
              </Button>
              <Button onClick={onNewEntry}>
                <i className="ri-add-line mr-1"></i>
                새 일기
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-expanded="false"
              onClick={onMobileMenuToggle}
            >
              <span className="sr-only">메뉴 열기</span>
              <i className="ri-menu-line text-xl"></i>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
