import { useEffect, useState } from "react";
import {
    Plus, Pencil, Trash2, Search, Loader2,
    ChevronLeft, ChevronRight, CheckCircle, XCircle
} from "lucide-react";

// Import Store & Types
import { useLecturerStore } from "@/stores/useLecturerStore";
import { type Lecturer, type LecturerPayload } from "@/types/lecturer";
import { type LecturerSearchParams } from "@/types/lecturer";
import { UserStatus } from "@/types/userStatus";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Hook debounce (Có thể tách ra file riêng nếu dùng chung)
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
        case UserStatus.REJECTED: return <Badge variant="destructive">Đã từ chối</Badge>;
        case UserStatus.UNVERIFIED_EMAIL: return <Badge variant="secondary">Chưa xác thực</Badge>;
        case UserStatus.PENDING_APPROVAL: return <Badge className="bg-orange-500 hover:bg-orange-600">Chờ duyệt</Badge>;
        case UserStatus.ACTIVE: return <Badge className="bg-green-600 hover:bg-green-700">Hoạt động</Badge>;
        default: return <Badge variant="outline">Không rõ</Badge>;
    }
};

export default function LecturerManagePage() {
    // 1. Lấy state từ Store
    const {
        lecturerList, totalElements, totalPages, loading,
        fetchLecturers, createLecturer, updateLecturer, deleteLecturer, approveLecturer, rejectLecturer
    } = useLecturerStore();

    // 2. Local State cho bộ lọc
    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        keyword: "",
        campus: "all",
        status: "all",
        expertise: "all"
    });
    
    const debouncedKeyword = useDebounce(queryParams.keyword, 500);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmail, setCurrentEmail] = useState<string | null>(null);

    const [formData, setFormData] = useState<LecturerPayload>({
        firstName: "", lastName: "", email: "", dateOfBirth: "", 
        bio: "", expertise: "", status: UserStatus.PENDING_APPROVAL,
    });

    // 4. useEffect: Gọi API khi filter thay đổi
    useEffect(() => {
        const params: LecturerSearchParams = {
            page: queryParams.page,
            size: queryParams.size,
            keyword: debouncedKeyword,
            sortDir: "desc",
            sortBy: "id"
        };
        
        if (queryParams.campus !== "all") params.campus = queryParams.campus;
        if (queryParams.status !== "all") params.status = Number(queryParams.status);
        if (queryParams.expertise !== "all") params.expertise = queryParams.expertise;

        fetchLecturers(params);
    }, [queryParams.page, queryParams.size, queryParams.campus, queryParams.status, queryParams.expertise, debouncedKeyword, fetchLecturers]);

    // Handlers
    const resetForm = () => {
        setFormData({ firstName: "", lastName: "", email: "", dateOfBirth: "", bio: "", expertise: "", status: UserStatus.PENDING_APPROVAL });
        setCurrentEmail(null);
        setIsEditing(false);
    };

    const handleOpenEdit = (lecturer: Lecturer) => {
        setIsEditing(true);
        setCurrentEmail(lecturer.email);
        setFormData({ ...lecturer });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && currentEmail) await updateLecturer(currentEmail, formData);
        else await createLecturer(formData);
        setIsModalOpen(false);
        resetForm();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 px-5 py-0 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-wrap gap-3 items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Tìm giảng viên..." 
                                className="pl-8 bg-white" 
                                value={queryParams.keyword} 
                                onChange={(e) => setQueryParams(p => ({...p, keyword: e.target.value, page: 0}))} 
                            />
                        </div>

                        {/* Filter Expertise */}
                        <Select value={queryParams.expertise} onValueChange={(val) => setQueryParams(p => ({...p, expertise: val, page: 0}))}>
                            <SelectTrigger className="w-full md:w-[150px] bg-white"><SelectValue placeholder="Chuyên môn" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả chuyên môn</SelectItem>
                                <SelectItem value="Java">Java Developer</SelectItem>
                                <SelectItem value="React">React Developer</SelectItem>
                                <SelectItem value="Business">Business Analyst</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={queryParams.status} onValueChange={(val) => setQueryParams(p => ({...p, status: val, page: 0}))}>
                            <SelectTrigger className="w-full md:w-[150px] bg-white"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value={UserStatus.PENDING_APPROVAL.toString()}>Chờ duyệt</SelectItem>
                                <SelectItem value={UserStatus.ACTIVE.toString()}>Hoạt động</SelectItem>
                                <SelectItem value={UserStatus.REJECTED.toString()}>Đã từ chối</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button size="sm" onClick={() => { resetForm(); setIsModalOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Thêm giảng viên</Button>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
                <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 z-20 bg-white border-b">
                        <tr className="hover:bg-muted/50">
                            <th className="h-12 px-4 align-middle font-medium w-[80px]">Avatar</th>
                            <th className="h-12 px-4 align-middle font-medium">Họ và Tên</th>
                            <th className="h-12 px-4 align-middle font-medium">Chuyên môn</th>
                            <th className="h-12 px-4 align-middle font-medium">Trạng thái</th>
                            <th className="h-12 px-4 align-middle font-medium text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="p-4 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
                        ) : lecturerList.length === 0 ? (
                            <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Không tìm thấy giảng viên nào.</td></tr>
                        ) : (
                            lecturerList.map((lecturer) => (
                                <tr key={lecturer.id} className="border-b hover:bg-muted/50">
                                    <td className="p-2 px-4"><Avatar><AvatarImage src={lecturer.avtUrl} /><AvatarFallback>{lecturer.firstName[0]}</AvatarFallback></Avatar></td>
                                    <td className="px-4 font-medium">
                                        <div>{lecturer.lastName} {lecturer.firstName}</div>
                                        <div className="text-xs text-muted-foreground font-normal">{lecturer.email}</div>
                                    </td>
                                    <td className="px-4"><Badge variant="outline">{lecturer.expertise}</Badge></td>
                                    <td className="px-4">{getStatusBadge(lecturer.status)}</td>
                                    <td className="px-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            {/* Nút duyệt nhanh cho trạng thái Chờ duyệt */}
                                            {lecturer.status === UserStatus.PENDING_APPROVAL && (
                                                <>
                                                    <Button variant="ghost" size="icon" title="Duyệt" onClick={() => approveLecturer(lecturer.id)} className="text-green-600 hover:bg-green-50"><CheckCircle className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" title="Từ chối" onClick={() => rejectLecturer(lecturer.id)} className="text-red-500 hover:bg-red-50"><XCircle className="h-4 w-4" /></Button>
                                                </>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(lecturer)} className="text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if(confirm("Xóa giảng viên này?")) deleteLecturer(lecturer.email)}} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between py-2 border-t mt-auto">
                <div className="text-sm text-muted-foreground">Hiển thị <strong>{lecturerList.length}</strong> / <strong>{totalElements}</strong> giảng viên</div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium mr-4">Trang {queryParams.page + 1} / {totalPages || 1}</p>
                    <Button variant="outline" size="sm" onClick={() => setQueryParams(p => ({...p, page: p.page - 1}))} disabled={queryParams.page === 0 || loading}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setQueryParams(p => ({...p, page: p.page + 1}))} disabled={queryParams.page >= totalPages - 1 || loading}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Dialog Form */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Cập nhật giảng viên" : "Thêm giảng viên mới"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2"><Label>Họ</Label><Input name="lastName" value={formData.lastName} onChange={(e) => setFormData(p => ({...p, lastName: e.target.value}))} required /></div>
                            <div className="grid gap-2"><Label>Tên</Label><Input name="firstName" value={formData.firstName} onChange={(e) => setFormData(p => ({...p, firstName: e.target.value}))} required /></div>
                        </div>
                        <div className="grid gap-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} disabled={isEditing} required /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2"><Label>Chuyên môn</Label><Input value={formData.expertise} onChange={(e) => setFormData(p => ({...p, expertise: e.target.value}))} placeholder="VD: Java, React..." required /></div>
                            <div className="grid gap-2">
                                <Label>Ngày sinh</Label>
                                <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData(p => ({...p, dateOfBirth: e.target.value}))} required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Tiểu sử (Bio)</Label>
                            <Textarea value={formData.bio} onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))} placeholder="Mô tả ngắn về giảng viên..." rows={3} />
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
                            <Button type="submit" disabled={loading}>{isEditing ? "Lưu thay đổi" : "Tạo giảng viên"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}