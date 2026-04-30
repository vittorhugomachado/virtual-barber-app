import { Button } from "../../../components/ui/button";
import { useStyle } from "../../../contexts/style-context/style-context";
import { useCart } from "@/app/hooks/use-cart";
import { useAuth } from "@/app/hooks/use-auth";
import { useNavigate, useParams } from "react-router-dom";

export function BookingButton({
  isLarger = false,
  tailwindStyle = "",
}: {
  isLarger?: boolean;
  tailwindStyle?: string;
}) {
  const { isAuthenticated } = useAuth();
  const { style } = useStyle();
  const { items } = useCart();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const cartCount = items.length;

  function handleAgendar() {
    if (isAuthenticated) {
      navigate(`/${slug}/agendar`);
    } else {
      navigate(`/${slug}/entrar?from=agendar`);
    }
  }
  return (
    <Button
      onClick={handleAgendar}
      className={`relative rounded-full ${
        isLarger
          ? "fixed bottom-6 left-1/2 z-50 h-10 -translate-x-1/2 px-8 text-lg shadow-2xl"
          : "px-5 text-sm"
      } ${tailwindStyle}`}
      style={{
        backgroundColor: style.primary_color,
        color: style.text_button_color,
      }}
    >
      Agendar
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-black bg-white text-[10px] font-bold text-black">
          {cartCount}
        </span>
      )}
    </Button>
  );
}
