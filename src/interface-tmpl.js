const COM_INTERFACE = (() => {
    const _comInterface = {}
    const _this = {}

    /*  private copy of jQuery  */
    const _JQuery = _comInterface.$ = (() => {
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

    const methodsFromInnerToOuter = [
        {method: "contentReady"},
        // generische Methode, die mit der gerade geöffneten App kommuniziert. (man kann z.B. google-Maps eine Adresse setzen)
        // und die Daten aus der inneren App dem Rahmen übergibt
        {method: "contentDataToApp"},
        {method: "registerApps"},
        // die innere Anwendung kann eine bestimme App aktivieren
        {method: "activateApp"},
        {method: "infoText"}
    ]

    const methodsFromOuterToInner = [
        // die aktuellen Benutzereinstellungen der Rahmenanwendung werden der inneren Anwendung übergeben
        {method: "userSettings"},
        // hier können Daten aus einer App der inneren Anwendung übergeben werden, z.B. wenn etwas in Google-Maps angeklickt wurde
        {method: "appDataToContent"}
    ]

    _this.registeredImplementation = null

    _comInterface.registerImplementation = implementation => {
        //TODO evtl. AST abfrage und check ob richitg viele parameter definiert wurden bei jeder function
        _.forEach(methodsFromOuterToInner, (methodObj) => {
            if (typeof implementation[methodObj.method] !== 'function' && methodObj.mandatory)
                throw new Error(`The function "${methodObj.method}" is not defined, but is a mandatory function for the implementation of the cominterface`)
        })

        _this.registeredImplementation = implementation
    }


    //
    // methods that are called over please from the parent
    //

    _.forEach(methodsFromOuterToInner, (methodObj) => {
        _comInterface[methodObj.method] = function () {
            _this.registeredImplementation[methodObj.method].apply(_this.registeredImplementation, arguments);
        }
    })


    //
    // methods that are called from the inner app and that should be mapped in a please - call
    //

    _.forEach(methodsFromInnerToOuter, (methodObj) => {
        _comInterface[methodObj.method] = function () {
            let comArguments = [`app.applicationFramework.comRecipient.${methodObj.method}`].concat(Array.prototype.slice.call(arguments, 0, arguments.length))
            return please(parent).call.apply(please(parent), comArguments)
        }
    })

    return _comInterface
})()


