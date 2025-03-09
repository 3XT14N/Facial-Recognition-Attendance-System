import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const ProfilePhotoUpload = ({ photo, setPhoto, setErrors, openCamera }) => {
  const [faceApiReady, setFaceApiReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      console.log("🔄 Loading Face-API models...");
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        console.log("✅ Face-API models loaded successfully!");
        setFaceApiReady(true);
      } catch (error) {
        console.error("❌ Error loading Face-API models:", error);
      }
    };
    loadModels();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          photo: "Please upload a valid image file.",
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = async () => {
          if (faceApiReady) {
            await validateImage(image, reader.result);
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              photo: "Face detection is not ready. Try again.",
            }));
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const validateImage = async (image, imageData) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Detect faces
    const detections = await faceapi.detectAllFaces(
      canvas,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detections.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        photo: "No face detected. Please upload a clear photo.",
      }));
      return;
    }

    if (detections.length > 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        photo: "Multiple faces detected. Please upload a photo with only one face.",
      }));
      return;
    }

    // Check blurriness
    if (isImageBlurry(canvas)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        photo: "The image is too blurry. Please upload a clearer photo.",
      }));
      return;
    }

    // Crop face area
    const { x, y, width, height } = detections[0].box;
    const faceCanvas = document.createElement("canvas");
    const faceCtx = faceCanvas.getContext("2d");
    faceCanvas.width = width;
    faceCanvas.height = height;
    faceCtx.drawImage(image, x, y, width, height, 0, 0, width, height);

    const croppedImageData = faceCanvas.toDataURL("image/png");
    setPhoto(croppedImageData);
    setErrors((prevErrors) => ({ ...prevErrors, photo: "" }));
  };

  const isImageBlurry = (canvas) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const grayscale = [];
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      grayscale.push(
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      );
    }

    let sum = 0;
    let sumSq = 0;

    for (let i = 0; i < grayscale.length; i++) {
      sum += grayscale[i];
      sumSq += grayscale[i] * grayscale[i];
    }

    const mean = sum / grayscale.length;
    const variance = sumSq / grayscale.length - mean * mean;
    const threshold = 300; // Adjust this based on testing

    return variance < threshold;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg"
      />
      <button onClick={openCamera} className="bg-blue-500 text-white px-4 py-2 rounded">
        Open Camera
      </button>
      {photo && (
        <img src={photo} alt="Profile Preview" className="mt-4 w-32 h-32 rounded-full mx-auto" />
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
