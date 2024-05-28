import { useState } from "react";
import ImageList from "./ImageList";
import Upload from "./Upload";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-5 flex flex-col gap-10">
      <Upload isLoading={isLoading} setIsLoading={setIsLoading} />
      <ImageList isLoading={isLoading} />
    </div>
  );
}
