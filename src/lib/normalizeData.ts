type DataItem = {
  id: string;
  [key: string]: any;
};

// type NormalizedData<T extends DataItem> = {
//   [key: string]: Omit<T, "id">;
// };
type NormalizedData = {
  [key: string]: DataItem;
};

export function normalizeData(dataArray: DataItem[]): NormalizedData {
  return dataArray.reduce((acc, obj) => {
    acc[obj.id] = obj;
    return acc;
  }, {} as NormalizedData);
}
