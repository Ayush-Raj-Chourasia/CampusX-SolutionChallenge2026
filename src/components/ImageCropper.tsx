import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ZoomIn, Move } from "lucide-react";

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  imageSrc: string;
}

export const ImageCropper = ({
  isOpen,
  onClose,
  onSave,
  imageSrc,
}: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const CROP_SIZE = 300;

  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      drawCropPreview();
    };
  }, [isOpen, imageSrc]);

  const drawCropPreview = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const scaledWidth = imageRef.current.width * zoom;
    const scaledHeight = imageRef.current.height * zoom;

    // Draw the cropped portion
    ctx.drawImage(
      imageRef.current,
      offsetX,
      offsetY,
      scaledWidth,
      scaledHeight,
      (canvasRef.current.width - CROP_SIZE) / 2,
      (canvasRef.current.height - CROP_SIZE) / 2,
      CROP_SIZE,
      CROP_SIZE
    );

    // Draw crop frame
    const x = (canvasRef.current.width - CROP_SIZE) / 2;
    const y = (canvasRef.current.height - CROP_SIZE) / 2;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, CROP_SIZE, CROP_SIZE);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(Math.max(0.5, value[0]));
    drawCropPreview();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) * 2;
    const deltaY = (e.clientY - dragStart.y) * 2;

    setOffsetX(Math.max(-100, Math.min(100, offsetX + deltaX)));
    setOffsetY(Math.max(-100, Math.min(100, offsetY + deltaY)));
    setDragStart({ x: e.clientX, y: e.clientY });

    drawCropPreview();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveCrop = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = CROP_SIZE;
    tempCanvas.height = CROP_SIZE;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    const scaledWidth = imageRef.current.width * zoom;
    const scaledHeight = imageRef.current.height * zoom;

    ctx.drawImage(
      imageRef.current,
      offsetX,
      offsetY,
      scaledWidth,
      scaledHeight,
      0,
      0,
      CROP_SIZE,
      CROP_SIZE
    );

    const croppedImage = tempCanvas.toDataURL("image/jpeg", 0.95);
    onSave(croppedImage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Your Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canvas */}
          <div className="border border-border rounded-lg overflow-hidden bg-muted">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full cursor-move"
            />
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                <span className="text-sm font-medium">Zoom</span>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={handleZoomChange}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground text-center">
                {(zoom * 100).toFixed(0)}%
              </p>
            </div>

            {/* Move Info */}
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
              <Move className="w-4 h-4" />
              Drag to move image inside the frame
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveCrop}>
            Save Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
