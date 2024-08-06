import {ACTION, Audit} from "@prisma/client"
export const gen_log_msg = (log: Audit) => {
    const {action, title, type} = log
    switch (action) {
        case ACTION.CREATE:
            return `created ${type.toLowerCase()} "${title}"`
        case ACTION.UPDATE:
            return `updated ${type.toLowerCase()} "${title}"`
        case ACTION.DELETE:
            return `deleted ${type.toLowerCase()} "${title}"`
        default:
            return `unknown ${type.toLowerCase()} "${title}"`
    }
}