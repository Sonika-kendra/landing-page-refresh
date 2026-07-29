import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { ScanQrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { productsApi } from '@/api/products';
import { productPath } from '@/lib/utils';
import type { ShopProduct } from '@/data/shop/products';

const QRScanButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'scanning' | 'looking-up' | 'error'>('scanning');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>();
  const navigate = useNavigate();

  const stopCamera = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const lookupSku = useCallback(async (code: string) => {
    setStatus('looking-up');
    try {
      // ponytail: takes the first search match (name/sku/description regex on the backend);
      // if a scanned code ever collides across products, add an exact-sku endpoint instead.
      const res = await productsApi.list({ search: code, category: 'Jewellery', per_page: 1 });
      const item = (res.data?.items ?? [])[0] as ShopProduct | undefined;
      if (!item) {
        setStatus('error');
        setErrorMessage(`No product found for "${code}".`);
        return;
      }
      setIsOpen(false);
      navigate(productPath(item.category, item.subCategory, item.id));
    } catch {
      setStatus('error');
      setErrorMessage('Could not look up that code. Please try again.');
    }
  }, [navigate]);

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      frameRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    if (result?.data) {
      stopCamera();
      lookupSku(result.data.trim());
      return;
    }
    frameRef.current = requestAnimationFrame(scanFrame);
  }, [lookupSku, stopCamera]);

  const startCamera = useCallback(() => {
    setStatus('scanning');
    setErrorMessage('');
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        frameRef.current = requestAnimationFrame(scanFrame);
      })
      .catch(() => {
        setStatus('error');
        setErrorMessage('Camera access is required to scan a QR code.');
      });
  }, [scanFrame]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }
    startCamera();
    return stopCamera;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Scan QR code"
        title="Scan QR code"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-border bg-background text-foreground/65 transition-colors hover:border-accent/60 hover:text-foreground"
      >
        <ScanQrCode className="h-4 w-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Scan Product QR Code</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full overflow-hidden rounded bg-black">
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {status !== 'scanning' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-4 text-center text-sm text-white">
                {status === 'looking-up' ? 'Looking up product…' : errorMessage}
              </div>
            )}
          </div>
          {status === 'error' && (
            <button
              type="button"
              onClick={startCamera}
              className="w-full rounded bg-accent py-2 text-sm font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            >
              Scan Again
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRScanButton;
