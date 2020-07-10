import * as path from "path";
import * as readline from "readline";
import notifier from "node-notifier";
import timer from "./timer.js";
import { clearScreen } from "./utils.js";

const __dirname = path.resolve();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const timeoutInMinutes = 0.05;

const TIME_REMAINING = "⏰  Aikaa seuraavaan taukomuistutukseen";
const REMINDER_MISSED =
  "🚶  Tauon paikka. Käynnistä kello uudelleen painamalla Enter >";
const ON_EXIT = "👋  Muistathan sitten välillä jaloitella!";

const BREAK_REMINDER_TITLE = "Taukomuistutus";
const BREAK_REMINDER_MESSAGE = `Pidä tauko, ja nouse jaloittelemaan!`;

const breakReminder = {
  title: BREAK_REMINDER_TITLE,
  message: BREAK_REMINDER_MESSAGE,
  icon: path.join(__dirname, "alarm-clock.png"),
  sound: true,
  wait: true,
};

rl.on("close", function () {
  clearScreen();
  console.log(ON_EXIT);
  process.exit(0);
});

const waitForInput = () => {
  clearScreen();
  rl.question(REMINDER_MISSED, () => {
    app();
  });
};

const app = () => {
  timer(timeoutInMinutes, TIME_REMAINING).then(() =>
    notifier.notify(breakReminder, () => {
      waitForInput();
    })
  );
};

app();
