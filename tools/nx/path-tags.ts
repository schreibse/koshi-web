import {
  createNodesFromFiles,
  readJsonFile,
  type CreateNodes,
} from '@nx/devkit';
import { dirname, join } from 'node:path';

/**
 * Derives every project's tags from its path, so project.json never carries them and a
 * project outside the layout fails the graph instead of going untagged.
 */

const APPS: Record<string, string> = { web: 'frontend', functions: 'edge' };

const LIB_TYPES: Record<string, readonly string[]> = {
  frontend: ['feature', 'data-access', 'ui', 'util'],
  shared: ['util'],
};

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export const createNodes: CreateNodes = [
  '{apps/*,libs/**,functions}/project.json',
  (files, options, context) =>
    createNodesFromFiles(
      (file) => {
        const root = dirname(file);
        const declared =
          readJsonFile(join(context.workspaceRoot, file)).tags ?? [];
        if (declared.length > 0) {
          throw new Error(
            `${file} declares tags; they are derived from the path.`,
          );
        }
        return { projects: { [root]: { tags: tagsFor(root) } } };
      },
      files,
      options,
      context,
    ),
];

function tagsFor(root: string): string[] {
  const segments = root.split('/');

  if (root === 'functions') {
    return [`platform:${APPS['functions']}`, 'type:app'];
  }

  if (segments[0] === 'apps' && segments.length === 2 && segments[1] in APPS) {
    return [`platform:${APPS[segments[1]]}`, 'type:app'];
  }

  if (segments[0] === 'libs' && segments.length === 4) {
    const [, platform, domain, type] = segments;
    if (LIB_TYPES[platform]?.includes(type) && KEBAB.test(domain)) {
      return [`platform:${platform}`, `scope:${domain}`, `type:${type}`];
    }
  }

  throw new Error(
    `${root} is outside the layout: apps/web, functions, or ` +
      `libs/<frontend|shared>/<domain>/<type>.`,
  );
}
