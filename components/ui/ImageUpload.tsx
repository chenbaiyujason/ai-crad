"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, PencilIcon, Trash2Icon, User2Icon } from "lucide-react";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



type ImageUploadProps = {
  value?: string;
  onChange?: (value?: string) => void;
  onModeChange?: (value?: string) => void;
};






function compressImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not found"));
        return;
      }

      let width = img.width;
      let height = img.height;
      console.log("width", width, ",height", height);

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxWidth) {
        width = (width * maxWidth) / height;
        height = maxWidth;
      }


      console.log("=width", width, ",=height", height);

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve(blob as Blob);
        },
        "image/jpeg",
        0.9
      );
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}

async function toBase64(file: File, maxWidth: number): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const compressedFile = await compressImage(file, maxWidth);
      const fileReader = new FileReader();

      fileReader.readAsDataURL(compressedFile);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

export function ImageUpload({
  value,
  onChange,
  onModeChange,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64 = (await toBase64(file, 1280)) as string;
      console.log("base64", base64);
      onChange?.(base64);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange?.(undefined);
  };

  return (
    <div className="flex flex-grow ">
      <div className="flex flex-col gap-2">
      <div className="relative w-40 h-40">
        {value ? (
          <img src={value} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted rounded-lg">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {value ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-1 bg-danger-foreground/90 hover:bg-danger-foreground absolute bottom-0 right-0"
            onClick={handleRemove}
          >
            <Trash2Icon className="w-4 h-4 text-black" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-1 bg-secondary-foreground/90 hover:bg-secondary-foreground absolute bottom-0 right-0"
            onClick={(e) => {
              e.preventDefault();
              inputRef.current?.click();
            }}
          >
            <PencilIcon className="w-4 h-4 text-black" />
          </Button>
        )}

        {!value && (
          <Input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
          />
        )}
      </div>
      </div>
    </div>
  );
}
