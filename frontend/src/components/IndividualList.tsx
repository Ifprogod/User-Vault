// src/components/IndividualList.tsx
import React, { useState, useEffect } from 'react';

interface Individual {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IndividualListProps {
  token: string; // JWT token để xác thực API
  userId: number; // ID của người dùng hiện tại
}

const IndividualList: React.FC<IndividualListProps> = ({ token, userId }) => {
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingIndividual, setEditingIndividual] = useState<Individual | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Hàm lấy danh sách cá thể từ backend
  const fetchIndividuals = async () => {
    setIsLoading(true);
    setMessage('');
    if (!BACKEND_URL) {
      setMessage('Lỗi: VITE_BACKEND_URL chưa được cấu hình.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/individuals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data: Individual[] = await response.json();
        setIndividuals(data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Không thể tải danh sách cá thể.');
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách cá thể:', error);
      setMessage('Lỗi kết nối server khi tải danh sách cá thể.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tải danh sách cá thể khi component được render hoặc token thay đổi
  useEffect(() => {
    if (token && userId) {
      fetchIndividuals();
    }
  }, [token, userId]);

  // Hàm xử lý thêm cá thể mới
  const handleAddIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    if (!BACKEND_URL) {
      setMessage('Lỗi: VITE_BACKEND_URL chưa được cấu hình.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/individuals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Thêm cá thể thành công!');
        setNewName('');
        setNewDescription('');
        fetchIndividuals(); // Tải lại danh sách
      } else {
        setMessage(data.message || 'Thêm cá thể thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi thêm cá thể:', error);
      setMessage('Lỗi kết nối server khi thêm cá thể.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý cập nhật cá thể
  const handleUpdateIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIndividual) return;

    setIsLoading(true);
    setMessage('');
    if (!BACKEND_URL) {
      setMessage('Lỗi: VITE_BACKEND_URL chưa được cấu hình.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/individuals/${editingIndividual.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editingIndividual.name, description: editingIndividual.description }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Cập nhật cá thể thành công!');
        setEditingIndividual(null); // Thoát chế độ chỉnh sửa
        fetchIndividuals(); // Tải lại danh sách
      } else {
        setMessage(data.message || 'Cập nhật cá thể thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật cá thể:', error);
      setMessage('Lỗi kết nối server khi cập nhật cá thể.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý xóa cá thể
  const handleDeleteIndividual = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cá thể này?')) return;

    setIsLoading(true);
    setMessage('');
    if (!BACKEND_URL) {
      setMessage('Lỗi: VITE_BACKEND_URL chưa được cấu hình.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/individuals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Xóa cá thể thành công!');
        fetchIndividuals(); // Tải lại danh sách
      } else {
        setMessage(data.message || 'Xóa cá thể thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi xóa cá thể:', error);
      setMessage('Lỗi kết nối server khi xóa cá thể.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-card p-8 rounded-lg shadow-lg text-foreground">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Quản lý Cá thể</h2>

      {message && (
        <p className={`mb-4 text-center ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      {/* Form thêm mới cá thể */}
      <form onSubmit={handleAddIndividual} className="mb-8 p-6 border border-border rounded-lg bg-muted/20 shadow-sm space-y-4">
        <h3 className="text-xl font-semibold text-primary mb-4">Thêm Cá thể Mới</h3>
        <div>
          <label htmlFor="newName" className="block text-sm font-medium mb-1">Tên Cá thể</label>
          <input
            type="text"
            id="newName"
            className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="newDescription" className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            id="newDescription"
            className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary resize-y"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Đang thêm...' : 'Thêm Cá thể'}
        </button>
      </form>

      {/* Form chỉnh sửa cá thể (hiển thị khi có editingIndividual) */}
      {editingIndividual && (
        <form onSubmit={handleUpdateIndividual} className="mb-8 p-6 border border-accent rounded-lg bg-accent/10 shadow-sm space-y-4">
          <h3 className="text-xl font-semibold text-accent-foreground mb-4">Chỉnh sửa Cá thể (ID: {editingIndividual.id})</h3>
          <div>
            <label htmlFor="editName" className="block text-sm font-medium mb-1">Tên Cá thể</label>
            <input
              type="text"
              id="editName"
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent"
              value={editingIndividual.name}
              onChange={(e) => setEditingIndividual({ ...editingIndividual, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="editDescription" className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              id="editDescription"
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent resize-y"
              value={editingIndividual.description || ''}
              onChange={(e) => setEditingIndividual({ ...editingIndividual, description: e.target.value })}
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-md shadow-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setEditingIndividual(null)}
              disabled={isLoading}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Bảng hiển thị danh sách cá thể */}
      <h3 className="text-xl font-semibold text-primary mb-4">Danh sách Cá thể của bạn ({individuals.length})</h3>
      {isLoading && <p className="text-center text-muted-foreground">Đang tải danh sách...</p>}
      {!isLoading && individuals.length === 0 && (
        <p className="text-center text-muted-foreground">Chưa có cá thể nào. Hãy thêm mới!</p>
      )}
      {!isLoading && individuals.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Tên</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Mô tả</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {individuals.map((individual) => (
                <tr key={individual.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="py-3 px-4 text-sm">{individual.id}</td>
                  <td className="py-3 px-4 text-sm">{individual.name}</td>
                  <td className="py-3 px-4 text-sm">{individual.description || 'Không có mô tả'}</td>
                  <td className="py-3 px-4 text-sm flex space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
                      onClick={() => setEditingIndividual(individual)}
                      disabled={isLoading}
                    >
                      Sửa
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
                      onClick={() => handleDeleteIndividual(individual.id)}
                      disabled={isLoading}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IndividualList;
