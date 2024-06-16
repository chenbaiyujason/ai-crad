import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(updated_at_str: string): string {
  //字符串转int64时间戳
  const updated_at = parseInt(updated_at_str);

  const now = new Date().getTime();
  const diffInSeconds = (now - updated_at) / 1000;
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (days > 7) {
    const date = new Date(updated_at);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}min ago`;
  } else {
    return "seconds ago";
  }
}


export function validateAndProcessImageUrl(url: string | undefined | null) {
  if (url && url.startsWith("http")) {
    if (url.startsWith("https://story-if")) {
      return `${url}/mw`;
    }
    return url;
  }else{
    return null;
  }
}


export function containsChinese(text: string) {
  return /[\u4e00-\u9fa5]/.test(text);
};

export function isNSFW(text: string, has_chinese: boolean) {
  if (has_chinese) {
    return false;
  }
  return text.toLowerCase().includes("nsfw");
}


export function recomposeDesc(desc: string){
  const descArr = desc.split(",");
  return descArr.slice(2).join(",").trim();
}

export function parseSayText(text: string){
  const parts = text.split(/(\*[^*]+\*)/g);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith("*") && parts[i].endsWith("*")) {
    }else if (parts[i].trim() !== "") {
      return parts[i];
    }
  }
  return "";
}