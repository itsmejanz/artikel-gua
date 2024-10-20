import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PopupCard = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Set the popup to show after 1 second
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000); // Popup akan muncul setelah 1 detik

    return () => {
      clearTimeout(timer); // Clear the timer on component unmount
    };
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleBarcodeClick = () => {
    window.open("https://saweria.co/ahmadafriza", "_blank"); // Ganti "nama_user" dengan username Saweria
  };

  return (
    <>
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }} // Start small and invisible
              animate={{ opacity: 1, scale: 1 }} // Animate to full size and visible
              exit={{ opacity: 0, scale: 0 }} // Shrink and disappear
              transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#FF5C5C]">
                Dukung Saya di Saweria
              </h2>
              <p className="text-gray-700 mb-4">
                Klik barcode di bawah atau scan untuk membeli domain di website ini agar bisa dipublikasikan ke semua user.
              </p>
              {/* Gambar Barcode Saweria dengan efek hover */}
              <img
                src="/saweria.png" // Ganti dengan URL gambar barcode yang valid
                alt="Barcode Saweria"
                className="cursor-pointer mb-4 mx-auto transform transition-transform hover:scale-110 hover:shadow-2xl"
                onClick={handleBarcodeClick}
                style={{ width: "200px", height: "200px" }} // Sesuaikan ukuran barcode
              />
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-[#FF5C5C] text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PopupCard;
