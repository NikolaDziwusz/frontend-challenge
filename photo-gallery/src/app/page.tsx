"use client";

import Camera from "@/components/Camera";
import Gallery from "@/components/Gallery";
import {usePhotos} from "@/context/PhotoContext";

export default function Home() {
    const {photos, addPhoto} = usePhotos();

    return (
        <div className="bg-[#111827] min-h-screen flex items-center justify-center">
            <Camera onCapture={addPhoto}/>
            <Gallery/>
        </div>
    );
}
