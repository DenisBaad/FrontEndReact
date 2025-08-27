import "./ImageControll.css";
import React, { useState } from "react";
import CropperDialog from "../cropperDialog/CropperDialog";

interface ImageControlProps {
  width: number;
  height: number;
  isRounded: boolean;
  disableClick?: boolean;
  onImageReady: (base64: string) => void;
  imageUrl?: string; 
};

const ImageControl = ({ width, height, isRounded, disableClick, onImageReady, imageUrl }: ImageControlProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowCropper(true);
    }
    e.target.value = "";
  };

  const handleCropSave = (base64: string) => {
    setShowCropper(false);
    if (onImageReady) onImageReady(base64);
  };

  const handleCropCancel = () => setShowCropper(false);

  return (
    <div style={{ width, height, position: "relative" }}>
      {imageUrl ? (
        <img src={imageUrl} width={width} height={height} className={isRounded ? "rounded-image" : "square-image"} alt="preview" style={{ cursor: disableClick ? "default" : "pointer" }} onClick={() => !disableClick && document.getElementById("file-input")?.click()}/>
      ) : (
        <div
          style={{ width, height, backgroundColor: "#cccccc", borderRadius: isRounded ? "50%" : "4px", cursor: disableClick ? "default" : "pointer" }} onClick={() => !disableClick && document.getElementById("file-input")?.click()}/>
      )}

      <input type="file" hidden id="file-input" onChange={handleFileChange} />

      {showCropper && file && (<CropperDialog image={file} width={width} height={height} onSave={handleCropSave} onCancel={handleCropCancel} />)}
    </div>
  );
};

export default ImageControl;