# ipcjs
Inter-Process-Communication (IPC) Library for JavaScript. This Library enables communicating between two windows on different domains. The communication can be bidirectional, so every window itself can be both a sender and a recipient. To make the communication between two windows work, both of them must include the same version of `ipcjs`.

`ipcjs` is based on [please.js](https://github.com/wingify/please.js), a Request/Response based wrapper around the PostMessage API that makes use of jQuery Promises. [please.js](https://github.com/wingify/please.js) itself is based on top of jQuery and the jQuery Promise API.


## Installation

Before start using `ipcjs`, you must make sure that both windows have `ipcjs` loaded and thus the global object `IPC` is available.

Install with npm

	$ npm install ipcjs

or [download](https://github.com/msg-systems/ipcjs/blob/master/dist/ipcjs.js) source.

##Usage

###Sender

To send an event, just call the method `sendEvent` on the global object `IPC`.

		IPC.sendEvent(window.parent, 'ipc_infoText', text)

The method `sendEvent` has the following parameter:

1. The target window (recipient)
2. The name of the recipient's method as string
3. [optional] further parameters (0-n), as many as the implementation of the given method expects


For example we have a window A that includes an iFrame B. Then the target window of A is the iFrame B (`$('iframe').get(0).contentWindow`) and the target window of the iFrame B is the window A (`window.parent`).

> __In case the sender tries to call a method the recipient has not implemented, an error is thrown from the `ipcjs` Library.__

###Recipient

To receive an event, the recipient must register its implementation on the global object `IPC`.

		IPC.registerRecipient(this)

Furthermore the recipient has to implement the methods, that the sender wants to call.

		ipc_infoText (text) {
            // the implementation of the method
            // here u can give the information back in the application and convert it to the applications architecture
        },
 
> __All methods, the recipient provides for the communication with a sender, must start with the prefix  `ipc_`.
That is for security reason to avoid that everything the recipient implements can be called from a sender. Only through the prefix `ipc_` the method is available for a sender. If the sender tries to call a method, that does not start with the prefix  `ipc_`, an error is thrown from the `ipcjs` Library.__