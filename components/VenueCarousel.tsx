"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./VenueCarousel.module.css";

type Photo = {
  src: string;
  alt: string;
};

type VenueCarouselProps = {
  photos: readonly Photo[];
};

const AUTO_PLAY_MS = 5000;

export function VenueCarousel({ photos }: VenueCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (
      photos.length < 2 ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        setActive((previous) => (previous + 1) % photos.length);
      }
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(interval);
  }, [active, paused, photos.length]);

  function previousPhoto() {
    setActive((current) => (current - 1 + photos.length) % photos.length);
  }

  function nextPhoto() {
    setActive((current) => (current + 1) % photos.length);
  }

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    setPaused(true);
  }

  function onTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    setPaused(false);

    if (!start) return;

    const end = event.changedTouches[0];
    const deltaX = end.clientX - start.x;
    const deltaY = end.clientY - start.y;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) nextPhoto();
      else previousPhoto();
    }
  }

  if (photos.length === 0) return null;

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Fotos do Bellara Recepções"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={styles.track}
          style={{
            transform: `translate3d(-${active * 100}%, 0, 0)`,
          }}
        >
          {photos.map((photo, index) => (
            <div
              className={styles.slide}
              key={photo.src}
              aria-hidden={index !== active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              onClick={previousPhoto}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              onClick={nextPhoto}
              aria-label="Próxima foto"
            >
              <ChevronRight size={22} strokeWidth={1.7} />
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div
          className={styles.indicators}
          aria-label="Escolher foto"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={`${styles.dot} ${
                index === active ? styles.selected : ""
              }`}
              onClick={() => setActive(index)}
              aria-label={`Mostrar foto ${index + 1} de ${photos.length}`}
              aria-pressed={index === active}
            />
          ))}
        </div>
      )}
    </div>
  );
}