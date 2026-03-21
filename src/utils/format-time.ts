//FUNÇÃO QUE TRANSFORMA O HOÁRIO QUE VEM DO BACO DE DADOS, RETIRANDO OS SEGUNDOS

export function formatTime(time: string) {
  return time.slice(0, 5);
}