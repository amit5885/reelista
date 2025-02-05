"use client";
import React from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { v4 as uuid } from "uuid";

interface FileUploadProps {
  onSuccessAction: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccessAction,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    console.log("Success", res);
    setUploading(false);
    setError(null);
    onSuccessAction(res);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Please upload a video less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload an Image (jpeg, png, webp)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Please upload an image less than 5MB");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? `video_${uuid()}` : `image_${uuid()}`}
        useUniqueFileName={true}
        validateFile={validateFile}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleStartUpload}
        accept={fileType === "video" ? "video/*" : "image/*"}
        folder={fileType === "video" ? "/videos" : "/images"}
        className="file-input file-input-bordered w-full"
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
