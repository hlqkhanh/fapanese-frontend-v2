import { useEffect, useState, useRef } from "react";
import {
    Plus, MoreHorizontal, Pencil, Trash2,
    FileSpreadsheet, Search, Loader2
} from "lucide-react";
import { toast } from "sonner";

// Import Store & Types
import { useStudentStore } from "@/stores/useStudentStore";
import { type Student, type StudentPayload } from "@/types/student";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UserStatus } from "@/types/userStatus";

// --- Helper hiển thị Badge ---
const getStatusBadge = (status: number) => {
    switch (status) {
        case UserStatus.REJECTED: // -1
            return <Badge variant="destructive">Vô hiệu hóa</Badge>;
        case UserStatus.UNVERIFIED_EMAIL: // 0
            return <Badge variant="secondary" className="bg-gray-400 text-white hover:bg-gray-500">Chưa xác thực</Badge>;
        case UserStatus.VERIFIED_UNACTIVE: // 1
            return <Badge className="bg-yellow-500 hover:bg-yellow-600">Chờ kích hoạt</Badge>;
        case UserStatus.PENDING_APPROVAL: // 2
            return <Badge className="bg-orange-500 hover:bg-orange-600">Chờ duyệt</Badge>;
        case UserStatus.ACTIVE: // 3
            return <Badge className="bg-green-600 hover:bg-green-700">Hoạt động</Badge>;
        default:
            return <Badge variant="outline">Không rõ</Badge>;
    }
};

export default function StudentManagePage() {
    const {
        studentList, loading, fetchStudents,
        createStudent, updateStudent, deleteStudent, uploadStudentExcel
    } = useStudentStore();

    // Local State
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmail, setCurrentEmail] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState<StudentPayload>({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        campus: "",
        status: UserStatus.UNVERIFIED_EMAIL,
    });

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Handlers
    const resetForm = () => {
        setFormData({
            firstName: "", lastName: "", email: "", dateOfBirth: "", campus: "",
            status: UserStatus.UNVERIFIED_EMAIL,
        });
        setCurrentEmail(null);
        setIsEditing(false);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (student: Student) => {
        setIsEditing(true);
        setCurrentEmail(student.email);
        setFormData({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            dateOfBirth: student.dateOfBirth,
            campus: student.campus,
            status: student.status, // Load status hiện tại
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.firstName || !formData.lastName) {
            toast.warning("Vui lòng điền thông tin bắt buộc");
            return;
        }

        if (isEditing && currentEmail) {
            await updateStudent(currentEmail, formData);
        } else {
            await createStudent(formData);
        }
        setIsModalOpen(false);
        resetForm();
    };

    const handleDelete = async (email: string) => {
        if (confirm(`Xóa sinh viên: ${email}?`)) {
            await deleteStudent(email);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadStudentExcel(file);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const filteredStudents = studentList.filter((s) =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* --- HEADER --- */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Sinh viên</h1>
                    <p className="text-muted-foreground">Danh sách và trạng thái hoạt động.</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> Import Excel
                    </Button>
                    <Button onClick={handleOpenCreate} disabled={loading}>
                        <Plus className="mr-2 h-4 w-4" /> Thêm mới
                    </Button>
                </div>
            </div>

            {/* --- SEARCH --- */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên hoặc email..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Họ và Tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Cơ sở</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && studentList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Không tìm thấy sinh viên nào.</TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.email}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={student.avtUrl} />
                                            <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{student.lastName} {student.firstName}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.dateOfBirth}</TableCell>
                                    <TableCell><Badge variant="outline">{student.campus}</Badge></TableCell>
                                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenEdit(student)}><Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student.email)}><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- DIALOG --- */}
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

                                <Select
                                    // 1. Gán giá trị hiện tại từ state
                                    value={formData.campus}
                                    // 2. Cập nhật state khi chọn giá trị mới
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, campus: value }))
                                    }
                                >
                                    {/* Phần nút bấm hiển thị */}
                                    <SelectTrigger id="campus" className="w-full">
                                        <SelectValue placeholder="Chọn cơ sở học tập" />
                                    </SelectTrigger>

                                    {/* Phần danh sách sổ xuống */}
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

                        {/* Select Status - Chỉ hiện khi Edit */}
                        {isEditing && (
                            <div className="grid gap-2">
                                <Label>Trạng thái</Label>
                                <Select
                                    value={formData.status?.toString()}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, status: parseInt(val) as UserStatus }))}
                                >
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