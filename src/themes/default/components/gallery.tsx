import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../../../components/ui/carousel";
import type { GalleryImage } from "../../types";

interface GalleryProps {
  images: GalleryImage[];
  barbershopName: string;
}

export function Gallery({ images, barbershopName }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // sincroniza o índice atual do lightbox
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    // sincroniza o contador imediatamente quando o api monta
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // abre lightbox no índice correto
  useEffect(() => {
    if (lightboxIndex !== null && api) {
      api.scrollTo(lightboxIndex, true);
    }
  }, [lightboxIndex, api]);

  // fecha com ESC, navega com setas
  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") api?.scrollPrev();
      if (e.key === "ArrowRight") api?.scrollNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, api]);

  // bloqueia scroll do body quando lightbox aberto
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  if (!images.length) return null;

  return (
    <section className="w-full sm:mx-auto sm:max-w-200 sm:px-4">
      {/* ── desktop grid ── */}
      <div className="hidden sm:block sm:h-105">
        {images.length === 1 && (
          <div
            className="group relative h-full cursor-pointer overflow-hidden rounded-2xl"
            onClick={() => openLightbox(0)}
          >
            <img
              src={images[0].url}
              alt={`${barbershopName} 1`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </div>
        )}

        {images.length === 2 && (
          <div className="grid h-full grid-cols-2 gap-2">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`group relative cursor-pointer overflow-hidden ${i === 0 ? "rounded-l-2xl" : "rounded-r-2xl"}`}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.url}
                  alt={`${barbershopName} ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </div>
            ))}
          </div>
        )}

        {images.length === 3 && (
          <div className="grid h-full grid-cols-[2fr_1fr] gap-2">
            <div
              className="group relative cursor-pointer overflow-hidden rounded-l-2xl"
              onClick={() => openLightbox(0)}
            >
              <img
                src={images[0].url}
                alt={`${barbershopName} 1`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </div>
            <div className="flex flex-col gap-2">
              {[1, 2].map(i => (
                <div
                  key={images[i].id}
                  className={`group relative h-1/2 cursor-pointer overflow-hidden ${i === 1 ? "rounded-tr-2xl" : "rounded-br-2xl"}`}
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={images[i].url}
                    alt={`${barbershopName} ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 4 && (
          <div className="grid h-full grid-cols-[2fr_1fr] gap-2">
            <div
              className="group relative cursor-pointer overflow-hidden rounded-l-2xl"
              onClick={() => openLightbox(0)}
            >
              <img
                src={images[0].url}
                alt={`${barbershopName} 1`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </div>
            <div className="flex flex-col gap-2">
              <div
                className="group relative h-1/2 cursor-pointer overflow-hidden rounded-tr-2xl"
                onClick={() => openLightbox(1)}
              >
                <img
                  src={images[1].url}
                  alt={`${barbershopName} 2`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </div>
              <div
                className="group relative h-1/2 cursor-pointer overflow-hidden rounded-br-2xl"
                onClick={() => openLightbox(2)}
              >
                <img
                  src={images[2].url}
                  alt={`${barbershopName} 3`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                <div className="absolute inset-0 flex items-end justify-end p-3">
                  <span className="rounded-md border border-neutral-300 bg-white/90 px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-sm">
                    Ver todas as fotos
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {images.length >= 5 && (
          <div className="grid h-full grid-cols-[2fr_1fr_1fr] gap-2">
            <div
              className="group relative cursor-pointer overflow-hidden rounded-l-2xl"
              onClick={() => openLightbox(0)}
            >
              <img
                src={images[0].url}
                alt={`${barbershopName} 1`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </div>
            <div className="flex flex-col gap-2">
              {[1, 2].map(i => (
                <div
                  key={images[i].id}
                  className={`group relative h-1/2 cursor-pointer overflow-hidden`}
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={images[i].url}
                    alt={`${barbershopName} ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div
                className="group relative h-1/2 cursor-pointer overflow-hidden rounded-tr-2xl"
                onClick={() => openLightbox(3)}
              >
                <img
                  src={images[3].url}
                  alt={`${barbershopName} 4`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </div>
              <div
                className="group relative h-1/2 cursor-pointer overflow-hidden rounded-br-2xl"
                onClick={() => openLightbox(4)}
              >
                <img
                  src={images[4].url}
                  alt={`${barbershopName} 5`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                {images.length > 5 && (
                  <div className="absolute inset-0 flex items-end justify-end bg-black/30 p-3 transition-colors group-hover:bg-black/40">
                    <span className="rounded-md border border-neutral-300 bg-white/90 px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-sm">
                      Ver todas as fotos
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ── mobile carousel ── */}
      <div className="relative sm:hidden">
        <Carousel opts={{ loop: true, dragFree: false, align: "center" }}>
          <CarouselContent className="ml-0">
            {images.map((img, i) => (
              <CarouselItem
                key={img.id}
                className="basis-full pl-0"
                onClick={() => openLightbox(i)}
              >
                <div className="relative h-56 w-full cursor-pointer overflow-hidden">
                  <img
                    src={img.url}
                    alt={`${barbershopName} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* contador fora do carousel, absoluto sobre tudo */}
        <div className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {current + 1} / {images.length}
        </div>
      </div>
      {/* ── lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={() => setLightboxIndex(null)}
        >
          {/* header fixo com contador e fechar */}
          <div
            className="flex h-14 shrink-0 items-center justify-between px-4"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-sm text-white/60">
              {current + 1} / {images.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          {/* carousel ocupa o resto da tela */}
          <div
            className="flex flex-1 items-center"
            onClick={e => e.stopPropagation()}
          >
            <Carousel
              key={lightboxIndex ?? "closed"}
              setApi={setApi}
              opts={{ loop: true, startIndex: lightboxIndex ?? 0 }}
              className="w-full"
            >
              <CarouselContent>
                {images.map((img, i) => (
                  <CarouselItem key={img.id}>
                    <img
                      src={img.url}
                      alt={`${barbershopName} ${i + 1}`}
                      className="max-h-[80vh] w-full object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:left-0" />
                  <CarouselNext className="right-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:right-0" />
                </>
              )}
            </Carousel>
          </div>
        </div>
      )}
    </section>
  );
}
