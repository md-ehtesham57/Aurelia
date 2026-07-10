import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Minus } from 'lucide-react';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 10;
const ZOOM_STEP = 1.35;

const ImageCropper = ({ file, onCrop, onCancel }) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, tx: 0, ty: 0 });
  const objectUrl = useRef(null);
  const stateRef = useRef({ scale: 1, tx: 0, ty: 0, dispW: 0, dispH: 0, frame: 0 });

  const [img, setImg] = useState({ natW: 0, natH: 0, dispW: 0, dispH: 0 });
  const [frame, setFrame] = useState(0);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  if (!objectUrl.current) {
    objectUrl.current = URL.createObjectURL(file);
  }

  const onImageLoad = useCallback((e) => {
    const el = e.currentTarget;
    const cont = containerRef.current;
    if (!cont) return;

    const crect = cont.getBoundingClientRect();
    const maxW = crect.width - 16;
    const maxH = crect.height - 16;
    const aspect = el.naturalWidth / el.naturalHeight;

    let dispW = el.naturalWidth;
    let dispH = el.naturalHeight;
    if (dispW > maxW) { dispW = maxW; dispH = dispW / aspect; }
    if (dispH > maxH) { dispH = maxH; dispW = dispH * aspect; }

    el.style.width = `${dispW}px`;
    el.style.height = `${dispH}px`;

    const f = Math.min(crect.width * 0.55, crect.height * 0.7, 400);
    const initScale = Math.max(f / dispW, f / dispH);

    setImg({ natW: el.naturalWidth, natH: el.naturalHeight, dispW, dispH });
    setFrame(Math.round(f));
    setScale(initScale);
    stateRef.current = { scale: initScale, tx: 0, ty: 0, dispW, dispH, frame: Math.round(f) };
  }, []);

  useEffect(() => {
    stateRef.current = { scale, tx, ty, dispW: img.dispW, dispH: img.dispH, frame };
  }, [scale, tx, ty, img, frame]);

  const clampTranslate = useCallback((s, tx, ty) => {
    const mw = Math.max(0, ((stateRef.current.dispW * s) - stateRef.current.frame) / 2);
    const mh = Math.max(0, ((stateRef.current.dispH * s) - stateRef.current.frame) / 2);
    return {
      tx: Math.max(-mw, Math.min(mw, tx)),
      ty: Math.max(-mh, Math.min(mh, ty)),
    };
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, tx, ty };
  }, [tx, ty]);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const clamped = clampTranslate(stateRef.current.scale, dragRef.current.tx + dx, dragRef.current.ty + dy);
    setTx(clamped.tx);
    setTy(clamped.ty);
  }, [clampTranslate]);

  const handleMouseUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const adjustZoom = useCallback((dir) => {
    setScale((prev) => {
      const next = dir > 0 ? prev * ZOOM_STEP : prev / ZOOM_STEP;
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
      setTx((tx) => clampTranslate(clamped, tx, 0).tx);
      setTy((ty) => clampTranslate(clamped, 0, ty).ty);
      return clamped;
    });
  }, [clampTranslate]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    adjustZoom(e.deltaY < 0 ? 1 : -1);
  }, [adjustZoom]);

  const zoomIn = useCallback(() => adjustZoom(1), [adjustZoom]);
  const zoomOut = useCallback(() => adjustZoom(-1), [adjustZoom]);

  const handleCrop = useCallback(() => {
    const el = imgRef.current;
    if (!el || !frame) return;
    const s = scale;

    const crect = containerRef.current.getBoundingClientRect();
    const cx = crect.width / 2;
    const cy = crect.height / 2;

    const imgLeft = cx + tx - (img.dispW * s) / 2;
    const imgTop = cy + ty - (img.dispH * s) / 2;
    const frameLeft = cx - frame / 2;
    const frameTop = cy - frame / 2;

    const relX = (frameLeft - imgLeft) / s;
    const relY = (frameTop - imgTop) / s;
    const relW = frame / s;
    const relH = frame / s;

    const natSx = relX * (img.natW / img.dispW);
    const natSy = relY * (img.natH / img.dispH);
    const natSw = relW * (img.natW / img.dispW);
    const natSh = relH * (img.natH / img.dispH);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(natSw);
    canvas.height = Math.round(natSh);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(el, natSx, natSy, natSw, natSh, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
        URL.revokeObjectURL(objectUrl.current);
        onCrop(croppedFile);
      }
    }, 'image/jpeg', 0.92);
  }, [scale, tx, ty, img, frame, file, onCrop]);

  const show = img.dispW > 0 && frame > 0;
  const zoomPct = Math.round(scale * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-bg">
          <h3 className="text-sm font-semibold">Crop Image</h3>
          <p className="text-xs text-text-muted">Drag to reposition · Scroll to zoom</p>
        </div>

        <div
          ref={containerRef}
          className="relative flex-1 flex items-center justify-center overflow-hidden select-none"
          style={{ minHeight: 320, maxHeight: '58vh' }}
          onWheel={handleWheel}
        >
          <img
            ref={imgRef}
            src={objectUrl.current}
            onLoad={onImageLoad}
            alt=""
            className="block max-w-none pointer-events-none"
            style={{ visibility: 'hidden', position: 'absolute', width: 1, height: 1 }}
            draggable={false}
          />

          {show && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute cursor-grab active:cursor-grabbing z-10"
              style={{
                left: `calc(50% + ${tx}px - ${img.dispW * scale / 2}px)`,
                top: `calc(50% + ${ty}px - ${img.dispH * scale / 2}px)`,
                width: img.dispW * scale,
                height: img.dispH * scale,
              }}
            >
              <img
                src={objectUrl.current}
                alt=""
                className="block w-full h-full max-w-none pointer-events-none"
                draggable={false}
              />
            </div>
          )}

          {show && (
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: `calc(50% - ${frame / 2}px)`,
                top: `calc(50% - ${frame / 2}px)`,
                width: frame,
                height: frame,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
              }}
            >
              <div className="absolute inset-0 border-2 border-white" />

              {[
                { top: -2, left: -2 },
                { top: -2, right: -2 },
                { bottom: -2, left: -2 },
                { bottom: -2, right: -2 },
              ].map((pos, i) => (
                <div key={i} className="absolute w-4 h-4 bg-white border border-bg" style={pos} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-bg">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= MIN_ZOOM}
              className="p-1.5 rounded hover:bg-bg transition-colors disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <span className="text-xs font-medium tabular-nums w-12 text-center">{zoomPct}%</span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= MAX_ZOOM}
              className="p-1.5 rounded hover:bg-bg transition-colors disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleCrop} disabled={!show} className="px-5 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-50">
              Crop & Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
