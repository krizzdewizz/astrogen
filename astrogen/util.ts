import _ from 'lodash'

export interface Named {
    name: string
}

const value = e => typeof e === 'function' ? e() : e

function traverse(obj: any, f: Function) {
    if (typeof obj === 'object') {
        f(obj)
        Object.values(obj).forEach(v => traverse(v, f))
    } else if (Array.isArray(obj)) {
        obj.forEach(it => traverse(it, f))
    }
}

export const iff = (expr, ifTrue, ifFalse) => (expr ? value(ifTrue) : value(ifFalse)) || ''
export const ifNot = (expr, ifTrue, ifFalse) => iff(expr, ifFalse, ifTrue)

export function names(name: string) {
    const camel = _.camelCase(name)
    return {
        nameSnake: _.snakeCase(name),
        nameKebab: _.kebabCase(name),
        nameCamel: camel[0].toUpperCase() + camel.substring(1),
        nameUpper: _.snakeCase(name).replace('-', '_').toUpperCase()
    }
}

export function addNames(obj: unknown) {
    traverse(obj, o => {
        if (o.name) {
            Object.assign(o, names(o.name))
        }
    })
    return obj
}
