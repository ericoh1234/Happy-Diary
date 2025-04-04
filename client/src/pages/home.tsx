import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SimpleEntryForm } from "@/components/SimpleEntryForm";
import { SimpleEntryList } from "@/components/SimpleEntryList";
import { SimpleEntryDialog } from "@/components/SimpleEntryDialog";
import { Entry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function Home() {
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/entries"],
  });

  const createEntryMutation = useMutation({
    mutationFn: async (newEntry: { title: string; content: string }) => {
      const res = await apiRequest("POST", "/api/entries", newEntry);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      setShowNewEntryForm(false);
      setSelectedEntry(null);
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({
      id,
      entry,
    }: {
      id: number;
      entry: { title: string; content: string };
    }) => {
      const res = await apiRequest("PUT", `/api/entries/${id}`, entry);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      setShowNewEntryForm(false);
      setSelectedEntry(null);
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
    },
  });

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setShowNewEntryForm(true);
  };

  const handleSaveEntry = (title: string, content: string) => {
    if (selectedEntry) {
      updateEntryMutation.mutate({
        id: selectedEntry.id,
        entry: { title, content },
      });
    } else {
      createEntryMutation.mutate({ title, content });
    }
  };

  const handleCloseForm = () => {
    setShowNewEntryForm(false);
    setSelectedEntry(null);
  };

  const handleEditEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setShowNewEntryForm(true);
  };

  const handleViewEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (id: number) => {
    deleteEntryMutation.mutate(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">행복한 일기</h1>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={handleNewEntry}
          >
            새 일기
          </button>
        </div>
      </header>

      <main>
        {showNewEntryForm ? (
          <SimpleEntryForm
            entry={selectedEntry}
            onSave={handleSaveEntry}
            onCancel={handleCloseForm}
          />
        ) : null}

        <SimpleEntryList
          entries={entries}
          isLoading={isLoading}
          onEntryClick={handleViewEntry}
          onEditClick={handleEditEntry}
          onDeleteClick={handleDeleteEntry}
        />

        {selectedEntry && (
          <SimpleEntryDialog
            entry={selectedEntry}
            open={viewDialogOpen}
            onClose={handleCloseDialog}
          />
        )}
      </main>
    </div>
  );
}
