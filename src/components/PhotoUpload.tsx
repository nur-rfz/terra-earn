import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  onPhotoCapture: (file: File) => void;
  label: string;
  currentPhoto?: string;
}

export const PhotoUpload = ({ onPhotoCapture, label, currentPhoto }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please select an image under 5MB"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onPhotoCapture(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        {preview && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {preview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-2">
          <Camera className="w-8 h-8 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">No photo yet</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-4 h-4 mr-2" />
        {preview ? "Change Photo" : "Upload Photo"}
      </Button>
    </Card>
  );
};
