function formatFullName(firstname: string, lastname: string): string {
  if (firstname || lastname) {
    const upperLastName = lastname.toUpperCase();
    const fullName = `${upperLastName} ${firstname}`;
    return fullName;
  }
  return '';
}

function tablePartRandomly<T>(array: T[]): T[] {
  if (array.length < 3) {
    return array;
  }

  const nombreObjetsASelectionner = Math.floor(Math.random() * 3) + 3; // Sélectionne 3, 4 ou 5

  const randomList: T[] = [];
  const indicesUtilises: number[] = [];

  while (randomList.length < Math.min(nombreObjetsASelectionner, array.length)) {
    const indiceAleatoire = Math.floor(Math.random() * array.length);

    if (!indicesUtilises.includes(indiceAleatoire)) {
      randomList.push(array[indiceAleatoire]);
      indicesUtilises.push(indiceAleatoire);
    }
  }

  return randomList;
}

export { formatFullName, tablePartRandomly };
