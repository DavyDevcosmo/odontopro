const envConfigs = {
  development: {
    currentEnv: "development",
    allowsDestructiveDbCleanup: false,
  },
  production: {
    currentEnv: "production",
    allowsDestructiveDbCleanup: false,
  },
  test: {
    currentEnv: "test",
    allowsDestructiveDbCleanup: true,
  },
  e2e: {
    currentEnv: "e2e",
    allowsDestructiveDbCleanup: true,
  },
} as const

type EnvConfigs = typeof envConfigs
type AllowedEnvKeys = keyof EnvConfigs

type ConfigsByEnv = {
  readonly currentEnv: AllowedEnvKeys
  readonly allowsDestructiveDbCleanup: boolean
}

function isValidEnv(env: string): env is AllowedEnvKeys {
  return Object.keys(envConfigs).includes(env)
}

export function checkEnv(): AllowedEnvKeys {
  const currentEnv = process.env.CURRENT_ENV

  if (!currentEnv || !isValidEnv(currentEnv)) {
    throw new Error(
      'CURRENT_ENV inválido ou ausente. Verifique os .env* e os valores em src/env/config.ts (development | production | test | e2e).',
    )
  }

  return currentEnv
}

export function getFullEnv(): ConfigsByEnv {
  const currentEnv = checkEnv()
  return envConfigs[currentEnv]
}

export function getEnv<C extends keyof ConfigsByEnv>(key: C): ConfigsByEnv[C] {
  const currentEnv = checkEnv()
  return envConfigs[currentEnv][key]
}

/**
 * Dual gate for destructive DB operations (TRUNCATE, DROP, etc.):
 * 1. CURRENT_ENV must allow cleanup (test | e2e)
 * 2. IS_TEST_DATABASE must be explicitly "true"
 */
export function assertDestructiveDbAccess(): void {
  const { currentEnv, allowsDestructiveDbCleanup } = getFullEnv()

  if (!allowsDestructiveDbCleanup) {
    throw new Error(
      `🚨 CURRENT_ENV="${currentEnv}" não permite limpeza destrutiva do banco.`,
    )
  }

  if (process.env.IS_TEST_DATABASE !== "true") {
    throw new Error(
      '🚨 IS_TEST_DATABASE não está definida como "true". ' +
        "Abortando limpeza para evitar apagar dados reais.",
    )
  }
}

export type { AllowedEnvKeys, ConfigsByEnv }
