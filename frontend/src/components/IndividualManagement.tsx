// src/components/IndividualManagement.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Thêm AvatarImage
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Filter,
  User,
  Sparkles,
  MessageSquare,
  ClipboardCopy
} from "lucide-react";
import { IndividualForm } from "./IndividualForm";
import { IndividualProfile, InsertIndividualProfile, UpdateIndividualProfile } from '@/lib/types';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function IndividualManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndividual, setSelectedIndividual] = useState<IndividualProfile | null>(null);
  const [showIndividualForm, setShowIndividualForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [showLlmOutputModal, setShowLlmOutputModal] = useState(false);
  const [llmOutputTitle, setLlmOutputTitle] = useState("");
  const [llmOutputContent, setLlmOutputContent] = useState("");
  const [isLlmLoading, setIsLlmLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch individuals
  const { data: individuals = [], isLoading } = useQuery({
    queryKey: ["/api/individuals", searchQuery],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/individuals${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
      return response.json() as Promise<IndividualProfile[]>;
    },
  });

  // Create individual mutation
  const createIndividualMutation = useMutation({
    mutationFn: async (individualData: InsertIndividualProfile) => {
      const response = await apiRequest("POST", "/api/individuals", individualData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/individuals"] });
      setShowIndividualForm(false);
      setIsCreating(false);
      toast({
        title: t('individualManagement.createSuccessTitle'),
        description: t('individualManagement.createSuccessDescription'),
      });
    },
    onError: (error) => {
      console.error("Lỗi khi tạo hồ sơ:", error);
      toast({
        title: t('individualManagement.createErrorTitle'),
        description: t('individualManagement.createErrorDescription'),
        variant: "destructive",
      });
    },
  });

  // Update individual mutation
  const updateIndividualMutation = useMutation({
    mutationFn: async ({ id, individualData }: { id: number; individualData: UpdateIndividualProfile }) => {
      const response = await apiRequest("PUT", `/api/individuals/${id}`, individualData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/individuals"] });
      setShowIndividualForm(false);
      setSelectedIndividual(null);
      toast({
        title: t('individualManagement.updateSuccessTitle'),
        description: t('individualManagement.updateSuccessDescription'),
      });
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      toast({
        title: t('individualManagement.updateErrorTitle'),
        description: t('individualManagement.updateErrorDescription'),
        variant: "destructive",
      });
    },
  });

  // Delete individual mutation
  const deleteIndividualMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/individuals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/individuals"] });
      toast({
        title: t('individualManagement.deleteSuccessTitle'),
        description: t('individualManagement.deleteSuccessDescription'),
      });
    },
    onError: (error) => {
      console.error("Lỗi khi xóa hồ sơ:", error);
      toast({
        title: t('individualManagement.deleteErrorTitle'),
        description: t('individualManagement.deleteErrorDescription'),
        variant: "destructive",
      });
    },
  });

  // Export data mutation (giữ nguyên nếu bạn muốn export individuals)
  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/google/export"); 
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t('individualManagement.exportSuccessTitle'),
        description: data.message,
      });
    },
    onError: (error) => {
      console.error("Lỗi khi xuất dữ liệu:", error);
      toast({
        title: t('individualManagement.exportErrorTitle'),
        description: t('individualManagement.exportErrorDescription'),
        variant: "destructive",
      });
    },
  });

  const handleCreateIndividual = () => {
    setIsCreating(true);
    setSelectedIndividual(null);
    setShowIndividualForm(true);
  };

  const handleEditIndividual = (individual: IndividualProfile) => {
    setIsCreating(false);
    setSelectedIndividual(individual);
    setShowIndividualForm(true);
  };

  const handleDeleteIndividual = (individual: IndividualProfile) => {
    if (window.confirm(t('individualManagement.confirmDelete', { name: individual.name }))) {
      deleteIndividualMutation.mutate(individual.id);
    }
  };

  const handleSubmitIndividual = async (individualData: InsertIndividualProfile | UpdateIndividualProfile) => {
    if (isCreating) {
      await createIndividualMutation.mutateAsync(individualData as InsertIndividualProfile);
    } else if (selectedIndividual) {
      await updateIndividualMutation.mutateAsync({ 
        id: selectedIndividual.id, 
        individualData: individualData as UpdateIndividualProfile 
      });
    }
  };

  const formatTimeAgo = (date: Date | null | string) => {
    if (!date) return t('individualManagement.lastUpdatedNever');
    const now = new Date();
    const inputDate = new Date(date);
    const diffMs = now.getTime() - inputDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}${t('individualManagement.hoursAgo')}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}${t('individualManagement.daysAgo')}`;
  };

  // --- Tính năng Gemini AI ---
  const callGeminiApi = async (prompt: string): Promise<string> => {
    setIsLlmLoading(true);
    setLlmOutputContent(t('individualManagement.llmLoadingMessage'));

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas sẽ tự động cung cấp API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Lỗi API Gemini: ${response.status} - ${errorData.error?.message || 'Không rõ lỗi'}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error(t('individualManagement.llmNoResponse'));
      }
    } catch (error) {
      console.error("Lỗi gọi Gemini API:", error);
      toast({
        title: t('individualManagement.llmErrorTitle'),
        description: `${t('individualManagement.llmErrorMessage')}: ${(error as Error).message}`,
        variant: "destructive",
      });
      return t('individualManagement.llmErrorFallback');
    } finally {
      setIsLlmLoading(false);
    }
  };

  const handleSummarizeNotes = async (individual: IndividualProfile) => {
    setLlmOutputTitle(t('individualManagement.summarizeNotesTitle', { name: individual.name }));
    setLlmOutputContent("");
    setShowLlmOutputModal(true);
    
    const prompt = t('individualManagement.summarizeNotesPrompt', { name: individual.name, notes: individual.notes || t('individualManagement.noSpecificNotes') });
    const summary = await callGeminiApi(prompt);
    setLlmOutputContent(summary);
  };

  const handleDraftMessage = async (individual: IndividualProfile) => {
    setLlmOutputTitle(t('individualManagement.draftMessageTitle', { name: individual.name }));
    setLlmOutputContent("");
    setShowLlmOutputModal(true);

    const prompt = t('individualManagement.draftMessagePrompt', { name: individual.name, notes: individual.notes || t('individualManagement.noSpecificNotes') });
    const message = await callGeminiApi(prompt);
    setLlmOutputContent(message);
  };

  const handleCopyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = llmOutputContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast({
      title: t('individualManagement.copySuccessTitle'),
      description: t('individualManagement.copySuccessDescription'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">{t('individualManagement.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              {t('sidebar.individualProfiles')}
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                onClick={() => exportDataMutation.mutate()}
                disabled={exportDataMutation.isPending}
                variant="outline"
                size="sm"
                className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
              >
                <Download className="mr-2" size={16} />
                {exportDataMutation.isPending ? t('individualManagement.exportingButton') : t('individualManagement.exportButton')}
              </Button>
              <Button size="sm" className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                <Filter className="mr-2" size={16} />
                {t('individualManagement.filtersButton')}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder={t('individualManagement.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              onClick={handleCreateIndividual}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2" size={16} />
              {t('individualManagement.addIndividualButton')}
            </Button>
          </div>

          {/* Individuals Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.nameHeader')}</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.contactInfoHeader')}</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.addressHeader')}</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.notesHeader')}</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.ageHeader')}</th> {/* THÊM CỘT */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.dobHeader')}</th> {/* THÊM CỘT */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.relationshipStatusHeader')}</th> {/* THÊM CỘT */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.cityHeader')}</th> {/* THÊM CỘT */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.countryHeader')}</th> {/* THÊM CỘT */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.lastUpdated')}</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('individualManagement.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-900">
                {individuals.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-gray-400"> {/* Cập nhật colspan */}
                      {t('individualManagement.noIndividualsFound')} {searchQuery ? t('individualManagement.adjustSearch') : t('individualManagement.getStarted')}
                    </td>
                  </tr>
                ) : (
                  individuals.map((individual) => (
                    <tr key={individual.id} className="hover:bg-gray-800 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 bg-gray-700">
                            {individual.profileImageUrl ? (
                              <AvatarImage src={individual.profileImageUrl} alt={individual.name} />
                            ) : (
                              <AvatarFallback>
                                <User size={16} className="text-gray-300" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{individual.name}</p>
                            <p className="text-sm text-gray-400">{individual.contactInfo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{individual.contactInfo}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{individual.address || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-gray-400">{individual.notes || 'Không có ghi chú'}</p>
                          {individual.notes && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-400 hover:bg-gray-700 hover:text-blue-300 mt-1"
                              onClick={() => handleSummarizeNotes(individual)}
                              disabled={isLlmLoading}
                            >
                              <Sparkles className="mr-1" size={14} /> {t('individualManagement.summarizeNotesButton')}
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{individual.age || 'N/A'}</p> {/* HIỂN THỊ CỘT */}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{individual.dateOfBirth || 'N/A'}</p> {/* HIỂN THỊ CỘT */}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{individual.relationshipStatus || 'N/A'}</p> {/* HIỂN THỊ CỘT */}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{individual.city || 'N/A'}</p> {/* HIỂN THỊ CỘT */}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{individual.country || 'N/A'}</p> {/* HIỂN THỊ CỘT */}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-400">
                          {formatTimeAgo(individual.updatedAt)}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditIndividual(individual)}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditIndividual(individual)}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteIndividual(individual)}
                            className="text-red-500 hover:bg-red-900 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-purple-400 hover:bg-gray-700 hover:text-purple-300"
                            onClick={() => handleDraftMessage(individual)}
                            disabled={isLlmLoading}
                          >
                            <MessageSquare className="mr-1" size={14} /> {t('individualManagement.draftMessageButton')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {individuals.length > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                {t('individualManagement.showingResults', { count: individuals.length })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Form Modal */}
      {showIndividualForm && (
        <Dialog open={showIndividualForm} onOpenChange={setShowIndividualForm}>
          <IndividualForm
            individual={selectedIndividual || undefined}
            onSubmit={handleSubmitIndividual}
            onCancel={() => {
              setShowIndividualForm(false);
              setSelectedIndividual(null);
              setIsCreating(false);
            }}
            isLoading={createIndividualMutation.isPending || updateIndividualMutation.isPending}
          />
        </Dialog>
      )}

      {/* LLM Output Modal */}
      {showLlmOutputModal && (
        <Dialog open={showLlmOutputModal} onOpenChange={setShowLlmOutputModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{llmOutputTitle}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {t('individualManagement.llmOutputDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-gray-800 rounded-lg text-white whitespace-pre-wrap break-words">
              {isLlmLoading ? t('individualManagement.llmLoadingMessage') : llmOutputContent}
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCopyToClipboard} 
                disabled={isLlmLoading || !llmOutputContent}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <ClipboardCopy className="mr-2" size={16} /> {t('individualManagement.copyButton')}
              </Button>
              <Button onClick={() => setShowLlmOutputModal(false)}>{t('individualManagement.closeButton')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
