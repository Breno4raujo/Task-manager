#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const projectRoot = process.cwd();
  const src = path.join(projectRoot, 'frontend');
  const dest = path.join(projectRoot, 'backend', 'public');

  try {
    await copyDir(src, dest);
    console.log(`Frontend copiado: ${src} -> ${dest}`);
  } catch (err) {
    console.error('Erro ao copiar frontend:', err);
    process.exit(1);
  }
}

main();
