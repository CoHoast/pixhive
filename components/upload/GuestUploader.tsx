'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Loader2, Check, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface GuestUploaderProps {
  eventId: string;
  eventSlug: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  preview: string;
}

export function GuestUploader({ eventId, eventSlug }: GuestUploaderProps) {
  const [guestName, setGuestName] = useState('');
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic', '.heif'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'done') continue;

      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[i].status = 'uploading';
        return newFiles;
      });

      try {
        const formData = new FormData();
        formData.append('file', files[i].file);
        formData.append('eventId', eventId);
        formData.append('eventSlug', eventSlug);
        if (guestName) {
          formData.append('guestName', guestName);
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i].status = 'done';
          newFiles[i].progress = 100;
          return newFiles;
        });
      } catch (error) {
        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i].status = 'error';
          return newFiles;
        });
      }
    }

    setIsUploading(false);
    
    const successCount = files.filter((f) => f.status === 'done').length;
    if (successCount === files.length) {
      setUploadComplete(true);
      toast.success(`${successCount} photo${successCount > 1 ? 's' : ''} uploaded!`);
    }
  };

  if (uploadComplete) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your photos have been uploaded successfully.
        </p>
        <Button
          onClick={() => {
            setFiles([]);
            setUploadComplete(false);
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Camera className="w-4 h-4 mr-2" />
          Add More Photos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Name Input */}
      <div>
        <Label htmlFor="guest-name" className="text-gray-700">
          Your name (optional)
        </Label>
        <Input
          id="guest-name"
          type="text"
          placeholder="e.g. Aunt Barbara"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
          ${isDragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-purple-600" />
        </div>
        {isDragActive ? (
          <p className="text-purple-600 font-medium">Drop photos here...</p>
        ) : (
          <>
            <p className="text-gray-900 font-medium mb-1">
              Drag & drop photos here
            </p>
            <p className="text-sm text-gray-500">or tap to select from your device</p>
          </>
        )}
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {files.length} photo{files.length > 1 ? 's' : ''} selected
            </span>
            {!isUploading && (
              <button
                onClick={() => setFiles([])}
                className="text-sm text-red-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Status overlay */}
                {file.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                {file.status === 'done' && (
                  <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
                {file.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                )}
                
                {/* Remove button */}
                {file.status === 'pending' && !isUploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={uploadFiles}
        disabled={files.length === 0 || isUploading}
        className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="w-5 h-5 mr-2" />
            Upload {files.length > 0 ? `${files.length} Photo${files.length > 1 ? 's' : ''}` : 'Photos'}
          </>
        )}
      </Button>
    </div>
  );
}
