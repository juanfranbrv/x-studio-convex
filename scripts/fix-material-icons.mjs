import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src/lib/prompts/intents/servicio.ts')

const ICONS = {
    'servicio-grid': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h8V3H3v8zm0 10h8v-8H3v8zm10 0h8v-8h-8v8zm0-10h8V3h-8v8z"/></svg>`,
    'servicio-benefit': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 15h8v-2H3v2zm0 4h8v-2H3v2zm0-8h8V9H3v2zm0-4h8V5H3v2zm10 14h8V5h-8v14z"/></svg>`,
    'servicio-pricing': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>`,
    'servicio-process': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5,9c0,0.83,0.67,1.5,1.5,1.5S19.5,9.83,19.5,9s-0.67-1.5-1.5-1.5S16.5,8.17,16.5,9z M18,3c-1.1,0-2,0.9-2,2v5.17 C14.3,10.6,13,12.1,13,14c0,2.2,1.8,4,4,4c1.9,0,3.4-1.3,3.83-3H23v-2h-2.17C20.4,11.3,19.3,10.2,18,10.05V5h2V3H18z M17,16 c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.1,16,17,16z M7,10v2h4v2H7v2l-3-3L7,10z"/></svg>`,
    'servicio-list': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"/></svg>`
}

let content = fs.readFileSync(filePath, 'utf8')

for (const [id, svg] of Object.entries(ICONS)) {
    const regex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?svgIcon:\\s*')([\\s\\S]*?)(')`, 'g')
    content = content.replace(regex, `$1${svg}$3`)
}

fs.writeFileSync(filePath, content)
console.log('Successfully standardized Material Icons in servicio.ts')
