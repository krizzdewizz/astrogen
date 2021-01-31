import walk from 'walkdir'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { render } from './renderer';
import { addNames, replaceAll } from './util';

export const TPL_EXT = '.tpl';

function isTemplate(file: string): boolean {
    return file.endsWith(TPL_EXT)
}

function renderContent(src: string, model: unknown): string | Buffer {
    if (isTemplate(src)) {
        const tpl = require(src)
        return render(tpl, model)
    }

    return fs.readFileSync(src);
}

function getTargetFile(src: string, target: string, model: unknown): string {
    let trg = isTemplate(src)
        ? target.substring(0, target.length - TPL_EXT.length)
        : target

    Object.entries(model).forEach(([k, v]) => {
        if (!v || typeof v === 'object') {
            return
        }

        trg = replaceAll(trg, `\${${k}}`, v)
    })

    fs.mkdirSync(path.dirname(trg), { recursive: true })

    return trg
}

function copy(src: string, target: string, model: unknown) {
    fs.writeFileSync(target, renderContent(src, model))
}

export function generate(srcDir: string, targetDir: string, model: unknown): void {

    const clone = _.cloneDeep(model)
    addNames(clone)

    const srcAbsLen = path.resolve(srcDir).length

    walk.sync(srcDir, (p: string) => {
        const srcRel = p.substring(srcAbsLen)
        const target = path.join(targetDir, srcRel)
        const trg = getTargetFile(p, target, clone)
        const stat = fs.statSync(p);
        if (stat.isFile()) {
            copy(p, trg, clone)
        } else if (stat.isDirectory()) {
            fs.mkdirSync(trg, { recursive: true })
        }
    })
}
