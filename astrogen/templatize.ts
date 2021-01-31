import fs from 'fs'
import path from 'path'
import walk from 'walkdir'
import { TPL_EXT } from './gen'
import { Named, names } from './util'

function replaceName(s: string, { name }: Named): { s: string, replaced: string[] } {
    let replaced: string[] = []
    Object.entries(names(name)).forEach(([k, v]) => {
        const newS = s.split(v).join(`\${${k}}`);
        if (newS !== s) {
            replaced.push(k)
        }
        s = newS
    })
    return { s, replaced }
}

function toTemplate(src: string, target: string, model: Named) {
    const srcContent = fs.readFileSync(src);
    const { s: content, replaced } = replaceName(String(srcContent), model)

    if (replaced.length) {
        const tpl = `module.exports = ({ ${replaced.join(', ')} }) => \`\n${content}\``
        fs.writeFileSync(`${target}${TPL_EXT}`, tpl)
    } else {
        fs.writeFileSync(target, srcContent)
    }
}

export function templatize(srcDir: string, targetDir: string, model: Named) {

    const srcAbs = path.resolve(srcDir)

    walk.sync(srcDir, (p: string) => {
        const srcRel = p.substring(srcAbs.length)
        const { s: target } = replaceName(path.join(targetDir, srcRel), model)

        const stat = fs.statSync(p);
        if (stat.isFile()) {
            toTemplate(p, target, model)
        } else if (stat.isDirectory()) {
            fs.mkdirSync(target, { recursive: true })
        }
    })
}
