const months = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];

export function getMonth(index: number) {
  if (index > 11 || index < 0)
    return months[0];
  return months[index];
}
