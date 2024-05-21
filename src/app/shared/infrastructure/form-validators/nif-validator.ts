import {AbstractControl, ValidationErrors} from "@angular/forms";

const controlDigits = [
  'T',
  'R',
  'W',
  'A',
  'G',
  'M',
  'Y',
  'F',
  'P',
  'D',
  'X',
  'B',
  'N',
  'J',
  'Z',
  'S',
  'Q',
  'V',
  'H',
  'L',
  'C',
  'K',
  'E',
];

export function nifValidator(control: AbstractControl): ValidationErrors | null {
  const nif = control.value;
  if (!validateDNI(nif) && !validateNIE(nif)) {
    return {dni: nif}
  }

  return null;
}

function validateDNI(dni: unknown): boolean {
  const regex = /^[0-9]{8}[a-zA-Z]$/gi;
  if (typeof dni !== 'string') {
    return false
  }
  if (!regex.test(dni)) {
    return false
  }

  const numbers = parseInt(dni.substring(0, 8));
  const controlDigit = dni[8];

  const rest = numbers % 23;
  return controlDigits[rest] === controlDigit.toUpperCase();
}

function validateNIE(nie: unknown): boolean {
  const regex = /^[xyzXYZ][0-9]{7}[a-zA-Z]$/gi;
  if (typeof nie !== 'string') {
    return false
  }
  if (!regex.test(nie)) {
    return false
  }
  const firstCharacter = nie[0];
  if (!['X', 'Y', 'Z'].includes(firstCharacter.toUpperCase())) {
    return false;
  }

  const characterMapping: { [key: string]: number } = {
    'X': 0,
    'Y': 1,
    'Z': 2,
  };
  const firstDigit = characterMapping[firstCharacter.toUpperCase()];
  const numbers = parseInt(`${firstDigit}${nie.substring(1, 8)}`);

  const controlDigit = nie[8];

  const rest = numbers % 23;
  return controlDigits[rest] === controlDigit.toUpperCase();
}
