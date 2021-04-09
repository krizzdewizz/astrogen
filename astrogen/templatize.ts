import fs from 'fs'
import path from 'path'
import walk from 'walkdir'
import { TPL_EXT } from './gen'
import { Named, names, replaceAll } from './util'

function replaceName(s: string, { name }: Named): { s: string, replaced: string[] } {
    let replaced: string[] = []
    Object.entries(names(name)).forEach(([k, v]) => {
        const newS = replaceAll(s, v, `\${${k}}`);
        if (newS !== s) {
            replaced.push(k)
        }
        s = newS
    })
    return { s, replaced }
}

export function escapeBackticks(content: string): string {
    if (!content) {
        return content;
    }
    let res = '';
    let tick = false;
    const n = content.length;
    for (let i = 0; i < n; i++) {
        const c = content[i];
        if (c === '`') {
            res += '\\';
            tick = !tick;
        } else if (c === '$' && tick) {
            res += '\\';
        }

        res += c;
    }

    return res;
}

function toTemplate(src: string, target: string, model: Named) {
    const srcContent = escapeBackticks(String(fs.readFileSync(src)));
    const { s: content, replaced } = replaceName(srcContent, model)

    if (replaced.length) {
        const tpl = `module.exports = ({ ${replaced.join(', ')} }) => \`${content}\``
        fs.writeFileSync(`${target}${TPL_EXT}`, tpl)
    } else {
        fs.writeFileSync(target, srcContent)
    }
}

export function templatize(srcDir: string, targetDir: string, model: Named): void {

    const srcAbsLen = path.resolve(srcDir).length

    walk.sync(srcDir, (p: string) => {
        const srcRel = p.substring(srcAbsLen)
        const { s: target } = replaceName(path.join(targetDir, srcRel), model)

        const stat = fs.statSync(p);
        if (stat.isFile()) {
            toTemplate(p, target, model)
        } else if (stat.isDirectory()) {
            fs.mkdirSync(target, { recursive: true })
        }
    })
}
