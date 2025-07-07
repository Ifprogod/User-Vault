// src/components/AccountManagement.tsx
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
  Plus, // Giữ lại nếu muốn thêm nút "Thêm tài khoản" thủ công sau này
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Filter,
  User // Icon User
} from "lucide-react";
import { UserProfile } from '@/lib/types'; // Import UserProfile types
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/language-context";

export function AccountManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null); // Không cần state này nếu không có form edit
  // const [showUserForm, setShowUserForm] = useState(false); // Không cần form này nữa
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch users (tài khoản)
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users", searchQuery], // API endpoint cho users
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/users${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
      return response.json() as Promise<UserProfile[]>;
    },
  });

  // Delete user mutation (chỉ cho phép xóa tài khoản, không cho tạo/sửa qua giao diện này)
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/users/${id}`); // API endpoint cho users
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: t('accountManagement.deleteSuccessTitle'),
        description: t('accountManagement.deleteSuccessDescription'),
      });
    },
    onError: (error) => {
      console.error("Lỗi khi xóa tài khoản:", error);
      toast({
        title: t('accountManagement.deleteErrorTitle'),
        description: t('accountManagement.deleteErrorDescription'),
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = (user: UserProfile) => {
    if (window.confirm(t('accountManagement.confirmDelete', { email: user.email }))) {
      deleteUserMutation.mutate(user.id);
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
    if (!date) return t('accountManagement.lastUpdatedNever');
    const now = new Date();
    const inputDate = new Date(date);
    const diffMs = now.getTime() - inputDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}${t('accountManagement.hoursAgo')}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}${t('accountManagement.daysAgo')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">{t('accountManagement.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              {t('sidebar.accountManagement')}
            </CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                <Filter className="mr-2" size={16} />
                {t('accountManagement.filtersButton')}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder={t('accountManagement.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            {/* Nút "Thêm Tài khoản" không cần thiết ở đây vì tài khoản được tạo qua đăng ký */}
            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2" size={16} />
              {t('accountManagement.addAccountButton')}
            </Button> */}
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('accountManagement.nameHeader')}</th> {/* Đã đổi header */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('accountManagement.emailHeader')}</th> {/* Đã đổi header */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('accountManagement.statusHeader')}</th> {/* Đã đổi header */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('accountManagement.lastUpdated')}</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">{t('accountManagement.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-900">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      {t('accountManagement.noAccountsFound')} {searchQuery ? t('accountManagement.adjustSearch') : t('accountManagement.getStarted')}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 bg-gray-700">
                            {user.profileImageUrl ? (
                              <AvatarImage src={user.profileImageUrl} alt={user.name} />
                            ) : (
                              <AvatarFallback>
                                <User size={16} className="text-gray-300" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{user.name}</p> {/* Hiển thị tên */}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{user.email}</p> {/* Hiển thị email */}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-400">
                          {formatTimeAgo(user.updatedAt)}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {/* Không có nút Edit/View ở đây cho tài khoản */}
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
                {t('accountManagement.showingResults', { count: users.length })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
