import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { insertEntrySchema, type Entry } from "@shared/schema";
import { Editor } from "./Editor";
import { useToast } from "@/hooks/use-toast";

interface EntryFormProps {
  entry?: Entry | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EntryForm({ entry, onSuccess, onCancel }: EntryFormProps) {
  const { toast } = useToast();
  const [content, setContent] = useState(entry?.content || "");
  
  const form = useForm({
    resolver: zodResolver(insertEntrySchema),
    defaultValues: {
      title: entry?.title || "",
      content: entry?.content || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const response = await apiRequest(
        "POST",
        "/api/entries",
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "일기가 저장되었습니다.",
        description: "새 일기가 성공적으로 생성되었습니다.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: `일기를 저장하는 중 오류가 발생했습니다: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const response = await apiRequest(
        "PUT",
        `/api/entries/${entry?.id}`,
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "일기가 수정되었습니다.",
        description: "일기가 성공적으로 수정되었습니다.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: `일기를 수정하는 중 오류가 발생했습니다: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { title: string; content: string }) => {
    const submitData = {
      ...data,
      content,
    };
    
    if (entry) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <Card className="bg-white shadow sm:rounded-lg mb-8">
      <CardContent className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">
          {entry ? "일기 수정하기" : "새 일기 작성하기"}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel htmlFor="title" className="block text-sm font-medium text-gray-700">제목</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="일기 제목을 입력하세요"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3 border"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={() => (
                <FormItem className="mb-4">
                  <FormLabel htmlFor="content" className="block text-sm font-medium text-gray-700">내용</FormLabel>
                  <FormControl>
                    <Editor 
                      initialContent={entry?.content} 
                      onChange={handleContentChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-3"
                onClick={onCancel}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
