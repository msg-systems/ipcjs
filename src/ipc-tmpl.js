/*
 **  IPC - Inter Process Communication
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */
/*  Universal Module Definition (UMD)  */
((root, factory) => {
    /* global define:false */
    if (typeof define === "function" && define.amd)
        define('IPC', function () {
            return factory(root);
        });
    else
        root.IPC = factory(root);
})(this, (root) => {
    /*  create internal and external API  */
    const ipc = {}
    const _ipc = {}

    /*  private copy of jQuery  */
    const _JQuery = ipc.$ = (() => {
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

    _Please.init(root)

    _ipc.registeredRecipient = null

    // methods that are called from inner
    ipc.registerRecipient = implementation => {
        _ipc.registeredRecipient = implementation
    }

    //
    // method that is called over please, it will be forwarded to the recipient through calling functions of the recipients implementation
    //
    ipc.receiveEvent = (methodName, ...args) => {
        var match = methodName.match(/^ipc_.*$/)
        if (match !== null) {
            try {
                _ipc.registeredRecipient[methodName](...args)
            } catch (e) {
                throw new Error(`The function "${methodName}" is not defined in the implementation of the recipient, please implement it, to be able to catch this method from the sender. \n Error Stack: ${e.stack}`)
            }
        } else {
            throw new Error(`The function-call is not allowed. The function-name "${methodName}" does not start with "ipc_". It is only allowed to call functions over the IPC-Library that start with "ipc_".`)
        }
    }

    //
    // methods that are called from a app to send an event to another window
    //
    ipc.sendEvent = (target, ...args) => {
        if (target) {
            please(target).call.apply(please(target), ['IPC.receiveEvent', ...args])
        }
    }

    /*  export external API  */
    return ipc
})

