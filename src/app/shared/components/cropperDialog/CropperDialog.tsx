import "./CropperDialog.css";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface CropperDialogProps {
  image: File;
  width: number;
  height: number;
  onSave: (imageUrl: string) => void;
  onCancel: () => void;
};

const CropperDialog = ({ image, width, height, onSave, onCancel }: CropperDialogProps) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) setImageSrc(reader.result.toString());
    };
    reader.readAsDataURL(image);
  }, [image]);

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const base64 = await getCroppedImgAsBase64(imageSrc, croppedAreaPixels);
    onSave(base64); 
  };

  return (
    <div className="cropper-dialog">
      <h1>Por favor ajuste sua foto</h1>
      
      <div className="cropper-container">
        {imageSrc && (<Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={width / height} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={handleCropComplete} />)}
      </div>
      
      <div className="cropper-actions">
        <button className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-save" onClick={handleSave}>Salvar</button>
      </div>
    </div>
  );
};

export default CropperDialog;

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous"); 
    img.src = url;
  });
}

async function getCroppedImgAsBase64(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg");
}