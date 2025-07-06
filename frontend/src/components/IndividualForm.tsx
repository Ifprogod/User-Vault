// src/components/IndividualForm.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Không cần Select cho status nữa nếu IndividualProfile không có status
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndividualProfile, InsertIndividualProfile, UpdateIndividualProfile } from '@/lib/types'; // <-- Import IndividualProfile types

interface IndividualFormProps {
  individual?: IndividualProfile; // Nếu có individual, là chế độ edit
  onSubmit: (data: InsertIndividualProfile | UpdateIndividualProfile) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function IndividualForm({ individual, onSubmit, onCancel, isLoading }: IndividualFormProps) {
  const [name, setName] = useState(individual?.name || '');
  const [contactInfo, setContactInfo] = useState(individual?.contactInfo || '');
  const [address, setAddress] = useState(individual?.address || '');
  const [notes, setNotes] = useState(individual?.notes || '');
  // userId có thể được truyền vào nếu muốn liên kết với user đang đăng nhập
  // const [userId, setUserId] = useState(individual?.userId ? String(individual.userId) : '');

  useEffect(() => {
    if (individual) {
      setName(individual.name);
      setContactInfo(individual.contactInfo);
      setAddress(individual.address || '');
      setNotes(individual.notes || '');
      // setUserId(individual.userId ? String(individual.userId) : '');
    }
  }, [individual]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: InsertIndividualProfile | UpdateIndividualProfile = {
      name,
      contactInfo,
      address: address || undefined,
      notes: notes || undefined,
      // userId: userId ? parseInt(userId) : undefined,
    };
    onSubmit(formData);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{individual ? 'Chỉnh sửa Hồ sơ' : 'Thêm Hồ sơ Mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Tên</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactInfo" className="text-right">Thông tin liên hệ</Label>
            <Input id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Địa chỉ</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Ghi chú</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
          </div>
          {/* Nếu muốn liên kết với User ID, thêm input này */}
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userId" className="text-right">User ID (Liên kết)</Label>
            <Input id="userId" type="number" value={userId} onChange={(e) => setUserId(e.target.value)} className="col-span-3" />
          </div> */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (individual ? 'Đang cập nhật...' : 'Đang thêm...') : (individual ? 'Lưu thay đổi' : 'Thêm Hồ sơ')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
