// src/components/UserManagement.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Filter,
  User
} from "lucide-react";
import { UserForm } from "./UserForm";
import { UserProfile, InsertUserProfile, UpdateUserProfile } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users", searchQuery],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/users${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
      return response.json() as Promise<UserProfile[]>;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUserProfile) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowUserForm(false);
      setIsCreating(false);
      toast({
        title: "Thành công",
        description: "Người dùng đã được tạo thành công",
      });
    },
    onError: (error) => {
      console.error("Lỗi khi tạo người dùng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo người dùng",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: UpdateUserProfile }) => {
      const response = await apiRequest("PUT", `/api/users/${id}`, userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowUserForm(false);
      setSelectedUser(null);
      toast({
        title: "Thành công",
        description: "Người dùng đã được cập nhật thành công",
      });
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật người dùng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật người dùng",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Thành công",
        description: "Người dùng đã được xóa thành công",
      });
    },
    onError: (error) => {
      console.error("Lỗi khi xóa người dùng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng",
        variant: "destructive",
      });
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/google/export");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Xuất dữ liệu thành công",
        description: data.message,
      });
    },
    onError: (error) => {
      console.error("Lỗi khi xuất dữ liệu:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xuất dữ liệu",
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = () => {
    setIsCreating(true);
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setIsCreating(false);
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (user: UserProfile) => {
    if (window.confirm(`Mày có chắc chắn muốn xóa ${user.name}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleSubmitUser = async (userData: InsertUserProfile | UpdateUserProfile) => {
    if (isCreating) {
      await createUserMutation.mutateAsync(userData as InsertUserProfile);
    } else if (selectedUser) {
      await updateUserMutation.mutateAsync({ 
        id: selectedUser.id, 
        userData: userData as UpdateUserProfile 
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-500/20 text-green-400",
      pending: "bg-yellow-500/20 text-yellow-400", 
      inactive: "bg-red-500/20 text-red-400"
    };
    return variants[status] || variants.active;
  };

  const formatTimeAgo = (date: Date | null | string) => {
    if (!date) return "Không bao giờ";
    const now = new Date();
    const inputDate = new Date(date);
    const diffMs = now.getTime() - inputDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}h trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d trước`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải người dùng...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              Quản lý Dữ liệu Người dùng
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
                {exportDataMutation.isPending ? "Đang xuất..." : "Xuất"}
              </Button>
              <Button size="sm" className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                <Filter className="mr-2" size={16} />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              onClick={handleCreateUser}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2" size={16} />
              Thêm Người dùng
            </Button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Hồ sơ</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Thông tin cá nhân</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Trạng thái</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Vị trí</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Cập nhật lần cuối</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-900">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      Không tìm thấy người dùng nào. {searchQuery ? "Hãy thử điều chỉnh tìm kiếm của mày." : "Tạo người dùng đầu tiên của mày để bắt đầu."}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 bg-gray-700">
                            <AvatarImage src={user.profileImageUrl || undefined} />
                            <AvatarFallback>
                              <User size={16} className="text-gray-300" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {user.age && <p className="text-white">Tuổi: {user.age}</p>}
                          {user.dateOfBirth && (
                            <p className="text-gray-400">Ngày sinh: {user.dateOfBirth}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <Badge className={getStatusBadge(user.status)}>
                            {user.status}
                          </Badge>
                          {user.relationshipStatus && (
                            <p className="text-gray-400 mt-1">{user.relationshipStatus}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {user.city && <p className="text-white">{user.city}</p>}
                          {user.country && <p className="text-gray-400">{user.country}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-400">
                          {formatTimeAgo(user.updatedAt)}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-500 hover:bg-red-900 hover:text-red-400"
                          >
                            <Trash2 size={16} />
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
          {users.length > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Hiển thị {users.length} kết quả{users.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={selectedUser || undefined}
          onSubmit={handleSubmitUser}
          onCancel={() => {
            setShowUserForm(false);
            setSelectedUser(null);
            setIsCreating(false);
          }}
          isLoading={createUserMutation.isPending || updateUserMutation.isPending}
        />
      )}
    </div>
  );
}
