import React, {useState, useRef, useEffect} from 'react';
import {CameraButton} from "@/components/CameraButton";

/**
 * Camera Component
 *
 * This component provides a simple camera interface using the user's webcam.
 * It allows starting the camera and capturing a photo.
 *
 * Props:
 * @param {function} onCapture - Function to handle the captured photo as a base64 string.
 *
 * State:
 * - isCameraOn: Boolean indicating if the camera is active.
 * - stream: MediaStream object for the webcam feed.
 *
 * Refs:
 * - videoRef: Reference to the video element displaying the webcam feed.
 * - canvasRef: Reference to the canvas element used for capturing the photo.
 */
interface CameraProps {
    onCapture: (photo: string) => void;
}

const Camera: React.FC<CameraProps> = ({onCapture}) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Effect to update the video source when stream changes
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    /**
     * Starts the camera by requesting user media access.
     * If access is denied, an error is logged and an alert is displayed.
     */
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
            setStream(mediaStream);
            setIsCameraOn(true);
        } catch (error) {
            console.error("Camera access denied:", error);
            alert("Please allow camera access.");
        }
    };

    /**
     * Captures a photo from the video stream.
     * The image is drawn on a hidden canvas and converted to a base64 string.
     */
    const takePhoto = () => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL("image/png");
            onCapture(imageData);
        }
    };

    return (
        <div className="bg-[#1F2937] w-[70vw] h-[80vh] flex justify-center items-center">
            {!isCameraOn ? (
                <CameraButton photoFunction={startCamera} text={"Start Camera"}/>
            ) : (
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'h-[10vh]'}></div>
                    <video ref={videoRef} autoPlay playsInline style={{height: '60vh', width: '80vw'}}
                           className={'object-cover'}/>
                    <canvas ref={canvasRef} width="640" height="480" style={{display: 'none'}}/>
                    <div className="h-[10vh] flex items-center justify-center ">
                        <CameraButton photoFunction={takePhoto} text={'Take Photo'}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Camera;
