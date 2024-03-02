export const getENV = () => {
    if (process.env.PROD === 'true') {
        return 'PROD'
    }
    if (process.env.TEST === 'true') {
        return 'TEST'
    }
    if (process.env.DEV === 'true') {
        return 'DEV'
    }
    return undefined
}
