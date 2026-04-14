import { Image, Upload, X } from "lucide-react";
import { useState } from "react";
type PreviewImage = {
    id?: number;
    url: string;
    name: string;
}

interface Props {
    // previews?: PreviewImage[],
    // setPreviews: (image : PreviewImage[]) => void
    images: File[],
    setImages: (file: File[]) => void
}

export default function ImageUpload({ images, setImages } : Props) {
    const [previews, setPreviews] = useState<PreviewImage[]>([])
    // Dialog states
    const [showDialog, setShowDialog] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [imageName, setImageName] = useState('');
    
    // const [formData, setFormData] = useState<CreateArticleRequest>({
    //     title: '',
    //     slug: '',
    //     description: '',
    //     content_md: '',
    //     thumbnail: null,
    //     images: null,
    //     status: 'draft',
    //     tag_ids: []
    // });

    const toSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };
    
    // Xử lý khi chọn files - hiện dialog
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const filesArray = Array.from(files);
        setPendingFiles(filesArray);
        
        setCurrentFileIndex(0);
        const firstFileName = filesArray[0].name.split('.')[0];
        setImageName(toSlug(firstFileName));
        setShowDialog(true);
        
        e.target.value = '';
    };

    // Xác nhận tên ảnh
    const handleConfirmName = () => {
        const currentFile = pendingFiles[currentFileIndex];
        const ext = currentFile.name.split('.').pop();
        const slug = imageName.trim() ? toSlug(imageName) : toSlug(currentFile.name.split('.')[0]);
        const newFileName = `${slug}-${Date.now()}.${ext}`;
        
        const renamedFile = new File([currentFile], newFileName, { type: currentFile.type });
        
        setImages([...images, renamedFile]);

        const newPreview = {
            url: URL.createObjectURL(renamedFile),
            name: renamedFile.name
        };
        setPreviews([...previews, newPreview]);

        if (currentFileIndex < pendingFiles.length - 1) {
            const nextIndex = currentFileIndex + 1;
            setCurrentFileIndex(nextIndex);
            const nextFileName = pendingFiles[nextIndex].name.split('.')[0];
            setImageName(toSlug(nextFileName));
        } else {
            setShowDialog(false);
            setPendingFiles([]);
            setCurrentFileIndex(0);
            setImageName('');
        }
    };

    // Bỏ qua ảnh hiện tại
    const handleSkip = () => {
        if (currentFileIndex < pendingFiles.length - 1) {
            const nextIndex = currentFileIndex + 1;
            setCurrentFileIndex(nextIndex);
            const nextFileName = pendingFiles[nextIndex].name.split('.')[0];
            setImageName(toSlug(nextFileName));
        } else {
            setShowDialog(false);
            setPendingFiles([]);
            setCurrentFileIndex(0);
            setImageName('');
        }
    };

    // Xóa ảnh preview
    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i!== index));
    };
    
    return (
        <div className="">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Ảnh với Đặt Tên</h2>

                {/* Upload Button */}
                <div className="mb-6">
                    <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                        <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600">Chọn ảnh để upload</span>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImage}
                        />
                    </label>
                </div>

                {/* Preview Grid */}
                {previews.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                            aria-label="remove image"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b-lg truncate">
                            {preview.name}
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* Dialog Đặt Tên */}
            {showDialog && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Đặt tên ảnh ({currentFileIndex + 1}/{pendingFiles.length})
                        </h3>
                        <Image className="w-6 h-6 text-blue-500" />
                        </div>

                        {/* Preview ảnh hiện tại */}
                        {pendingFiles[currentFileIndex] && (
                        <div className="mb-4">
                            <img
                            src={URL.createObjectURL(pendingFiles[currentFileIndex])}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                        )}

                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên ảnh (slug):
                        </label>
                        <input
                            type="text"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                            onBlur={(e) => setImageName(toSlug(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="nhap-ten-anh"
                            autoFocus
                            onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleConfirmName();
                            }
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Tên sẽ được tự động chuyển thành slug
                        </p>
                        </div>

                        <div className="flex gap-3">
                        <button
                            onClick={handleSkip}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                            Bỏ qua
                        </button>
                        <button
                            onClick={handleConfirmName}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Xác nhận
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}