const fs = require("fs");
const prompt = require("prompt");
const bcrypt = require("bcrypt");

prompt.start();

const passwordFile = "password.txt";

fs.readFile(passwordFile, "utf8", (err, data) => {
  if (err) {
    console.log("Файл не знайдено або не можна прочитати.");
    return;
  }

  if (data) {
    prompt.get([{ name: "password", hidden: true, replace: "*" }], async (err, result) => {
      if (err) return console.error("Помилка вводу:", err);

      const password = result.password;
      const hash = data.trim();

      const match = await bcrypt.compare(password, hash);
      if (match) {
        console.log("Пароль вірний.");
      } else {
        console.log("Пароль невірний.");
      }
    });
  } else {
    prompt.get([
      { name: "password", hidden: true, replace: "*" },
      { name: "confirmPassword", hidden: true, replace: "*" }
    ], (err, result) => {
      if (err) return console.error("Помилка вводу:", err);

      const { password, confirmPassword } = result;

      if (password !== confirmPassword) {
        console.log("Паролі не співпадають.");
        return;
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return console.error("Помилка при хешуванні паролю:", err);

        fs.writeFile(passwordFile, hashedPassword, (err) => {
          if (err) return console.error("Помилка при записі файлу:", err);
          console.log("Хеш паролю записано в файл.");
        });
      });
    });
  }
});
