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

interface CircularImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  imageSrc: string;
}

export const CircularImageCropper = ({
  isOpen,
  onClose,
  onSave,
  imageSrc,
}: CircularImageCropperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const CROP_SIZE = 280; // Diameter of circular crop area

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

    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = CROP_SIZE / 2;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    const scaledWidth = imageRef.current.width * zoom;
    const scaledHeight = imageRef.current.height * zoom;

    ctx.save();

    // Create circular clipping region
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // Draw image inside circle
    ctx.drawImage(
      imageRef.current,
      centerX - (scaledWidth / 2) + offsetX,
      centerY - (scaledHeight / 2) + offsetY,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();

    // Draw circular border
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(Math.max(0.5, Math.min(3, value[0])));
  };

  useEffect(() => {
    drawCropPreview();
  }, [zoom, offsetX, offsetY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) * 2;
    const deltaY = (e.clientY - dragStart.y) * 2;

    setOffsetX(Math.max(-150, Math.min(150, offsetX + deltaX)));
    setOffsetY(Math.max(-150, Math.min(150, offsetY + deltaY)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveCrop = () => {
    if (!imageRef.current) return;

    const tempCanvas = document.createElement("canvas");
    const size = 300;
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    // Create circular clipping
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // Draw scaled and positioned image
    const scaledWidth = imageRef.current.width * zoom;
    const scaledHeight = imageRef.current.height * zoom;

    ctx.drawImage(
      imageRef.current,
      centerX - (scaledWidth / 2) + (offsetX * size) / CROP_SIZE,
      centerY - (scaledHeight / 2) + (offsetY * size) / CROP_SIZE,
      scaledWidth,
      scaledHeight
    );

    const croppedImage = tempCanvas.toDataURL("image/png");
    onSave(croppedImage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canvas */}
          <div
            ref={containerRef}
            className="border border-border rounded-lg overflow-hidden bg-black flex items-center justify-center"
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-move"
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
              Drag to reposition inside circle
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-primary overflow-hidden bg-muted flex items-center justify-center">
              <canvas
                className="w-full h-full"
                ref={(el) => {
                  if (el && imageRef.current) {
                    const ctx = el.getContext("2d");
                    if (ctx) {
                      const centerX = el.width / 2;
                      const centerY = el.height / 2;
                      const radius = el.width / 2;

                      ctx.beginPath();
                      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                      ctx.clip();

                      const scaledWidth = imageRef.current.width * zoom;
                      const scaledHeight = imageRef.current.height * zoom;

                      ctx.drawImage(
                        imageRef.current,
                        centerX - (scaledWidth / 2) + (offsetX * el.width) / CROP_SIZE,
                        centerY - (scaledHeight / 2) + (offsetY * el.width) / CROP_SIZE,
                        scaledWidth,
                        scaledHeight
                      );
                    }
                  }
                }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">Preview</p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveCrop}>
            Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
