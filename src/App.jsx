import { useState } from "react";
import ImageList from "./ImageList";
import Upload from "./Upload";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Upload isLoading={isLoading} setIsLoading={setIsLoading} />
      <ImageList isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}
