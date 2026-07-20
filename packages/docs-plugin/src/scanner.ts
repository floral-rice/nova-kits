import { glob } from 'tinyglobby';
import { watch } from 'chokidar';
import type { FSWatcher } from 'chokidar';

/**
 * Scan directory for files matching glob pattern.
 * Returns absolute paths.
 */
export async function scanFiles(dir: string, pattern: string): Promise<string[]> {
  return glob(pattern, { cwd: dir, absolute: true });
}

/**
 * Watch directory for changes and call callback on any change.
 * Returns chokidar watcher instance.
 */
export function watchFiles(dir: string, pattern: string, callback: () => void): FSWatcher {
  const watcher = watch(pattern, {
    cwd: dir,
    ignoreInitial: true,
  });

  watcher.on('add', callback);
  watcher.on('unlink', callback);
  watcher.on('change', callback);

  return watcher;
}
