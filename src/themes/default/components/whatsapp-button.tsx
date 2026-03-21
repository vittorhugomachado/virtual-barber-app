import { IoLogoWhatsapp } from "react-icons/io";

export function WhatsappButton({ linkWhatsapp }: { linkWhatsapp: string }) {
  return (
    <a href={linkWhatsapp} target="_blank" className="fixed right-4 bottom-4 z-50">
      {/* Container relativo para empilhar os elementos */}
      <div className="relative">
        {/* Div de fundo (atrás) */}
        <div className="absolute inset-0 w-12 h-12 translate-x-1.5 translate-y-1 rounded-full bg-white -z-10" />
        
        {/* Ícone do WhatsApp (na frente) */}
        <IoLogoWhatsapp className="text-6xl text-green-500 relative z-10" />
      </div>
    </a>
  );
}