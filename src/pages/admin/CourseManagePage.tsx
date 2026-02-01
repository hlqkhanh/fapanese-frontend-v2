import { useEffect, useState, useRef } from "react";
import {
    Plus, Pencil, Trash2, Search, Loader2,
    BookOpen, ImageIcon, UploadCloud
} from "lucide-react";
import { toast } from "sonner";

// Import Store & Types
import { type Course, type CoursePayload } from "@/types/course";
import { fileService } from "@/services/fileService"; // Giả định bạn đã tạo fileService như hướng dẫn trước

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useCourseStore } from "@/stores/useCoureStore";
import type { AxiosError } from "axios";

export default function CourseManagePage() {
    // 1. Store State
    const { courseList, loading, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourseStore();

    // 2. Local State
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    

    const [formData, setFormData] = useState<CoursePayload>({
        courseName: "", description: "", imgUrl: "", price: "", level: "", code: "", title: "", duration: ""
    });

    // 3. Effects
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // 4. Handlers
    const filteredCourses = courseList.filter(c =>
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({ courseName: "", description: "", imgUrl: "", price: "", level: "", code: "", title: "", duration: "" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (course: Course) => {
        setIsEditing(true);
        setCurrentId(course.id);
        setFormData({ ...course });
        setIsModalOpen(true);
    };

    // Logic Upload File
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Ảnh không được vượt quá 10MB");
            return;
        }

        setSelectedFile(file);
        // Tạo URL tạm thời để hiển thị preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        // Giải phóng bộ nhớ khi component unmount
        return () => URL.revokeObjectURL(objectUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let finalImgUrl = formData.imgUrl;

        try {
            setUploading(true);

            // BƯỚC QUAN TRỌNG: Nếu có file mới được chọn, tiến hành upload ngay bây giờ
            if (selectedFile) {
                toast.loading("Đang tải ảnh lên hệ thống...");
                finalImgUrl = await fileService.uploadFile(selectedFile, "fapanese/courses");
            }

            toast.dismiss()
            const payload = { ...formData, imgUrl: finalImgUrl };

            if (isEditing && currentId) {
                await updateCourse(currentId, payload);
            } else {
                await createCourse(payload);
            }

            setIsModalOpen(false);
            resetStates(); // Hàm dọn dẹp state
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi không xác định");
            setUploading(false);
            toast.dismiss();
        }
    };

    const resetStates = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setFormData({ courseName: "", description: "", imgUrl: "", price: "", level: "", code: "", title: "", duration: "" });
    };

    const handleDelete = (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
            deleteCourse(id);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 px-5 py-0 overflow-hidden">
            {/* Toolbar */}
            <div className="flex justify-between items-center shrink-0">
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm mã hoặc tên..."
                        className="pl-8 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleOpenCreate}><Plus className="mr-2 h-4 w-4" /> Thêm khóa học</Button>
            </div>

            {/* Table Area */}
            <div className="border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
                <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 z-20 bg-white border-b shadow-sm">
                        <tr>
                            <th className="h-12 px-4 font-medium w-[100px]">Hình ảnh</th>
                            <th className="h-12 px-4 font-medium">Khóa học</th>
                            <th className="h-12 px-4 font-medium">Mã</th>
                            <th className="h-12 px-4 font-medium">Trình độ</th>
                            <th className="h-12 px-4 font-medium">Giá</th>
                            <th className="h-12 px-4 font-medium text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && courseList.length === 0 ? (
                            <tr><td colSpan={6} className="h-24 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
                        ) : filteredCourses.length === 0 ? (
                            <tr><td colSpan={6} className="h-24 text-center text-muted-foreground">Không tìm thấy khóa học nào.</td></tr>
                        ) : (
                            filteredCourses.map((course) => (
                                <tr key={course.id} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="p-4">
                                        <div className="w-16 h-10 rounded overflow-hidden bg-muted flex items-center justify-center border">
                                            {course.imgUrl ? (
                                                <img src={course.imgUrl} alt={course.courseName} className="object-cover w-full h-full" />
                                            ) : (
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 font-medium">
                                        <div className=" uppercase font-bold">{course.courseName}</div>
                                        <div className="text-xs text-muted-foreground font-normal line-clamp-1 italic">{course.title}</div>
                                    </td>
                                    <td className="px-4"><Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{course.code}</Badge></td>
                                    <td className="px-4">{course.level}</td>
                                    <td className="px-4 font-semibold text-green-600">{course.price}</td>
                                    <td className="px-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEdit(course)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(course.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Dialog Form */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Cập nhật khóa học" : "Tạo khóa học mới"}</DialogTitle>
                        <DialogDescription>Điền đầy đủ các thông tin khóa học bên dưới.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 py-4">
                        {/* Phần Upload Ảnh với Preview */}
                        <div className="col-span-2 space-y-2">
                            <Label>Hình ảnh khóa học</Label>
                            <div className="flex items-center gap-5 p-4 border rounded-lg bg-muted/30">
                                <div className="relative w-40 h-24 border-2 border-dashed rounded-md overflow-hidden bg-white flex items-center justify-center">
                                    {/* Ưu tiên hiển thị previewUrl (ảnh mới chọn) rồi mới đến imgUrl (ảnh cũ từ DB) */}
                                    {(previewUrl || formData.imgUrl) ? (
                                        <img 
                                            src={previewUrl || formData.imgUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 mx-auto opacity-50" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UploadCloud className="mr-2 h-4 w-4" /> Thay đổi ảnh
                                    </Button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 space-y-1">
                            <Label>Tên khóa học <span className="text-red-500">*</span></Label>
                            <Input value={formData.courseName} onChange={e => setFormData({ ...formData, courseName: e.target.value })} required placeholder="VD: Khóa học tiếng Nhật N5" />
                        </div>

                        <div className="space-y-1">
                            <Label>Mã khóa học (Code) <span className="text-red-500">*</span></Label>
                            <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required placeholder="VD: JP-N5-01" />
                        </div>

                        <div className="space-y-1">
                            <Label>Tiêu đề phụ (Title)</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="VD: Nhập môn cho người mới" />
                        </div>

                        <div className="space-y-1">
                            <Label>Trình độ (Level)</Label>
                            <Input value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} placeholder="VD: N5, N4, Beginner" />
                        </div>

                        <div className="space-y-1">
                            <Label>Thời lượng (Duration)</Label>
                            <Input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="VD: 50 Giờ / 3 Tháng" />
                        </div>

                        <div className="space-y-1">
                            <Label>Giá (Price)</Label>
                            <Input value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="VD: 1.500.000 VNĐ" />
                        </div>

                        <div className="col-span-2 space-y-1">
                            <Label>Mô tả chi tiết</Label>
                            <Textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                placeholder="Viết mô tả về mục tiêu khóa học, lộ trình học tập..."
                            />
                        </div>

                        <DialogFooter className="col-span-2 pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="submit" disabled={loading || uploading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Lưu thay đổi" : "Xác nhận tạo"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}