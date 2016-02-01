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

    _this.registeredInnerImplementation = null

    // methods that are called from inner
    _ipc.registerInnerImplementation = implementation => {
        _this.registeredInnerImplementation = implementation
    }

    //
    // methods that are called over please from the parent ( = from outer)
    //
    _ipc.publishEventFromOuterToInner = (...args) => {
        const methodName = args[0]
        const remainingArguments = Array.prototype.slice.call(args, 1, args.length)
        try {
            _this.registeredInnerImplementation[methodName].apply(_this.registeredInnerImplementation, remainingArguments)
        } catch (e) {
            throw new Error(`The function "${methodName}" is not defined in the registered Implementation of the recipient of the inner application,
            please implement it, to be able to catch this method from the outer caller.`);
        }

    }

    //
    // methods that are called from the inner app and that should be mapped in a please - call
    //
    _ipc.publishEventFromInnerToOuter = (...args) => {
        const comArguments = ['app.ipcAdapter.recipient.subscribeForInnerEvent'].concat(Array.prototype.slice.call(args, 0, args.length))
        please(parent).call.apply(please(parent), comArguments).then(
            function () { // success callback
            }, function (error) { // failure callback
                console.error('Error occured while a inner application tried to call a method of the outer application: ', error.stack);
            }
        );
    }


    return _ipc
})()


