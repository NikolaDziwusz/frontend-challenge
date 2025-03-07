"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { openDB } from "idb";
type PhotoContextType = {
    photos: string[];
    addPhoto: (photo: string) => void;
    deletePhoto: (photo: string) => void;
};

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadPhotos = async () => {
            const db = await openDB("photoGalleryDB", 1, {
                upgrade(db) {
                    db.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
                },
            });
            const storedPhotos = await db.getAll("photos");
            setPhotos(storedPhotos.map((p: any) => p.data));
            setIsLoaded(true);
        };
        loadPhotos();
    }, []);

    const addPhoto = async (photo: string) => {
        setPhotos((prev) => [...prev, photo]);
        const db = await openDB("photoGalleryDB", 1);
        await db.add("photos", { data: photo });
    };

    const deletePhoto = async (photo: string) => {
        const db = await openDB("photoGalleryDB", 1);
        await db.delete("photos", photo);
        setPhotos((prev) => prev.filter((p) => p !== photo));
    };

    return (
        <PhotoContext.Provider value={{ photos, addPhoto, deletePhoto }}>
            {isLoaded ? children : <p>Loading...</p>}
        </PhotoContext.Provider>
    );
};

export const usePhotos = () => {
    const context = useContext(PhotoContext);
    if (!context) throw new Error("usePhotos must be used within a PhotoProvider");
    return context;
};