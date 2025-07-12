"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Share2, Bookmark, Twitter, Facebook, Linkedin } from "lucide-react";

interface BlogInteractionsProps {
  title: string;
}

export default function BlogInteractions({ title }: BlogInteractionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const encodedTitle = encodeURIComponent(title);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsBookmarked(!isBookmarked)}
        className={isBookmarked ? "bg-primary-50 text-primary-600" : ""}
      >
        <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('copy')}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="text-blue-500 hover:bg-blue-50"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="text-blue-600 hover:bg-blue-50"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="text-blue-700 hover:bg-blue-50"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
    </div>
  );
}