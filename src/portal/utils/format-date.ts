export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("pt-BR", { day: "numeric" });
  const month = date.toLocaleDateString("pt-BR", { month: "long" });
  const year = date.toLocaleDateString("pt-BR", { year: "numeric" });
  return `${day} de ${month}, ${year}`;
}
