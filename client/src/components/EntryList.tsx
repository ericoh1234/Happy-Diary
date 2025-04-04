import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { EntryWithState } from "@/lib/types";
import { Entry } from "@shared/schema";
import { EntryCard } from "./EntryCard";

interface EntryListProps {
  entries: EntryWithState[];
  isLoading: boolean;
  onView: (entry: Entry) => void;
  onEdit: (entry: Entry) => void;
  onSuccess: () => void;
}

export function EntryList({ entries, isLoading, onView, onEdit, onSuccess }: EntryListProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/entries/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "일기가 삭제되었습니다.",
        description: "일기가 성공적으로 삭제되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: `일기를 삭제하는 중 오류가 발생했습니다: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">내 일기 목록</h2>
      
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && entries.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <i className="ri-book-open-line text-4xl"></i>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">일기가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">첫 번째 일기를 작성해보세요!</p>
        </div>
      )}
      
      {!isLoading && entries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onView={() => onView(entry)}
              onEdit={() => onEdit(entry)}
              onDelete={() => handleDelete(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
