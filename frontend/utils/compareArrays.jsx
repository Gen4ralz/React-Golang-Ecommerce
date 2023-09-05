export const compareArrays = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }

  const neww = (object) =>
    JSON.stringify(
      Object.keys(object)
        .sort()
        .map((key) => [key, object[key]])
    );
  array1 = new Set(array1.map(neww));
  return array2.every((object) => array1.has(neww(object)));
};
