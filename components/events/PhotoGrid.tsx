'use client';

import { useState } from 'react';
import { Photo } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Camera, Heart, EyeOff, Download, X } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">No photos yet</p>
          <p className="text-sm text-gray-500">
            Share your QR code or link with guests to start collecting photos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.thumbnail_url || photo.file_url}
              alt={`Photo by ${photo.guest_name || 'Guest'}`}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            
            {/* Favorite indicator */}
            {photo.is_favorite && (
              <div className="absolute top-2 right-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
            )}
            
            {/* Guest name */}
            {photo.guest_name && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                <p className="text-xs text-white truncate">{photo.guest_name}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.file_url}
                alt={`Photo by ${selectedPhoto.guest_name || 'Guest'}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Info bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="font-medium">
                      {selectedPhoto.guest_name || 'Anonymous Guest'}
                    </p>
                    <p className="text-sm text-white/70">
                      {new Date(selectedPhoto.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <EyeOff className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <a href={selectedPhoto.file_url} download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
