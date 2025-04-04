import { useState } from "react";
import { Entry } from "@shared/schema";

interface SimpleEntryFormProps {
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  entry?: Entry | null;
}

export function SimpleEntryForm({ onSave, onCancel, entry }: SimpleEntryFormProps) {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave(title, content);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg mb-8 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-5">
        {entry ? "일기 수정하기" : "새 일기 작성하기"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
          <input
            id="title"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="일기 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">내용</label>
          <textarea
            id="content"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm min-h-[200px]"
            placeholder="일기 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}