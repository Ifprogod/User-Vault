// src/components/IndividualForm.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndividualProfile, InsertIndividualProfile, UpdateIndividualProfile } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components

interface IndividualFormProps {
  individual?: IndividualProfile;
  onSubmit: (data: InsertIndividualProfile | UpdateIndividualProfile) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function IndividualForm({ individual, onSubmit, onCancel, isLoading }: IndividualFormProps) {
  const [name, setName] = useState(individual?.name || '');
  const [contactInfo, setContactInfo] = useState(individual?.contactInfo || '');
  const [address, setAddress] = useState(individual?.address || '');
  const [notes, setNotes] = useState(individual?.notes || '');
  const [age, setAge] = useState<number | ''>(individual?.age || '');
  const [dateOfBirth, setDateOfBirth] = useState(individual?.dateOfBirth || '');
  const [relationshipStatus, setRelationshipStatus] = useState(individual?.relationshipStatus || '');
  const [city, setCity] = useState(individual?.city || '');
  const [country, setCountry] = useState(individual?.country || '');
  const [profileImageUrl, setProfileImageUrl] = useState(individual?.profileImageUrl || '');

  useEffect(() => {
    if (individual) {
      setName(individual.name);
      setContactInfo(individual.contactInfo);
      setAddress(individual.address || '');
      setNotes(individual.notes || '');
      setAge(individual.age || '');
      setDateOfBirth(individual.dateOfBirth || '');
      setRelationshipStatus(individual.relationshipStatus || '');
      setCity(individual.city || '');
      setCountry(individual.country || '');
      setProfileImageUrl(individual.profileImageUrl || '');
    }
  }, [individual]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: InsertIndividualProfile | UpdateIndividualProfile = {
      name,
      contactInfo,
      address: address || undefined,
      notes: notes || undefined,
      age: age === '' ? undefined : Number(age),
      dateOfBirth: dateOfBirth || undefined,
      relationshipStatus: relationshipStatus || undefined,
      city: city || undefined,
      country: country || undefined,
      profileImageUrl: profileImageUrl || undefined,
    };
    onSubmit(formData);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto"> {/* Thêm max-h và overflow */}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">Tuổi</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateOfBirth" className="text-right">Ngày sinh (YYYY-MM-DD)</Label>
            <Input id="dateOfBirth" type="text" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="YYYY-MM-DD" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relationshipStatus" className="text-right">Tình trạng quan hệ</Label>
            <Select onValueChange={setRelationshipStatus} value={relationshipStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Độc thân</SelectItem>
                <SelectItem value="in_relationship">Đang hẹn hò</SelectItem>
                <SelectItem value="married">Đã kết hôn</SelectItem>
                <SelectItem value="complicated">Phức tạp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">Thành phố</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">Quốc gia</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profileImageUrl" className="text-right">URL Ảnh đại diện</Label>
            <Input id="profileImageUrl" value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)} className="col-span-3" />
          </div>
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
