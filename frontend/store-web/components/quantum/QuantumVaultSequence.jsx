"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./QuantumVaultSequence.module.css";

function buildFrameUrl(framePath, frameNumber, frameExtension) {
  const padded = String(frameNumber).padStart(5, "0");
  return `${framePath}${padded}.${frameExtension}`;
}

export function QuantumVaultSequence({
  frameCount = 192,
  framePath = "/frames/offer-sequence/frame_",
  frameExtension = "jpg",
  startFrame = 0,
  endFrame = 191,
  interactionMode = "click",
  playbackDurationMs = 2600,
  revealTitle = "Quantum Vault Unlocked",
  revealBody = "Priority merchant offer channel is now available.",
  revealCtaLabel = "Claim Offer",
  revealCtaHref = "/deals",
  allowReplay = true,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const playbackStartedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const totalFrames = Math.max(0, frameCount);
  const safeStartFrame = Math.max(0, startFrame);
  const safeEndFrame = Math.max(safeStartFrame, Math.min(endFrame, totalFrames - 1));
  const playableFrameCount = Math.max(1, safeEndFrame - safeStartFrame + 1);

  const progressPercent = useMemo(() => {
    if (!totalFrames) return 100;
    return Math.min(100, Math.round((loadedCount / totalFrames) * 100));
  }, [loadedCount, totalFrames]);

  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const image = imagesRef.current[frameIndex];

    if (!canvas || !container || !image) return;

    const bounds = container.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const scale = Math.min(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const stopPlayback = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    if (!isReady || reducedMotionRef.current) {
      if (isReady && reducedMotionRef.current) {
        drawFrame(safeEndFrame);
        setHasStarted(true);
        setHasCompleted(true);
      }
      return;
    }

    if (playbackStartedRef.current && !allowReplay) {
      return;
    }

    if (playbackStartedRef.current && allowReplay) {
      stopPlayback();
      drawFrame(safeStartFrame);
      playbackStartedRef.current = false;
    }

    playbackStartedRef.current = true;
    setIsPlaying(true);
    setHasStarted(true);
    setHasCompleted(false);

    const startedAt = performance.now();

    const tick = (timestamp) => {
      const elapsed = timestamp - startedAt;
      const progress = Math.min(1, elapsed / playbackDurationMs);
      const frameOffset = Math.min(playableFrameCount - 1, Math.floor(progress * playableFrameCount));
      const currentFrame = safeStartFrame + frameOffset;

      drawFrame(currentFrame);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      drawFrame(safeEndFrame);
      rafRef.current = null;
      setIsPlaying(false);
      setHasCompleted(true);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [allowReplay, drawFrame, isReady, playbackDurationMs, playableFrameCount, safeEndFrame, safeStartFrame, stopPlayback]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      reducedMotionRef.current = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }

    let active = true;
    const nextImages = new Array(totalFrames);

    const loadFrame = (index) => new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve({ index, image });
      image.onerror = () => reject(new Error(`Failed to load frame ${index}`));
      image.src = buildFrameUrl(framePath, index, frameExtension);
    });

    const loadAllFrames = async () => {
      setLoadedCount(0);
      setIsReady(false);
      setHasCompleted(false);
      setHasStarted(false);
      playbackStartedRef.current = false;

      const framePromises = Array.from({ length: totalFrames }, (_, index) =>
        loadFrame(index).then((result) => {
          if (!active) return result;
          nextImages[result.index] = result.image;
          setLoadedCount((current) => current + 1);
          return result;
        })
      );

      try {
        await Promise.all(framePromises);
        if (!active) return;
        imagesRef.current = nextImages;
        setIsReady(true);
        drawFrame(safeStartFrame);

        if (reducedMotionRef.current) {
          drawFrame(safeEndFrame);
          setHasCompleted(true);
          setHasStarted(true);
        }
      } catch {
        if (!active) return;
        imagesRef.current = nextImages.filter(Boolean);
        setIsReady(imagesRef.current.length > 0);
        if (imagesRef.current[safeStartFrame]) {
          drawFrame(safeStartFrame);
        }
      }
    };

    void loadAllFrames();

    return () => {
      active = false;
      // Explicitly clear image refs to assist Garbage Collection
      if (imagesRef.current) {
        imagesRef.current.forEach((img) => {
          if (img) {
            img.src = "";
            img.onload = null;
            img.onerror = null;
          }
        });
        imagesRef.current = [];
      }
    };
  }, [drawFrame, frameExtension, framePath, safeEndFrame, safeStartFrame, totalFrames]);

  useEffect(() => {
    if (!isReady) return undefined;

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return undefined;

    resizeObserverRef.current = new ResizeObserver(() => {
      const frameToDraw = hasCompleted ? safeEndFrame : safeStartFrame;
      drawFrame(frameToDraw);
    });
    resizeObserverRef.current.observe(container);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [drawFrame, hasCompleted, isReady, safeEndFrame, safeStartFrame]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPlayback();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stopPlayback]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  return (
    <div
      ref={containerRef}
      className={styles.sequenceShell}
      onMouseEnter={interactionMode === "hover" ? startPlayback : undefined}
    >
      <canvas ref={canvasRef} className={styles.canvas} />

      {!isReady ? (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderStack}>
            <span className={styles.loaderEyebrow}>Quantum Vault Sequence</span>
            <strong className={styles.loaderText}>DECRYPTING PAYLOAD: {String(progressPercent).padStart(2, "0")}%</strong>
            <div className={styles.loaderTrack}>
              <div className={styles.loaderFill} style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
      ) : null}

      {isReady && !hasStarted && interactionMode === "click" ? (
        <div className={styles.actionOverlay}>
          <div className={styles.actionStack}>
            <div className={styles.hoverPrompt}>
              <span className="material-symbols-outlined">memory</span>
              <span>HTML5 canvas sequence ready</span>
            </div>
            <button type="button" className={styles.decryptButton} onClick={startPlayback}>
              <span className="material-symbols-outlined">lock_open</span>
              <span>Decrypt</span>
            </button>
          </div>
        </div>
      ) : null}

      {isReady && !hasStarted && interactionMode === "hover" ? (
        <div className={styles.actionOverlay}>
          <div className={styles.hoverPrompt}>
            <span className="material-symbols-outlined">ads_click</span>
            <span>Hover to decrypt</span>
          </div>
          <button type="button" className={styles.decryptButtonMobile} onClick={startPlayback}>
            <span className="material-symbols-outlined">play_arrow</span>
            <span>Decrypt</span>
          </button>
        </div>
      ) : null}

      {isReady && !hasStarted && !reducedMotionRef.current ? (
        <div className={styles.telemetryOverlay}>
          <div className={styles.telemetryStack}>
            <span>SYS.OK [0x8A7]</span>
            <span>DECRYPT.READY</span>
          </div>
        </div>
      ) : null}

      {isPlaying ? (
        <div className={styles.telemetryOverlayActive}>
          <div className={styles.telemetryStack}>
            <span>DECRYPTING PAYLOAD_</span>
            <span className={styles.telemetryBlink}>OVERRIDE ACTIVE</span>
            <span>CYBER_PROT_ON</span>
            <span className={styles.telemetryFrame}>FRM_SYNC</span>
          </div>
        </div>
      ) : null}

      {hasCompleted ? (
        <div className={styles.revealOverlay}>
          <span className={styles.revealEyebrow}>Secure Offer Channel</span>
          <h3 className={styles.revealTitle}>{revealTitle}</h3>
          <p className={styles.revealBody}>{revealBody}</p>
          <div className={styles.revealActions}>
            <Link href={revealCtaHref} className={styles.revealCta}>
              <span>{revealCtaLabel}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            {allowReplay ? (
              <button type="button" className={styles.replayButton} onClick={startPlayback}>
                <span className="material-symbols-outlined">replay</span>
                <span>Replay</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
