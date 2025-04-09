export const objArrayToValueArray = (objArray: { [key: string]: any }[], key: string) => {
  const valueArray = [];
  objArray.forEach((obj) => {
    valueArray.push(obj[key]);
  });
  return valueArray;
};
