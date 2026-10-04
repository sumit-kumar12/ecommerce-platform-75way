"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassPanel } from "../ui/GlassPanel";
import styles from "./ProductGallery.module.css";

export function ProductGallery({ images, productName }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <GlassPanel className={styles.primaryMedia}>
        <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src="/placeholder.png" alt={productName} className={styles.primaryImage} style={{ objectFit: 'contain' }} />
      </GlassPanel>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <GlassPanel className={styles.primaryMedia} onClick={() => setLightboxOpen(true)}>
        <Image 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={images[selectedImg]?.url || "/placeholder.png"} 
          alt={productName} 
          className={styles.primaryImage} 
          style={{ objectFit: 'contain' }} 
        />
      </GlassPanel>
      
      {images.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {images.map((img, i) => (
            <button 
              type="button" 
              key={img.id || i} 
              className={`${styles.thumbnailButton} ${i === selectedImg ? styles.thumbnailActive : ""}`} 
              onClick={() => setSelectedImg(i)}
            >
              <Image fill sizes="(max-width: 768px) 33vw, 15vw" src={img.url} alt={productName} className={styles.thumbnailImage} style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div 
          className={styles.lightboxOverlay}
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className={styles.lightboxCloseBtn}
            onClick={() => setLightboxOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div 
            className={styles.lightboxContent}
            onClick={e => e.stopPropagation()}
          >
            <Image 
              fill 
              sizes="100vw"
              src={images[selectedImg]?.url || "/placeholder.png"} 
              alt={productName} 
              style={{ objectFit: 'contain' }}
              className={styles.lightboxImage} 
            />
          </div>
          {images.length > 1 && (
            <div className={styles.lightboxThumbnails} onClick={e => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={img.id || i}
                  className={`${styles.lightboxThumbBtn} ${i === selectedImg ? styles.lightboxThumbActive : ""}`}
                  onClick={() => setSelectedImg(i)}
                >
                  <Image fill sizes="(max-width: 768px) 33vw, 15vw" src={img.url} alt={productName} style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
