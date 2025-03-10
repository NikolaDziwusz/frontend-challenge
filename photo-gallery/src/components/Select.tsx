import React, { useState, useRef, MouseEvent } from "react";
import html2canvas from "html2canvas";

interface Selection {
    x: number;
    y: number;
    width: number;
    height: number;
}

const ImageSelector: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [selection, setSelection] = useState<Selection>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Handle image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Start selection
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        setIsSelecting(true);
        const rect = containerRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        setSelection({ x: startX, y: startY, width: 0, height: 0 });
    };

    // Update selection while dragging
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isSelecting || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        setSelection((prev) => ({
            x: prev.x,
            y: prev.y,
            width: Math.max(0, endX - prev.x),
            height: Math.max(0, endY - prev.y),
        }));
    };

    // Stop selection
    const handleMouseUp = () => {
        setIsSelecting(false);
    };

    // Capture the selected area
    const captureSelection = async () => {
        if (!containerRef.current) return;

        const canvas = await html2canvas(containerRef.current);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Create a cropped canvas
        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = selection.width;
        croppedCanvas.height = selection.height;
        const croppedCtx = croppedCanvas.getContext("2d");
        if (!croppedCtx) return;

        croppedCtx.drawImage(
            canvas,
            selection.x,
            selection.y,
            selection.width,
            selection.height,
            0,
            0,
            selection.width,
            selection.height
        );

        // Convert to image and download
        const croppedImage = croppedCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = croppedImage;
        link.download = "screenshot.png";
        link.click();
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
                <div
                    ref={containerRef}
                    style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <img src={image} alt="Upload" style={{ maxWidth: "100%" }} />
                    {selection.width > 0 && selection.height > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: selection.y,
                                left: selection.x,
                                width: selection.width,
                                height: selection.height,
                                border: "2px dashed red",
                                backgroundColor: "rgba(255, 0, 0, 0.2)",
                                pointerEvents: "none",
                            }}
                        ></div>
                    )}
                </div>
            )}
            <br />
            <button onClick={captureSelection} disabled={selection.width === 0 || selection.height === 0}>
                Capture Screenshot
            </button>
        </div>
    );
};

export default ImageSelector;
