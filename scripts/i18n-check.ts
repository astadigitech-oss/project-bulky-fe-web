import fs from "fs";
import path from "path";
import ora from "ora";
import chalk from "chalk";

type Messages = Record<string, any>;

const spinner = ora("Checking i18n keys...").start();

function flatten(obj: Messages, prefix = ""): string[] {
  return Object.keys(obj).flatMap((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      return flatten(obj[key], fullKey);
    }

    return fullKey;
  });
}

try {
  const en = JSON.parse(
    fs.readFileSync(path.resolve("messages/en.json"), "utf-8"),
  );
  const id = JSON.parse(
    fs.readFileSync(path.resolve("messages/id.json"), "utf-8"),
  );

  const enKeys = flatten(en);
  const idKeys = flatten(id);

  const missingInId = enKeys.filter((k) => !idKeys.includes(k));
  const missingInEn = idKeys.filter((k) => !enKeys.includes(k));

  if (missingInId.length || missingInEn.length) {
    spinner.fail("Missing i18n keys detected ❌\n");

    if (missingInId.length) {
      console.log(chalk.red("Missing in id.json:"));
      missingInId.forEach((k) => console.log("  -", k));
    }

    if (missingInEn.length) {
      console.log(chalk.red("\nMissing in en.json:"));
      missingInEn.forEach((k) => console.log("  -", k));
    }

    process.exit(1);
  }

  spinner.succeed("All i18n keys are in sync ✅");
} catch (error) {
  spinner.fail("Error reading i18n files");
  console.error(error);
  process.exit(1);
}
