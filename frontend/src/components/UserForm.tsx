// src/components/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Shadcn UI Dialog
import { Button } from '@/components/ui/button'; // Shadcn UI Button
import { Input } from '@/components/ui/input';   // Shadcn UI Input
import { Label } from '@/components/ui/label';   // Shadcn UI Label (cần add thêm npx shadcn-ui@latest add label)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Shadcn UI Select (cần add thêm npx shadcn-ui@latest add select)
import { UserProfile, InsertUserProfile, UpdateUserProfile } from '@/lib/types'; // Import types từ lib

interface UserFormProps {
  user?: UserProfile; // Nếu có user, là chế độ edit
  onSubmit: (data: InsertUserProfile | UpdateUserProfile) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [status, setStatus] = useState<UserProfile['status']>(user?.status || 'active');
  const [relationshipStatus, setRelationshipStatus] = useState(user?.relationshipStatus || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAge(user.age ? String(user.age) : '');
      setDateOfBirth(user.dateOfBirth || '');
      setStatus(user.status);
      setRelationshipStatus(user.relationshipStatus || '');
      setCity(user.city || '');
      setCountry(user.country || '');
      setProfileImageUrl(user.profileImageUrl || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: InsertUserProfile | UpdateUserProfile = {
      name,
      email,
      age: age ? parseInt(age) : undefined,
      dateOfBirth: dateOfBirth || undefined,
      status,
      relationshipStatus: relationshipStatus || undefined,
      city: city || undefined,
      country: country || undefined,
      profileImageUrl: profileImageUrl || undefined,
    };
    onSubmit(formData);
  };

  return (
    <Dialog open onOpenChange={onCancel}> {/* open prop thay vì showUserForm */}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng Mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Tên</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">Tuổi</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">Ngày sinh</Label>
            <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Trạng thái</Label>
            <Select onValueChange={(value: UserProfile['status']) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relationshipStatus" className="text-right">Tình trạng QH</Label>
            <Input id="relationshipStatus" value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} className="col-span-3" />
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
              {isLoading ? (user ? 'Đang cập nhật...' : 'Đang thêm...') : (user ? 'Lưu thay đổi' : 'Thêm Người dùng')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
