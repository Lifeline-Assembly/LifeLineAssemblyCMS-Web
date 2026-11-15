import React, { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from "react";
import { UploadCloudImageIcon } from "../../assets/svgs";

export type MediaTypeType = 'Audio' | 'Video' | 'Picture' | 'Ebook';

interface MediaUploadFieldProps {
  label: string;
  type: MediaTypeType;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  error?: string;
  accept?: string;
  className?: string;
}

const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  type = "Picture",
  onChange,
  onBlur,
  id,
  name,
  error,
  accept,
  className = ""
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSizeLimit = () => {
    switch (type) {
      case 'Video':
      case 'Audio':
        return 50 * 1024 * 1024; // 50MB
      case 'Picture':
      case 'Ebook':
        return 10 * 1024 * 1024; // 10MB
      default:
        return 5 * 1024 * 1024;
    }
  };

  const getSizeLimitText = () => {
    switch (type) {
      case 'Video':
      case 'Audio':
        return '50MB';
      case 'Picture':
      case 'Ebook':
        return '10MB';
      default:
        return '5MB';
    }
  };

  const getAcceptString = () => {
    if (accept) return accept;
    switch (type) {
      case 'Audio':
        return 'audio/*';
      case 'Video':
        return 'video/*';
      case 'Picture':
        return 'image/*';
      case 'Ebook':
        return '.pdf,.epub,.mobi';
      default:
        return '*';
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      setSizeError(null);
      onChange?.(null);
      return;
    }

    if (selectedFile.size > getSizeLimit()) {
      setSizeError(`File size exceeds the limit of ${getSizeLimitText()}`);
      setFile(null);
      setPreviewUrl(null);
      fileInputRef.current!.value = "";
      onChange?.(null);
      return;
    }

    setSizeError(null);
    setFile(selectedFile);

    if (type !== 'Ebook') {
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }

    onChange?.(selectedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelect(selectedFile);
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    handleFileSelect(droppedFile || null);
  }, []);

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setSizeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange?.(null);
  };

  const renderPreview = () => {
    if (!previewUrl && !file) return null;

    switch (type) {
      case 'Audio':
        return (
          <audio controls className="mt-2 w-full">
            <source src={previewUrl || ''} type={file?.type} />
          </audio>
        );
      case 'Video':
        return (
          <video controls className="mt-2 w-full max-h-64 rounded-lg border">
            <source src={previewUrl || ''} type={file?.type} />
          </video>
        );
      case 'Picture':
        return (
          <img
            src={previewUrl || ''}
            alt="Preview"
            className="mt-2 max-h-64 object-contain rounded-lg border"
          />
        );
      case 'Ebook':
        return file ? (
          <div className="mt-2 p-2 border rounded flex items-center">
            <span className="text-blue-500 mr-2">📚</span>
            <span>{file.name}</span>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="font-medium text-sm text-gray-800">{label}</label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center transition-all
          ${isDragging ? "border-orange-400 bg-orange-50" : "border-orange-300 bg-orange-100/10"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          name={name}
          accept={getAcceptString()}
          onChange={handleFileChange}
          onBlur={onBlur}
          className="hidden"
        />

        {!file ? (
          <>
            <div className="text-orange-500">
              <img src={UploadCloudImageIcon} alt="Upload to the cloud" />
            </div>
            <p className="mt-3 text-gray-700 font-medium">
              Drag your file(s) to start uploading
            </p>
            <p className="text-gray-400 text-sm my-2">OR</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-1.5 border border-orange-400 text-orange-500 rounded-md text-sm hover:bg-orange-50"
            >
              Browse files
            </button>
          </>
        ) : (
          <div className="w-full">
            <p className="font-medium text-gray-800">{file.name}</p>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="mt-1 text-sm text-red-500 hover:underline"
            >
              Remove file
            </button>
            {renderPreview()}
          </div>
        )}
      </div>

      {sizeError && <p className="text-xs text-red-500">{sizeError}</p>}
      {error && !sizeError && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default MediaUploadField;
