import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = 'content';
const MIN_PATH_NODES = 6;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith('.json')) out.push(p);
  }
  return out;
}

function shortestPath(nodes, startId) {
  function go(id, seen) {
    if (seen.has(id)) return Infinity;
    const node = nodes[id];
    if (!node) return Infinity;
    if (node.isEnd || !node.choices?.length) return 1;
    const next = new Set(seen);
    next.add(id);
    let best = Infinity;
    for (const choice of node.choices) {
      const d = go(choice.nextNode, next);
      if (d < best) best = d;
    }
    return 1 + best;
  }
  return go(startId, new Set());
}

const errors = [];
let checked = 0;

const fileArgs = process.argv.slice(2);
const targetFiles = fileArgs.length > 0 ? fileArgs : walk(CONTENT_DIR);

for (const file of targetFiles) {
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    continue;
  }
  if (json?.type !== 'incident_response') continue;
  checked++;

  const startNode = json.exercise?.startNode;
  const nodes = json.exercise?.nodes;
  if (!startNode || !nodes) {
    errors.push(`${file}: missing exercise.startNode or exercise.nodes`);
    continue;
  }

  for (const [id, node] of Object.entries(nodes)) {
    for (const choice of node.choices ?? []) {
      if (!nodes[choice.nextNode]) {
        errors.push(`${file}: node "${id}" choice "${choice.id}" references missing node "${choice.nextNode}"`);
      }
    }
  }

  const min = shortestPath(nodes, startNode);
  if (min < MIN_PATH_NODES) {
    errors.push(`${file}: shortest path is ${min - 1} decisions (need at least ${MIN_PATH_NODES - 1})`);
  }
}

console.log(`Checked ${checked} incident_response lesson(s).`);
if (errors.length) {
  console.error(`\nFAIL: ${errors.length} issue(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('PASS: every incident_response lesson reaches at least 5 decisions on its shortest path.');
