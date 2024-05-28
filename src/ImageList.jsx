import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import LoadingSpinner from "./LoadingSpinner"; // Import LoadingSpinner

const ImageList = ({ isLoading }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const s3Client = new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
          secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
      }); // Replace with your AWS region
      const params = { Bucket: "images-of-s3" }; // Replace with your bucket name
      try {
        const data = await s3Client.send(new ListObjectsV2Command(params));
        setImages(data.Contents.map((obj) => obj.Key));
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-2xl font-bold text-blue-600">All images from S3</h2>
      </div>
      {isLoading ? (
        <LoadingSpinner /> // Use LoadingSpinner when isLoading is true
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="w-full p-1">
                <img
                  key={image}
                  src={`https://images-of-s3.s3.amazonaws.com/${image}`}
                  alt={image}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))
          ) : (
            <p>No images found.</p>
          )}
        </div>
      )}
    </div>
  );
};

ImageList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default ImageList;
