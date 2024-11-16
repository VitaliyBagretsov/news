export const convertTZ = (date: Date | string, tzString: string): Date => {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-EN", {timeZone: tzString}));   
}