import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { CameraButton } from "@/components/CameraButton";
import html2canvas from "html2canvas";

/**
 * Camera Component with Selectable Screenshot Feature
 *
 * This component allows users to start the camera, select an area, and take a cropped screenshot.
 *
 * Props:
 * @param {function} onCapture - Function to handle the captured cropped image as a base64 string.
 *
 * State:
 * - isCameraOn: Boolean indicating if the camera is active.
 * - stream: MediaStream object for the webcam feed.
 * - selection: Object storing the selected area's position & dimensions.
 *
 * Refs:
 * - videoRef: Reference to the video element displaying the webcam feed.
 * - canvasRef: Reference to the canvas element used for capturing the photo.
 * - containerRef: Reference to the container that overlays selection on video.
 */

interface CameraProps {
    onCapture: (photo: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [selection, setSelection] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [isSelecting, setIsSelecting] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Effect to update the video source when stream changes
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Start Camera
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setIsCameraOn(true);
        } catch (error) {
            console.error("Camera access denied:", error);
            alert("Please allow camera access.");
        }
    };

    // Handle Mouse Down (Start Selection)
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        setIsSelecting(true);
        const rect = containerRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        setSelection({ x: startX, y: startY, width: 0, height: 0 });
    };

    // Handle Mouse Move (Resize Selection)
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

    // Handle Mouse Up (End Selection)
    const handleMouseUp = () => {
        setIsSelecting(false);
    };

    // Capture Selected Area
    const captureSelection = async () => {
        if (!containerRef.current) return;

        const canvas = await html2canvas(containerRef.current);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Create cropped canvas
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
        onCapture(croppedImage);
    };

    return (
        <div className="bg-[#1F2937] w-[70vw] h-[80vh] flex justify-center items-center">
            {!isCameraOn ? (
                <CameraButton photoFunction={startCamera} text={"Start Camera"} />
            ) : (
                <div className="relative flex flex-col justify-center items-center">
                    <div className="h-[10vh]"></div>

                    {/* Camera View with Selection Overlay */}
                    <div
                        ref={containerRef}
                        className="relative"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        <video ref={videoRef} autoPlay playsInline className="object-cover w-[80vw] h-[60vh]" />
                        <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />

                        {/* Selection Box */}
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

                    <div className="h-[10vh] flex items-center justify-center">
                        <CameraButton photoFunction={captureSelection} text={"Capture Selection"} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Camera;
