import React, { ReactNode } from "react";
import Resumen from "./summary";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface PreviewProps {
  children: ReactNode;
  imageURL: string;
  summary: string | undefined;
  tags: string[] | null;
}

const Preview: React.FC<PreviewProps> = ({
  children,
  summary,
  imageURL,
  tags,
}) => {
  return (
    <div className="flex flex-col">
      <Resumen summary={summary} />
      {imageURL && (
        <div className="w-full h-[300px]">
          <Image
            src={imageURL}
            width={300}
            height={200}
            className="h-[300px] w-auto m-auto p-4"
            alt="image"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2 my-4">
        {tags?.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-sig-gray2 hover:bg-sig-text h-7"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {children}
    </div>
  );
};

export default Preview;
