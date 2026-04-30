import { Button } from "../../../components/ui/button";
import { useStyle } from "../../../contexts/style-context/style-context";
import { useCart } from "@/app/hooks/use-cart";
import { useAuth } from "@/app/hooks/use-auth";
import { useNavigate, useParams } from "react-router-dom";

export function BookingButton() {
  const { isAuthenticated } = useAuth();
  const { primaryColor, textButtonColor } = useStyle();
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
      className="relative rounded-full px-5 text-sm"
      style={{
        backgroundColor: primaryColor,
        color: textButtonColor,
      }}
    >
      Agendar
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-black bg-white text-[10px] font-bold text-black">
          {cartCount}
        </span>
      )}
    </Button>
  );
}
