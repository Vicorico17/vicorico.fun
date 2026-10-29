const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require.resolve('../cv-game.js'), 'utf8');
const sync = source.slice(source.indexOf('function syncFirstCastleTutorial()'), source.indexOf('function updateHud('));

test('first castle tutorial persists until completion and returns on reset', () => {
  const stageNode = { dataset: {} };
  const visited = new Set();
  const context = vm.createContext({ stageNode, visited, castles: [{ id: 'ai' }] });
  vm.runInContext(sync, context);
  const update = () => vm.runInContext('syncFirstCastleTutorial()', context);
  update();
  assert.equal(stageNode.dataset.tutorial, 'active');
  visited.add('another-castle');
  update();
  assert.equal(stageNode.dataset.tutorial, 'active');
  visited.add('ai');
  update();
  assert.equal(stageNode.dataset.tutorial, 'complete');
  visited.clear();
  update();
  assert.equal(stageNode.dataset.tutorial, 'active');
});
