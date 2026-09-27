/**
 * Renders every app icon from the favicon SVG: the PNGs of the web manifest and the desktop icon set.
 * Run with `node scripts/icons.ts` after changing the icon. Needs a Playwright Chromium,
 * set CHROMIUM to its executable if the pinned build is not installed.
 */
import { chromium } from '@playwright/test';
import { execSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';

const svg = readFileSync('static/favicon.svg', 'utf8');
const sized = (size: number) => svg.replace('<svg ', `<svg width="${size}" height="${size}" `);

// Maskable icons get cropped to a circle by some launchers, so the logo sits in the inner 80 %
const variants = [
	{ file: 'static/icon-192.png', size: 192, pad: 0 },
	{ file: 'static/icon-512.png', size: 512, pad: 0 },
	{ file: 'static/icon-maskable-512.png', size: 512, pad: 0.1 },
	{ file: 'static/apple-touch-icon.png', size: 180, pad: 0 }
];

// Windows picks the frame matching its display scale, a missing size gets scaled and blurs
const ICO_SIZES = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM });
const page = await browser.newPage();

for (const v of variants) {
	const inner = v.size * (1 - 2 * v.pad);
	await page.setViewportSize({ width: v.size, height: v.size });
	await page.setContent(
		`<body style="margin:0;display:grid;place-items:center;width:${v.size}px;height:${v.size}px;background:${v.pad ? '#1b1b1a' : 'transparent'}">
			<div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>
		</body>`
	);
	await page.screenshot({ path: v.file, omitBackground: !v.pad });
}

// Straight RGBA pixels per size, and the largest frame as PNG
const frames = await page.evaluate(
	async (sources) =>
		Promise.all(
			sources.map(async ({ size, svg }) => {
				const img = new Image();
				img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
				await img.decode();
				const canvas = Object.assign(document.createElement('canvas'), { width: size, height: size });
				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(img, 0, 0, size, size);
				return { size, rgba: Array.from(ctx.getImageData(0, 0, size, size).data), png: canvas.toDataURL('image/png').split(',')[1] };
			})
		),
	ICO_SIZES.map((size) => ({ size, svg: sized(size) }))
);

await browser.close();

// Everything but the ICO comes from the Tauri CLI, the mobile sets are not shipped
execSync('bun tauri icon static/favicon.svg -o src-tauri/icons', { stdio: 'inherit' });
for (const extra of ['android', 'ios', '64x64.png']) rmSync(`src-tauri/icons/${extra}`, { recursive: true, force: true });

/** One ICO frame as a 32 bit bitmap: header, BGRA rows bottom up, then the 1 bit transparency mask */
function bitmap(size: number, rgba: number[]): Buffer {
	const maskRow = Math.ceil(size / 32) * 4;
	const out = Buffer.alloc(40 + size * size * 4 + maskRow * size);
	out.writeUInt32LE(40, 0);
	out.writeInt32LE(size, 4);
	out.writeInt32LE(size * 2, 8);
	out.writeUInt16LE(1, 12);
	out.writeUInt16LE(32, 14);
	out.writeUInt32LE(size * size * 4 + maskRow * size, 20);

	const maskStart = 40 + size * size * 4;
	for (let y = 0; y < size; y++) {
		const row = size - 1 - y;
		for (let x = 0; x < size; x++) {
			const src = (y * size + x) * 4;
			const dst = 40 + (row * size + x) * 4;
			out[dst] = rgba[src + 2];
			out[dst + 1] = rgba[src + 1];
			out[dst + 2] = rgba[src];
			out[dst + 3] = rgba[src + 3];
			if (rgba[src + 3] === 0) out[maskStart + row * maskRow + (x >> 3)] |= 0x80 >> (x & 7);
		}
	}
	return out;
}

// Small frames as bitmaps for older readers, 256 as PNG since its bitmap would be huge
const images = frames.map((f) => (f.size === 256 ? Buffer.from(f.png, 'base64') : bitmap(f.size, f.rgba)));
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);

let offset = header.length;
frames.forEach((f, i) => {
	const entry = 6 + 16 * i;
	header[entry] = f.size % 256;
	header[entry + 1] = f.size % 256;
	header.writeUInt16LE(1, entry + 4);
	header.writeUInt16LE(32, entry + 6);
	header.writeUInt32LE(images[i].length, entry + 8);
	header.writeUInt32LE(offset, entry + 12);
	offset += images[i].length;
});

writeFileSync('src-tauri/icons/icon.ico', Buffer.concat([header, ...images]));
