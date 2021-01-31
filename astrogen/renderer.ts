import { iff, ifNot } from './util'

function defineGlobals() {

    const glob = global as any;
    glob.iff = iff
    glob.ifNot = ifNot

    Object.defineProperty(Array.prototype, 'nl', {
        get: function () {
            return this.join('\n')
        }
    })
}

defineGlobals()

export function render(tpl: (model: unknown) => string, model: unknown) {
    //console.log(clone)
    return tpl(model)
}
