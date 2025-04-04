import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Entry } from "@shared/schema";
import { X } from "lucide-react";

interface EntryViewDialogProps {
  entry: Entry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EntryViewDialog({ entry, open, onOpenChange }: EntryViewDialogProps) {
  if (!entry) return null;

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "yyyy년 M월 d일", { locale: ko });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-auto">
        <DialogHeader className="border-b border-gray-200 pb-2">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-lg font-medium text-gray-900">{entry.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {formatDate(entry.createdAt)}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-gray-500 focus:outline-none" 
                onClick={() => onOpenChange(false)}
              >
                <span className="sr-only">닫기</span>
                <X size={18} />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="prose max-w-none py-2" dangerouslySetInnerHTML={{ __html: entry.content }} />
        <DialogFooter className="border-t border-gray-200 bg-gray-50 pt-3">
          <Button onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
