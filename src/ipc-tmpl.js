const JS_IPC = (() => {
    const _ipc = {}
    const _this = {}

    /*  private copy of jQuery  */
    const _JQuery = _ipc.$ = (() => {
        const jQuery = (() => {
            const module = {}
            //it is important to have the ; here because otherwise it will result in an error
            module.exports = {};
            "%%JQUERY%%"
            return module.exports
        })()
        return jQuery
    })()

    /*  private copy of Please  */
    const _Please = (() => {
        "%%PLEASE%%"
        return window.please
    })(_JQuery)

    _Please.init(window)


    _this.registeredImplementation = null

    _ipc.registerImplementation = implementation => {
        _this.registeredImplementation = implementation
    }

    //
    // methods that are called over please from the parent
    //
    _ipc.publishEventFromOuterToInner = (...args) => {
        let methodName = args[0]
        let remainingArguments = Array.prototype.slice.call(args, 1, args.length)
        try {
            _this.registeredImplementation[methodName].apply(_this.registeredImplementation, remainingArguments)
        } catch (e) {
            throw new Error(`The function "${methodName}" is not defined in the registered Implementation, please implement it, to be able to catch this method from the caller.`);
        }

    }

    //
    // methods that are called from the inner app and that should be mapped in a please - call
    //
    _ipc.publishEventFromInnerToOuter = (...args) => {
        //todo methoden die es nicht gibt abfangen
        let comArguments = [`app.applicationFramework.comRecipient.${args[0]}`].concat(Array.prototype.slice.call(args, 1, args.length))
        return please(parent).call.apply(please(parent), comArguments)
    }

    return _ipc
})()


