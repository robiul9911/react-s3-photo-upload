import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const Upload = ({ isLoading, setIsLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const inputFileRef = useRef(); // Create a reference

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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={uploadImage}>
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        ref={inputFileRef} // Attach the reference to the input element
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload Image"}
      </button>
      {imageUrl && "Image uploaded successfully!"}
    </form>
  );
};

Upload.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default Upload;
