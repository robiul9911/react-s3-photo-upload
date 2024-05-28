import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

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
    <div>
      <h2>Images</h2>
      {images.length > 0 ? (
        images.map((image) => (
          <img
            key={image}
            src={`https://images-of-s3.s3.amazonaws.com/${image}`} // Update with your endpoint
            alt={image}
          />
        ))
      ) : (
        <p>No images found.</p>
      )}
    </div>
  );
};

ImageList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default ImageList;
