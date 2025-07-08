import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { IndividualProfile, InsertIndividualProfile, UpdateIndividualProfile } from "@/lib/types";

interface IndividualFormProps {
  individual?: IndividualProfile;
  onSubmit: (data: InsertIndividualProfile | UpdateIndividualProfile) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function IndividualForm({ individual, onSubmit, onCancel, isLoading }: IndividualFormProps) {
  const [formData, setFormData] = useState<InsertIndividualProfile>({
    name: individual?.name || "",
    contactInfo: individual?.contactInfo || "",
    profileImageUrl: individual?.profileImageUrl || "",
    age: individual?.age || undefined,
    dateOfBirth: individual?.dateOfBirth || "",
    relationshipStatus: individual?.relationshipStatus || "",
    trustReputation: individual?.trustReputation || "",
    status: individual?.status || "active",
    address: individual?.address || "",
    city: individual?.city || "",
    country: individual?.country || "",
    phone: individual?.phone || "",
    occupation: individual?.occupation || "",
    bio: individual?.bio || "",
    interests: individual?.interests || "",
    socialMediaLinks: individual?.socialMediaLinks || "",
    emergencyContact: individual?.emergencyContact || "",
    notes: individual?.notes || "",
  });

  useEffect(() => {
    if (individual) {
      setFormData({
        name: individual.name || "",
        contactInfo: individual.contactInfo || "",
        profileImageUrl: individual.profileImageUrl || "",
        age: individual.age || undefined,
        dateOfBirth: individual.dateOfBirth || "",
        relationshipStatus: individual.relationshipStatus || "",
        trustReputation: individual.trustReputation || "",
        status: individual.status || "active",
        address: individual.address || "",
        city: individual.city || "",
        country: individual.country || "",
        phone: individual.phone || "",
        occupation: individual.occupation || "",
        bio: individual.bio || "",
        interests: individual.interests || "",
        socialMediaLinks: individual.socialMediaLinks || "",
        emergencyContact: individual.emergencyContact || "",
        notes: individual.notes || "",
      });
    }
  }, [individual]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof InsertIndividualProfile, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700 pb-4">
          <CardTitle className="text-xl font-semibold text-white">
            {individual ? "Chỉnh sửa Hồ sơ Cá nhân" : "Tạo Hồ sơ Cá nhân Mới"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={20} />
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Thông tin Cơ bản</h3>
                
                <div>
                  <Label htmlFor="name">Họ và Tên *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactInfo">Thông tin Liên hệ *</Label>
                  <Input
                    id="contactInfo"
                    value={formData.contactInfo}
                    onChange={(e) => handleChange("contactInfo", e.target.value)}
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="profileImageUrl">URL Ảnh đại diện</Label>
                  <Input
                    id="profileImageUrl"
                    type="url"
                    value={formData.profileImageUrl}
                    onChange={(e) => handleChange("profileImageUrl", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">Tuổi</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age || ""}
                    onChange={(e) => handleChange("age", e.target.value ? parseInt(e.target.value) : undefined)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh (YYYY-MM-DD)</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Status and Relationship */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Trạng thái & Mối quan hệ</h3>
                
                <div>
                  <Label htmlFor="status">Trạng thái Hồ sơ</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="pending">Đang chờ</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="relationshipStatus">Tình trạng Quan hệ</Label>
                  <Select value={formData.relationshipStatus || ""} onValueChange={(value) => handleChange("relationshipStatus", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Chọn tình trạng quan hệ" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      <SelectItem value="single">Độc thân</SelectItem>
                      <SelectItem value="married">Đã kết hôn</SelectItem>
                      <SelectItem value="in-relationship">Đang hẹn hò</SelectItem>
                      <SelectItem value="divorced">Đã ly hôn</SelectItem>
                      <SelectItem value="widowed">Góa phụ/Góa vợ</SelectItem>
                      <SelectItem value="prefer-not-to-say">Không muốn tiết lộ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="trustReputation">Độ tin cậy/Uy tín</Label>
                  <Select value={formData.trustReputation || ""} onValueChange={(value) => handleChange("trustReputation", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Chọn mức độ tin cậy" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      <SelectItem value="very-high">Rất cao</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="very-low">Rất thấp</SelectItem>
                      <SelectItem value="unverified">Chưa xác minh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="occupation">Nghề nghiệp</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">Thành phố</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="country">Quốc gia</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Thông tin Bổ sung</h3>
              
              <div>
                <Label htmlFor="bio">Tiểu sử</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  rows={3}
                  placeholder="Mô tả ngắn gọn về cá nhân này"
                />
              </div>
              
              <div>
                <Label htmlFor="interests">Sở thích (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => handleChange("interests", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="Ví dụ: đọc sách, đi bộ đường dài, nhiếp ảnh"
                />
              </div>
              
              <div>
                <Label htmlFor="socialMediaLinks">Liên kết Mạng xã hội (định dạng JSON)</Label>
                <Textarea
                  id="socialMediaLinks"
                  value={formData.socialMediaLinks}
                  onChange={(e) => handleChange("socialMediaLinks", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  rows={3}
                  placeholder='{"twitter": "https://twitter.com/username", "linkedin": "https://linkedin.com/in/username"}'
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyContact">Liên hệ Khẩn cấp</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="Tên và số điện thoại liên hệ khẩn cấp"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  rows={3}
                  placeholder="Các ghi chú bổ sung về cá nhân này"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="bg-gray-700 hover:bg-gray-600 text-white">
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : (individual ? "Cập nhật Hồ sơ" : "Tạo Hồ sơ")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

