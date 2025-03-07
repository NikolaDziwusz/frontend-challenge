import React, {useState, useEffect} from 'react';
import {usePhotos} from "@/context/PhotoContext";
import Modal from "@/components/PreviewModal";

/**
 * Gallery Component
 *
 * This component displays a gallery of photos with pagination and deletion capabilities.
 * It leverages a photo context to retrieve the current list of photos and a deletion function.
 * Users can:
 *  - View photos in a paginated grid.
 *  - Delete photos by clicking the delete button on each image.
 *  - Toggle the gallery's visibility on mobile devices.
 *  - Preview a selected photo in a modal window.
 *
 * State Variables:
 * - currentPage: Tracks the current page number for pagination.
 * - selectedImage: Holds the image selected for previewing in the modal.
 * - showGallery: Toggles the gallery's visibility on mobile devices.
 *
 * Constants:
 * - photosPerPage: The number of photos displayed per page.
 * - totalPages: Calculated total number of pages based on the photos count.
 */
const Gallery: React.FC = () => {
    // Retrieve photos and deletePhoto function from the photo context
    const {photos, deletePhoto} = usePhotos();

    // State for current page number in pagination
    const [currentPage, setCurrentPage] = useState(1);
    // State for the currently selected image for previewing in the modal
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // Constant for number of photos per page
    const photosPerPage = 8;
    // Calculate total pages based on the photos array length
    const totalPages = Math.ceil(photos.length / photosPerPage);

    // State to control gallery visibility on mobile devices
    const [showGallery, setShowGallery] = useState(false);

    // Reset current page to 1 whenever the photos array changes
    useEffect(() => {
        setCurrentPage(1);
    }, [photos]);

    // Ensure currentPage does not exceed totalPages
    if (currentPage > totalPages) {
        setCurrentPage(totalPages);
    }

    // Slice the photos array to get the current page's photos
    const paginatedPhotos = photos.slice(
        (currentPage - 1) * photosPerPage,
        currentPage * photosPerPage
    );

    /**
     * Deletes a photo using the deletePhoto function from the context.
     * @param {string} photo - The URL of the photo to be deleted.
     */
    const handleDeletePhoto = async (photo: string) => {
        await deletePhoto(photo);
    };

    return (
        <>
            {/* Mobile Toggle Button for Gallery Visibility */}
            <button
                className={'lg:hidden md:hidden fixed right-6 top-6'}
                onClick={() => setShowGallery((prev) => !prev)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                >
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                </svg>
            </button>

            {/* Gallery Container */}
            <div
                className={`ml-2 p-4 md:w-1/4 lg:md:w-1/4 bg-[#1F2937] h-[80vh] flex flex-col justify-between right-0 absolute w-[80%] lg:static md:static lg:flex md:flex ${showGallery ? 'block' : 'hidden'}`}
            >
                {/* Grid of Paginated Photos */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    {paginatedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={photo}
                                alt={`Captured ${index}`}
                                className="w-full h-24 object-cover rounded cursor-pointer transition-transform transform hover:scale-110"
                                onClick={() => setSelectedImage(photo)}
                            />
                            {/* Delete Button (visible on hover) */}
                            <button
                                className="absolute top-1 right-1 bg-red-500 text-white rounded px-1 hover:bg-red-700 hidden group-hover:block"
                                onClick={() => handleDeletePhoto(photo)}
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-2 bg-[#374151] mt-2 rounded-md">
                    <p className="text-sm md:text-md lg:text-lg xl:text-xl">
                        Showing {currentPage} - {totalPages} of {photos.length} photos
                    </p>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="py-1 text-white rounded disabled:opacity-50"
                    >
                        {'<'}
                    </button>
                    <p className="text-sm md:text-md lg:text-lg xl:text-xl">
                        {currentPage} / {totalPages}
                    </p>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="py-1 text-white rounded disabled:opacity-50"
                    >
                        {'>'}
                    </button>
                </div>

                {/* Modal for Photo Preview */}
                <Modal image={selectedImage} onClose={() => setSelectedImage(null)}/>
            </div>
        </>
    );
};

export default Gallery;
