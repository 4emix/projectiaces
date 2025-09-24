'use strict';

/**
 * Minimal stub of the ESLint module so that `next lint` can execute in
 * sandboxed environments where installing npm packages is not possible.
 * The implementation intentionally reports no diagnostics.
 */
class ESLint {
  constructor(options = {}) {
    this.options = { ...options };
  }

  async calculateConfigForFile() {
    return {
      plugins: ['@next/next'],
      rules: {},
    };
  }

  async lintFiles() {
    return [];
  }

  async loadFormatter() {
    return {
      format() {
        return '';
      },
    };
  }

  static async outputFixes() {
    return Promise.resolve();
  }

  static getErrorResults() {
    return [];
  }
}

ESLint.version = '8.57.0';

const CLIEngine = {
  version: ESLint.version,
};

module.exports = {
  ESLint,
  CLIEngine,
  Linter: class {},
};

module.exports.default = module.exports;
