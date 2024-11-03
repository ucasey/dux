import fs from 'fs';
import path from 'path';

const MAX_DEPTH = 9;
const MARKERS = ['.git'];

const markerExists = (files: string[], markers: string[]) => {
  return markers.some(function (marker) {
    return files.some(f => {
      return f === marker;
    });
  });
};

const traverseFolder = (directory: string, levels: number, markers: string[]): string | undefined => {
  const files = fs.readdirSync(directory);
  if (levels === 0) {
    return undefined;
  } else if (markerExists(files, markers)) {
    return directory;
  } else {
    return traverseFolder(path.resolve(directory, '..'), levels - 1, markers);
  }
};

interface Options {
  maxDepth: number;
  markers: string[];
}

export const findRoot = (dir: string, opts?: Options) => {
  const levels = opts?.maxDepth || MAX_DEPTH;
  const markers = opts?.markers || MARKERS;
  return traverseFolder(dir, levels, markers);
};
