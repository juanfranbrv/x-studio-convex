/**
 * scripts/dev-mobile.js
 *
 * Automates Next.js mobile development.
 * - Starts `npm run dev`
 * - Optionally starts `ngrok`
 * - Opens the resulting URL (Local IP, Emulator Loopback, or Ngrok) on connections Android devices via ADB.
 */

const { spawn, exec } = require('child_process');
const http = require('http');
const os = require('os');

const args = process.argv.slice(2);
const useNgrok = args.includes('--ngrok');
// Default Next.js port
const port = process.env.PORT || '3000';

console.log('\n========================================');
console.log('  MOBILE DEVELOPMENT STARTUP');
console.log('========================================\n');

// --- Helper Functions ---

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (!iface || iface.family !== 'IPv4' || iface.internal) continue;
            return iface.address;
        }
    }
    return null;
}

function getBestUrlForDeviceSerial(deviceSerial) {
    const isEmulator = typeof deviceSerial === 'string' && deviceSerial.startsWith('emulator-');
    // 10.0.2.2 is the special alias to your host loopback interface (127.0.0.1)
    if (isEmulator) return `http://10.0.2.2:${port}`;

    const ip = getLocalIpAddress();
    if (ip) return `http://${ip}:${port}`;

    return `http://localhost:${port}`;
}

function getDevCwd() {
    // Assumes script is in /scripts, so we go up one level
    return __dirname.replace(/[\\/]scripts$/, '');
}

function startNextDev() {
    console.log('[1/3] Starting Next.js...\n');
    return spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true,
        cwd: getDevCwd(),
    });
}

function startNgrok() {
    console.log('[2/3] Starting ngrok... (mode --ngrok)\n');
    const ngrokProcess = spawn('ngrok', ['http', port], {
        stdio: 'pipe',
        shell: true,
    });

    ngrokProcess.stdout.on('data', (data) => process.stdout.write(data));
    ngrokProcess.stderr.on('data', (data) => process.stderr.write(data));

    ngrokProcess.on('error', () => {
        console.error('\n[ERROR] Could not start ngrok.');
        console.error('Ensure ngrok is installed and in your PATH.\n');
    });

    return ngrokProcess;
}

function getNgrokUrl() {
    // Queries the local ngrok API to find the public URL
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 4040, // Default ngrok web interface port
            path: '/api/tunnels',
            method: 'GET',
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    const tunnels = JSON.parse(data);
                    const httpsTunnel = (tunnels.tunnels || []).find((t) => t.proto === 'https');
                    resolve(httpsTunnel?.public_url || null);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

function openInAndroidEmulator(url) {
    console.log('[Android] Attempting to open URL via ADB...\n');

    // Common locations for ADB on Windows/Mac/Linux if not in PATH
    const userProfile = process.env.USERPROFILE || process.env.HOME || '';
    const possibleAdbPaths = [
        'adb', // Hope it's in PATH
        `${userProfile}\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe`,
        `${userProfile}/AppData/Local/Android/Sdk/platform-tools/adb.exe`,
        '/usr/local/bin/adb',
        '/Users/username/Library/Android/sdk/platform-tools/adb'
    ];

    if (process.env.ANDROID_HOME) {
        possibleAdbPaths.push(`${process.env.ANDROID_HOME}/platform-tools/adb`);
        possibleAdbPaths.push(`${process.env.ANDROID_HOME}\\platform-tools\\adb.exe`);
    }

    tryAdbPath(possibleAdbPaths, 0, url);
}

function tryAdbPath(paths, index, fallbackUrl) {
    if (index >= paths.length) {
        console.log('[WARN] ADB not found in common locations.');
        console.log('       Please manually open: ' + fallbackUrl + '\n');
        return;
    }

    const adbPath = paths[index];

    // Checking for connected devices
    exec(`"${adbPath}" devices`, (error, stdout) => {
        if (error) {
            // Try next path
            tryAdbPath(paths, index + 1, fallbackUrl);
            return;
        }

        // Parse output
        const lines = stdout.trim().split('\n');
        const devices = lines
            .slice(1) // Skip "List of devices attached"
            .map((l) => l.trim())
            .filter((l) => l.length > 0 && !l.includes('offline'));

        if (devices.length === 0) {
            console.log('[WARN] No Android device/emulator found.');
            console.log('       Opening fallback URL: ' + fallbackUrl);
            return;
        }

        const deviceSerial = devices[0].split(/\s+/)[0];
        // If it's an emulator, use 10.0.2.2, otherwise use what was passed (ngrok or local IP)
        // Note: If using ngrok (external URL), we use it for both emulator and device.
        let bestUrl = fallbackUrl;

        // Logic: If NO ngrok and IS emulator, force 10.0.2.2.
        // If ngrok is active, fallbackUrl is already the ngrok URL, so we keep it.
        if (!useNgrok) {
            bestUrl = getBestUrlForDeviceSerial(deviceSerial) || fallbackUrl;
        }

        // Send Intent to open browser
        const adbCommand = `"${adbPath}" shell am start -a android.intent.action.VIEW -d "${bestUrl}"`;
        exec(adbCommand, (err) => {
            if (err) {
                console.log('[WARN] Failed to launch browser on device.');
            } else {
                console.log(`[OK] Opened ${bestUrl} on ${deviceSerial}\n`);
            }
        });
    });
}

// --- Main Execution ---

const nextProcess = startNextDev();

if (useNgrok) {
    // Wait for Next.js to likely be ready
    setTimeout(() => {
        startNgrok();
        // Wait for Ngrok to initialize tunnel
        setTimeout(async () => {
            console.log('[3/3] Fetching ngrok URL...\n');
            try {
                const url = await getNgrokUrl();
                if (url) {
                    console.log(`> Tunnel Active: ${url}`);
                    openInAndroidEmulator(url);
                } else {
                    console.log('[WARN] Could not retrieve HTTPS tunnel.');
                }
            } catch (e) {
                console.log('[WARN] Error checking ngrok API.');
            }
        }, 2000);
    }, 3000);
} else {
    // Simple mode
    console.log('[2/3] Skipping ngrok...\n');
    setTimeout(() => {
        // We pass a dummy URL here because `getBestUrlForDeviceSerial` will recalculate
        // the best Local IP based on the device type found.
        openInAndroidEmulator(`http://localhost:${port}`);
    }, 2000);
}

// Cleanup on exit
process.on('SIGINT', () => {
    try { nextProcess.kill(); } catch { }
    process.exit();
});
