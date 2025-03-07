"use client";

import {motion, AnimatePresence} from "framer-motion";

type ModalProps = {
    image: string | null;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({image, onClose}) => {
    if (!image) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={onClose}
            >
                <motion.img
                    src={image}
                    alt="Large View"
                    className="max-w-full max-h-full rounded-lg"
                    initial={{scale: 0.8}}
                    animate={{scale: 1}}
                    exit={{scale: 0.8}}
                    onClick={(e: React.MouseEvent<HTMLImageElement>) => e.stopPropagation()}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default Modal;
