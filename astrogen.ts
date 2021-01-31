import { program } from 'commander'
import { templatize } from './astrogen/templatize'
import { Named } from './astrogen/util'
import { generate } from './astrogen/gen'

(function main() {
    program
        .version('1.0.0')
        .arguments('<src-dir> <target-dir> <model-name>')
        .option('-p, --property <name=value...>', 'properties to include in the model')
        .option('-t, --template', 'Templatize srcDir to targetDir instead of applying the template')

    const parsed = program.parse(process.argv)
    if (parsed.args.length < 3) {
        program.help()
    }

    const { property = [], template } = parsed.opts()
    const [srcDir, targetDir, name] = parsed.args

    let model: Named = { name }
    property.forEach(p => {
        const [k, v] = p.split('=')
        model[k] = v
    })

    if (template) {
        templatize(srcDir, targetDir, model)
    } else {
        generate(srcDir, targetDir, model);
    }
})()
