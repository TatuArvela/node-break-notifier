export const clearScreen = () => {
  process.stdout.write("\x1b[0f");
  console.clear();
};
