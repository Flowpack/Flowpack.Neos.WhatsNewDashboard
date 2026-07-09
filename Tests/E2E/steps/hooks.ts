import { createBdd } from 'playwright-bdd';
import { logout, removeAllUsers } from '../helpers/system.ts';

const { AfterScenario } = createBdd();

// reset users after each scenario (each scenario creates its own user)
AfterScenario(async ({ page }) => {
  await logout(page);
  removeAllUsers();
});
