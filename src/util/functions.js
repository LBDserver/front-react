function checkAuthentication (context) {
    if (context.user) {
        return true
    } else {
        return false
    }
}

export {checkAuthentication}