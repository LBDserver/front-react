function checkAuthentication (context) {
    if (context.user && context.token) {
        return true
    } else {
        return false
    }
}

export {checkAuthentication}