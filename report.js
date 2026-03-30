const { execSync, spawn } = require('child_process');
const PORT = 9324;

try {
  if (process.platform === 'win32') {
    const result = execSync('netstat -ano | findstr :' + PORT, { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] });
    const lines = result.trim().split('\n');
    const pids = [...new Set(lines.map(l => l.trim().split(/\s+/).pop()).filter(Boolean))];
    pids.forEach(pid => { try { execSync('taskkill /PID ' + pid + ' /F', { stdio: 'ignore' }); } catch (_) {} });
  } else {
    execSync('lsof -ti:' + PORT + ' | xargs kill -9', { stdio: 'ignore', shell: true });
  }
} catch (_) {}

setTimeout(() => {
  const proc = spawn(
    'npx playwright show-report --port ' + PORT,
    { stdio: 'inherit', shell: true }
  );
  proc.on('error', err => { console.error('Failed to start report server:', err.message); });
}, 500);
