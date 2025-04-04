import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Entry } from "@shared/schema";

// Very basic app component to test if rendering works
function BasicApp() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch entries on mount
  useEffect(() => {
    fetch("/api/entries")
      .then(res => res.json())
      .then((data: Entry[]) => {
        setEntries(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching entries:", err);
        setIsLoading(false);
      });
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then((newEntry: Entry) => {
        setEntries([...entries, newEntry]);
        setTitle("");
        setContent("");
      })
      .catch(err => console.error("Error creating entry:", err));
  };
  
  const viewEntry = (entry: Entry) => {
    setSelectedEntry(entry);
  };
  
  const closeDialog = () => {
    setSelectedEntry(null);
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">행복한 일기</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <h2 className="text-xl mb-4">새 일기 작성하기</h2>
        <div className="mb-4">
          <label className="block mb-1">제목</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full p-2 border rounded"
            placeholder="일기 제목을 입력하세요"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">내용</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            className="w-full p-2 border rounded min-h-[150px]"
            placeholder="일기 내용을 입력하세요"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          저장하기
        </button>
      </form>
      
      <div>
        <h2 className="text-xl mb-4">내 일기 목록</h2>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : entries.length === 0 ? (
          <p>일기가 없습니다. 첫 번째 일기를 작성해보세요!</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {entries.map(entry => (
              <div 
                key={entry.id} 
                className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => viewEntry(entry)}
              >
                <h3 className="font-bold">{entry.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded max-w-lg w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">{selectedEntry.title}</h3>
              <button onClick={closeDialog} className="text-gray-500">&times;</button>
            </div>
            <div className="mt-4 border-t pt-4">
              <p>{selectedEntry.content}</p>
            </div>
            <button 
              onClick={closeDialog}
              className="mt-6 px-4 py-2 bg-gray-200 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BasicApp />
    </QueryClientProvider>
  );
}

export default App;
