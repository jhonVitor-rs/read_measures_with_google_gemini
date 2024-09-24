import { LoaderIcon } from "lucide-react";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h2 className="text-4xl font-semibold">Loading...</h2>
      <LoaderIcon className="h-36 w-36 animate-spin text-primary" />
    </div>
  );
}
