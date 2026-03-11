import { execSync } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import webpackPaths from '../configs/webpack.paths.ts';

const require = createRequire(import.meta.url);
const { dependencies } = require('../../release/app/package.json');

if (
  Object.keys(dependencies || {}).length > 0 &&
  fs.existsSync(webpackPaths.appNodeModulesPath)
) {
  const electronRebuildCmd =
    '../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir .';
  const cmd =
    process.platform === 'win32'
      ? electronRebuildCmd.replace(/\//g, '\\')
      : electronRebuildCmd;
  execSync(cmd, {
    cwd: webpackPaths.appPath,
    stdio: 'inherit',
  });
}
