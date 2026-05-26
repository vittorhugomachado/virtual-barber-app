export function getReadTime(excerpt: string) {
  const wordsPerMinute = 200; // Média de palavras lidas por minuto
  const words = excerpt.split(" ").length; // Contagem de palavras no texto
  const minutes = Math.ceil(words / wordsPerMinute); // Cálculo do tempo de leitura em minutos
  return `${minutes} min`;
}
