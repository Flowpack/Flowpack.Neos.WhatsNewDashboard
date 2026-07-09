import { execSync } from 'node:child_process';
import { dirname } from 'node:path';
import { type Page } from '@playwright/test';

// Container name = `<compose project name>-neos-1`; the project name is set
// explicitly via `name:` in system_under_test/<SUT>/docker-compose.yaml.
const CONTAINER = `whatsnew-${process.env.SUT || 'neos8'}-neos-1`;

export function createUser(name: string, password: string, roles: string[]) {
  execSync(
    `docker exec -u www-data -w /app ${CONTAINER} bash -c "./flow user:create ${name} ${password} Test${name} User${name} --roles ${roles.join(',')}"`,
    { stdio: 'ignore', cwd: dirname('.') }
  )
}

export function removeAllUsers() {
  // `./flow user:delete '*'` exits non-zero when there are no users to delete. A teardown
  // must not fail just because a scenario created no users, so swallow that error.
  try {
    execSync(
      `docker exec -u www-data -w /app ${CONTAINER} bash -c "./flow user:delete --assume-yes '*'"`,
      { stdio: 'ignore', cwd: dirname('.') }
    )
  } catch {
    // no users to delete — nothing to clean up
  }
}

export async function logout(page: Page) {
  await page.context().request.post('/neos/logout');
}
