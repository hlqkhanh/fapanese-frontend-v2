import { useEffect, useState, useRef } from "react";
import {
    Plus, Pencil, Trash2,
    FileSpreadsheet, Search, Loader2,
    ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import { toast } from "sonner";

// Import Store & Types
import { useStudentStore } from "@/stores/useStudentStore";
import { type Student, type StudentPayload } from "@/types/student";
import { UserStatus } from "@/types/userStatus";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StudentSearchParams } from "@/types/store";

// Helper hook debounce
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const getStatusBadge = (status: number) => {
    switch (status) {
        case UserStatus.REJECTED: return <Badge variant="destructive">Vô hiệu hóa</Badge>;
        case UserStatus.UNVERIFIED_EMAIL: return <Badge variant="secondary" className="bg-gray-400 text-white">Chưa xác thực</Badge>;
        case UserStatus.VERIFIED_UNACTIVE: return <Badge className="bg-yellow-500 hover:bg-yellow-600">Chờ kích hoạt</Badge>;
        case UserStatus.PENDING_APPROVAL: return <Badge className="bg-orange-500 hover:bg-orange-600">Chờ duyệt</Badge>;
        case UserStatus.ACTIVE: return <Badge className="bg-green-600 hover:bg-green-700">Hoạt động</Badge>;
        default: return <Badge variant="outline">Không rõ</Badge>;
    }
};

export default function StudentManagePage() {
    // 1. Lấy state từ Store
    const {
        studentList, totalElements, totalPages, loading, // State
        fetchStudents, createStudent, updateStudent, deleteStudent, uploadStudentExcel // Actions
    } = useStudentStore();

    // 2. Local State cho bộ lọc
    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        keyword: "",
        campus: "all",
        status: "all"
    });
    
    // 3. Debounce keyword
    const debouncedKeyword = useDebounce(queryParams.keyword, 500);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmail, setCurrentEmail] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<StudentPayload>({
        firstName: "", lastName: "", email: "", dateOfBirth: "", campus: "",
        status: UserStatus.UNVERIFIED_EMAIL,
    });

    // 4. useEffect: Gọi API khi filter/page thay đổi
    useEffect(() => {
        const params: StudentSearchParams = {
            page: queryParams.page,
            size: queryParams.size,
            keyword: debouncedKeyword,
            sortDir: "desc", // Mặc định mới nhất lên đầu
            sortBy: "id"
        };
        
        if (queryParams.campus && queryParams.campus !== "all") params.campus = queryParams.campus;
        if (queryParams.status && queryParams.status !== "all") params.status = Number(queryParams.status);

        fetchStudents(params);
    }, [
        queryParams.page, 
        queryParams.size, 
        queryParams.campus, 
        queryParams.status, 
        debouncedKeyword, 
        fetchStudents
    ]);

    // Handlers thay đổi bộ lọc
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQueryParams(prev => ({ ...prev, keyword: e.target.value, page: 0 }));
    };

    const handleFilterChange = (key: string, value: string) => {
        setQueryParams(prev => ({ ...prev, [key]: value, page: 0 }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setQueryParams(prev => ({ ...prev, page: newPage }));
        }
    };

    // ... (Giữ nguyên các hàm CRUD: handleOpenCreate, handleSubmit, handleDelete...) 
    const resetForm = () => {
        setFormData({ firstName: "", lastName: "", email: "", dateOfBirth: "", campus: "", status: UserStatus.UNVERIFIED_EMAIL });
        setCurrentEmail(null);
        setIsEditing(false);
    };

    const handleOpenCreate = () => { resetForm(); setIsModalOpen(true); };
    
    const handleOpenEdit = (student: Student) => {
        setIsEditing(true);
        setCurrentEmail(student.email);
        setFormData({ ...student });
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.firstName || !formData.lastName) {
            toast.warning("Vui lòng điền thông tin bắt buộc"); return;
        }
        if (isEditing && currentEmail) await updateStudent(currentEmail, formData);
        else await createStudent(formData);
        
        setIsModalOpen(false);
        resetForm();
    };

    const handleDelete = async (email: string) => {
        if (confirm(`Xóa sinh viên: ${email}?`)) await deleteStudent(email);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadStudentExcel(file);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 px-5 py-0 overflow-hidden">
             {/* Toolbar */}
             <div className="flex flex-col gap-4 shrink-0">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm tên, email..." className="pl-8 bg-white" value={queryParams.keyword} onChange={handleSearchChange} />
                        </div>
                        {/* Filter Campus */}
                        <Select value={queryParams.campus} onValueChange={(val) => handleFilterChange("campus", val)}>
                            <SelectTrigger className="w-full md:w-[150px] bg-white">
                                <div className="flex items-center gap-2 text-muted-foreground"><Filter className="h-3.5 w-3.5" /><SelectValue placeholder="Cơ sở" /></div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả cơ sở</SelectItem>
                                <SelectItem value="Quy Nhơn">Quy Nhơn</SelectItem>
                                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                                <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                                <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Filter Status */}
                        <Select value={queryParams.status} onValueChange={(val) => handleFilterChange("status", val)}>
                            <SelectTrigger className="w-full md:w-[150px] bg-white"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value={UserStatus.UNVERIFIED_EMAIL.toString()}>Chưa xác thực</SelectItem>
                                <SelectItem value={UserStatus.ACTIVE.toString()}>Hoạt động</SelectItem>
                                <SelectItem value={UserStatus.PENDING_APPROVAL.toString()}>Chờ duyệt</SelectItem>
                                <SelectItem value={UserStatus.REJECTED.toString()}>Vô hiệu hóa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={loading}><FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> Excel</Button>
                        <Button size="sm" onClick={handleOpenCreate} disabled={loading}><Plus className="mr-2 h-4 w-4" /> Thêm mới</Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className=" border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
                <table className="w-full text-sm text-left caption-bottom">
                    <thead className="sticky top-0 z-20 bg-white shadow-sm [&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 align-middle font-medium w-[80px]">Avatar</th>
                            <th className="h-12 px-4 align-middle font-medium">Họ và Tên</th>
                            <th className="h-12 px-4 align-middle font-medium">Email</th>
                            <th className="h-12 px-4 align-middle font-medium">Ngày sinh</th>
                            <th className="h-12 px-4 align-middle font-medium">Cơ sở</th>
                            <th className="h-12 px-4 align-middle font-medium">Trạng thái</th>
                            <th className="h-12 px-4 align-middle font-medium text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {loading ? (
                            <tr className="border-b"><td colSpan={7} className="p-4 h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
                        ) : studentList.length === 0 ? (
                            <tr className="border-b"><td colSpan={7} className="p-4 h-24 text-center text-muted-foreground">Không tìm thấy sinh viên nào.</td></tr>
                        ) : (
                            studentList.map((student) => (
                                <tr key={student.email} className="border-b hover:bg-muted/50">
                                    <td className="p-2 px-4 align-middle"><Avatar><AvatarImage src={student.avtUrl} /><AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback></Avatar></td>
                                    <td className="px-4 align-middle font-medium">{student.lastName} {student.firstName}</td>
                                    <td className="px-4 align-middle">{student.email}</td>
                                    <td className="px-4 align-middle">{student.dateOfBirth}</td>
                                    <td className="px-4 align-middle"><Badge variant="outline">{student.campus}</Badge></td>
                                    <td className="px-4 align-middle">{getStatusBadge(student.status)}</td>
                                    <td className="px-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(student)} className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(student.email)} className="h-8 w-8 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between shrink-0 py-2 border-t mt-auto">
                <div className="text-sm text-muted-foreground">
                    Hiển thị <strong>{studentList.length}</strong> / <strong>{totalElements}</strong> sinh viên
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium mr-4">Trang {queryParams.page + 1} / {totalPages || 1}</p>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(queryParams.page - 1)} disabled={queryParams.page === 0 || loading}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(queryParams.page + 1)} disabled={queryParams.page >= totalPages - 1 || loading}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Dialog Form (Copy nguyên từ code cũ) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Cập nhật thông tin" : "Thêm sinh viên"}</DialogTitle>
                        <DialogDescription>Nhập đầy đủ thông tin bên dưới.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Họ <span className="text-red-500">*</span></Label>
                                <Input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tên <span className="text-red-500">*</span></Label>
                                <Input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Email <span className="text-red-500">*</span></Label>
                            <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required disabled={isEditing} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Ngày sinh</Label>
                                <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Cơ sở</Label>
                                <Select value={formData.campus} onValueChange={(value) => setFormData((prev) => ({ ...prev, campus: value }))}>
                                    <SelectTrigger id="campus" className="w-full">
                                        <SelectValue placeholder="Chọn cơ sở học tập" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Quy Nhơn">Quy Nhơn</SelectItem>
                                        <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                                        <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                                        <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                                        <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="grid gap-2">
                                <Label>Trạng thái</Label>
                                <Select value={formData.status?.toString()} onValueChange={(val) => setFormData(prev => ({ ...prev, status: parseInt(val) as UserStatus }))}>
                                    <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UserStatus.REJECTED.toString()}>Vô hiệu hóa</SelectItem>
                                        <SelectItem value={UserStatus.UNVERIFIED_EMAIL.toString()}>Chưa xác thực</SelectItem>
                                        <SelectItem value={UserStatus.VERIFIED_UNACTIVE.toString()}>Chờ kích hoạt</SelectItem>
                                        <SelectItem value={UserStatus.PENDING_APPROVAL.toString()}>Chờ duyệt</SelectItem>
                                        <SelectItem value={UserStatus.ACTIVE.toString()}>Hoạt động</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="submit" disabled={loading}>{isEditing ? "Lưu" : "Tạo mới"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}