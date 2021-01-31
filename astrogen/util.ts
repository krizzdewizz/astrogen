import _ from 'lodash'

export interface Named {
    name: string
}

const value = e => typeof e === 'function' ? e() : e

export function traverse(obj: any, f: (o: any) => void): void {
    if (typeof obj === 'object') {
        f(obj)
        Object.values(obj).forEach(v => traverse(v, f))
    } else if (Array.isArray(obj)) {
        obj.forEach(it => traverse(it, f))
    }
}

export const iff = (expr, ifTrue, ifFalse) => (expr ? value(ifTrue) : value(ifFalse)) || ''
export const ifNot = (expr, ifTrue, ifFalse) => iff(expr, ifFalse, ifTrue)

export function names(name: string): object {
    const camel = _.camelCase(name)
    return {
        nameSnake: _.snakeCase(name),
        nameKebab: _.kebabCase(name),
        nameCamel: camel[0].toUpperCase() + camel.substring(1),
        nameUpper: _.snakeCase(name).toUpperCase()
    }
}

export function addNames(obj: unknown): unknown {
    traverse(obj, o => {
        if (o.name) {
            Object.assign(o, names(o.name))
        }
    })
    return obj
}

export function replaceAll(s: string, what: string, replacement: string): string {
    return s.split(what).join(replacement)
}
