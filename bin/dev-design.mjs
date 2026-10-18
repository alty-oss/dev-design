#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInstallerCli } from '../scripts/install.mjs';

runInstallerCli({ sourceRoot: resolve(dirname(fileURLToPath(import.meta.url)), '..') });
