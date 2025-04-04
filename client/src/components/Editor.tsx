import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

interface EditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

export function Editor({ initialContent = "", onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  
  const addLink = () => {
    const url = window.prompt('URL 입력:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };
  
  const addImage = () => {
    const url = window.prompt('이미지 URL 입력:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
      <div className="toolbar flex flex-wrap items-center px-3 py-2 border-b border-gray-200">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-primary-100 text-primary-700' : ''}`} 
          onClick={toggleBold}
          title="굵게"
        >
          <i className="ri-bold"></i>
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-primary-100 text-primary-700' : ''}`} 
          onClick={toggleItalic}
          title="기울임"
        >
          <i className="ri-italic"></i>
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-primary-100 text-primary-700' : ''}`} 
          onClick={toggleUnderline}
          title="밑줄"
        >
          <i className="ri-underline"></i>
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-primary-100 text-primary-700' : ''}`} 
          onClick={toggleStrike}
          title="취소선"
        >
          <i className="ri-strikethrough"></i>
        </Button>
        <span className="mx-2 text-gray-300">|</span>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-primary-100 text-primary-700' : ''}`} 
          onClick={toggleBulletList}
          title="글머리 기호"
        >
          <i className="ri-list-unordered"></i>
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-primary-100 text-primary-700' : ''}`} 
          onClick={toggleOrderedList}
          title="번호 매기기"
        >
          <i className="ri-list-ordered"></i>
        </Button>
        <span className="mx-2 text-gray-300">|</span>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-primary-100 text-primary-700' : ''}`} 
          onClick={addLink}
          title="링크"
        >
          <i className="ri-link"></i>
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className={`px-2 py-1 rounded hover:bg-gray-100`} 
          onClick={addImage}
          title="이미지"
        >
          <i className="ri-image-add-line"></i>
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="editor-content px-3 py-2 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary-200 prose max-w-none"
      />
    </div>
  );
}
