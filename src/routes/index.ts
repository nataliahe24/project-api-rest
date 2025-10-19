import { Router } from "express";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PATH_ROUTER = join(__dirname);
const router = Router();

const cleanFileName = (fileName: string) => {
  const file = fileName.split(".")[0];
  return file;
};

readdirSync(PATH_ROUTER).filter((fileName) => {
  const cleanName = cleanFileName(fileName);
  if (cleanName !== "index") {
    import(`./${cleanName}`).then((module) => {
      console.log(`Cargando ruta../${cleanName}`);
      router.use(`/${cleanName}`, module.router);
    });
  }
});

export { router };
