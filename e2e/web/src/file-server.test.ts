import {
  killPorts,
  newProject,
  readJson,
  runCLI,
  runCommandUntil,
  uniq,
  updateFile,
  workspaceConfigName,
} from '@nrwl/e2e/utils';
import { serializeJson } from '@nrwl/workspace';

describe('file-server', () => {
  afterEach(() => killPorts());

  it('should serve folder of files', async () => {
    newProject({ name: uniq('fileserver') });
    const appName = uniq('app');

    runCLI(`generate @nrwl/web:app ${appName} --no-interactive`);
    const workspaceJson = readJson(workspaceConfigName());
    workspaceJson.projects[appName].targets['serve'].executor =
      '@nrwl/web:file-server';
    updateFile(workspaceConfigName(), serializeJson(workspaceJson));

    const p = await runCommandUntil(`serve ${appName}`, (output) => {
      return (
        output.indexOf('Built at') > -1 && output.indexOf('Available on') > -1
      );
    });
    p.kill();
  }, 300000);
});
