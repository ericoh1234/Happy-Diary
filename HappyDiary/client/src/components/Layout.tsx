import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";

interface LayoutProps {
  children: ReactNode;
  onNewEntry: () => void;
}

export function Layout({ children, onNewEntry }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onNewEntry={onNewEntry} 
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)} 
      />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            행복한 일기 &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <MobileMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNewEntry={onNewEntry}
      />
    </div>
  );
}
