import { clearScreen } from "./utils.js";

const formatTime = (timeInSeconds) => {
  const numberToString = (number) => {
    return String(number).padStart(2, "0");
  };

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds - minutes * 60;
  return `${numberToString(minutes)}:${numberToString(seconds)}`;
};

const printTimeRemaining = (remainingSeconds, message) => {
  clearScreen();
  console.log(`${message}: ${formatTime(remainingSeconds)}`);
};

const timer = (timeoutInMinutes, message) => {
  return new Promise((resolve, _reject) => {
    let remainingSeconds = timeoutInMinutes * 60;

    const interval = setInterval(() => {
      printTimeRemaining(remainingSeconds, message);
      if (remainingSeconds > 0) {
        remainingSeconds = remainingSeconds - 1;
      } else {
        clearInterval(interval);
        resolve(0);
      }
    }, 1000);
  });
};

export default timer;
