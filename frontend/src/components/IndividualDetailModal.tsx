// src/components/IndividualDetailModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IndividualProfile } from '@/lib/types';
import { useTranslation } from '@/contexts/language-context';
import { Sparkles, MessageSquare, Edit, ClipboardCopy } from 'lucide-react';

interface IndividualDetailModalProps { 
  individual: IndividualProfile; 
  onClose: () => void; 
  onEdit: (individual: IndividualProfile) => void; 
  onSummarizeNotes: (individual: IndividualProfile) => void; 
  onDraftMessage: (individual: IndividualProfile) => void; 
  isLlmLoading: boolean; 
  llmOutputContent: string; 
  llmOutputTitle: string; 
  showLlmOutputModal: boolean; 
  setShowLlmOutputModal: (open: boolean) => void; 
  handleCopyToClipboard: () => void; 
}

export function IndividualDetailModal({ 
  individual, 
  onClose, 
  onEdit, 
  onSummarizeNotes, 
  onDraftMessage,
  isLlmLoading,
  llmOutputContent,
  llmOutputTitle,
  showLlmOutputModal,
  setShowLlmOutputModal,
  handleCopyToClipboard
}: IndividualDetailModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('individualDetail.title', { name: individual.name })}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('individualDetail.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col">
            <p className="text-sm text-gray-400">{t('individualDetail.name')}:</p>
            <p className="font-medium text-lg">{individual.name}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-400">{t('individualDetail.contactInfo')}:</p>
            <p className="font-medium text-lg">{individual.contactInfo}</p>
          </div>
          {individual.profileImageUrl && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.profileImage')}:</p>
              <img src={individual.profileImageUrl} alt={individual.name} className="w-24 h-24 object-cover rounded-full mt-2" />
            </div>
          )}
          {individual.age && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.age')}:</p>
              <p className="font-medium text-lg">{individual.age}</p>
            </div>
          )}
          {individual.dateOfBirth && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.dob')}:</p>
              <p className="font-medium text-lg">{individual.dateOfBirth}</p>
            </div>
          )}
          {individual.relationshipStatus && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.relationshipStatus')}:</p>
              <p className="font-medium text-lg">{individual.relationshipStatus}</p>
            </div>
          )}
          {individual.trustReputation && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.trustReputation')}:</p>
              <p className="font-medium text-lg">{individual.trustReputation}</p>
            </div>
          )}
          {individual.status && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.status')}:</p>
              <p className="font-medium text-lg">{individual.status}</p>
            </div>
          )}
          {individual.address && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.address')}:</p>
              <p className="font-medium text-lg">{individual.address}</p>
            </div>
          )}
          {individual.city && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.city')}:</p>
              <p className="font-medium text-lg">{individual.city}</p>
            </div>
          )}
          {individual.country && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.country')}:</p>
              <p className="font-medium text-lg">{individual.country}</p>
            </div>
          )}
          {individual.phone && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.phone')}:</p>
              <p className="font-medium text-lg">{individual.phone}</p>
            </div>
          )}
          {individual.occupation && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.occupation')}:</p>
              <p className="font-medium text-lg">{individual.occupation}</p>
            </div>
          )}
          {individual.bio && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.bio')}:</p>
              <p className="font-medium text-lg whitespace-pre-wrap">{individual.bio}</p>
            </div>
          )}
          {individual.interests && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.interests')}:</p>
              <p className="font-medium text-lg">{individual.interests}</p>
            </div>
          )}
          {individual.socialMediaLinks && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.socialMediaLinks')}:</p>
              <p className="font-medium text-lg whitespace-pre-wrap">{individual.socialMediaLinks}</p>
            </div>
          )}
          {individual.emergencyContact && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.emergencyContact')}:</p>
              <p className="font-medium text-lg">{individual.emergencyContact}</p>
            </div>
          )}
          {individual.notes && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{t('individualDetail.notes')}:</p>
              <p className="font-medium text-lg whitespace-pre-wrap">{individual.notes}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-400 hover:bg-gray-700 hover:text-blue-300 mt-2 self-start"
                onClick={() => onSummarizeNotes(individual)}
                disabled={isLlmLoading}
              >
                <Sparkles className="mr-1" size={14} /> {t('individualManagement.summarizeNotesButton')}
              </Button>
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-sm text-gray-400">{t('individualDetail.createdAt')}:</p>
            <p className="font-medium text-lg">{new Date(individual.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-400">{t('individualDetail.updatedAt')}:</p>
            <p className="font-medium text-lg">{individual.updatedAt ? new Date(individual.updatedAt).toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0 pt-4 border-t border-gray-700">
          <Button 
            variant="outline" 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onDraftMessage(individual)}
            disabled={isLlmLoading}
          >
            <MessageSquare className="mr-2" size={16} /> {t('individualManagement.draftMessageButton')}
          </Button>
          <Button 
            variant="outline" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onEdit(individual)}
          >
            <Edit className="mr-2" size={16} /> {t('individualDetail.editButton')}
          </Button>
          <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white">
            {t('individualDetail.closeButton')}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* LLM Output Modal (được truyền từ IndividualManagement) */}
      {showLlmOutputModal && (
        <Dialog open={showLlmOutputModal} onOpenChange={setShowLlmOutputModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
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
    </Dialog>
  );
}

