import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const Upload = ({ isLoading, setIsLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // New state variable
  const inputFileRef = useRef(); // Create a reference

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const fileType = file.type;

    // Check if the file type is one of the allowed types
    if (
      fileType === "image/png" ||
      fileType === "image/jpg" ||
      fileType === "image/jpeg"
    ) {
      setSelectedFile(file);

      // Create a new FileReader object
      const reader = new FileReader();

      // Set the onload function - triggered when the reading is complete
      reader.onload = function (e) {
        setPreviewUrl(e.target.result);
      };

      // Start reading the file as DataURL
      reader.readAsDataURL(file);
    } else {
      alert("Invalid file type. Only PNG, JPG, and JPEG files are allowed.");
    }
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const s3Client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });
    const fileName = selectedFile.name;
    const fileType = selectedFile.type;
    const params = {
      Bucket: "images-of-s3", // Replace with your bucket name
      Key: fileName,
      Body: selectedFile,
      ContentType: fileType,
    };

    setIsLoading(true);

    try {
      await s3Client.send(new PutObjectCommand(params));
      setImageUrl(`https://images-of-s3.s3.amazonaws.com/${fileName}`); // Update with your endpoint

      // Clear the input field
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }

      // Clear the preview
      setPreviewUrl(null);

      // Clear the success message after 10 seconds
      setTimeout(() => {
        setImageUrl(null);
      }, 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-blue-600">
          Upload image to AWS S3
        </h1>
      </div>
      {/* New - Image preview */}
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="Preview" className="h-auto w-72" />
        </div>
      )}
      <div>
        <form onSubmit={uploadImage}>
          {/* <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        ref={inputFileRef} // Attach the reference to the input element
      /> */}
          <div>
            <label
              htmlFor="uploadFile1"
              className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-11 mb-2 fill-gray-500"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              Upload file
              <input
                type="file"
                onChange={onFileChange} // Updated
                ref={inputFileRef} // Attach the reference to the input element
                id="uploadFile1"
                className="hidden"
              />
              <p className="text-xs font-medium text-gray-400 mt-2">
                PNG, JPG, JPEG are Allowed.
              </p>
            </label>
          </div>
          <button
            className="px-6 py-2 bg-sky-600 text-white mt-10"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>
      {imageUrl && (
        <div>
          <p className="text-green-600 text-lg font-semibold">
            Image uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
};

Upload.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default Upload;
