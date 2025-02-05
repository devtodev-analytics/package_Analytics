mergeInto(LibraryManager.library, {
  $instance: null,
  $getInstance: function () {
    if (instance) return instance;
    return typeof gameInstance !== "undefined"
      ? gameInstance
      : typeof unityInstance !== "undefined"
      ? unityInstance
      : typeof myGameInstance !== "undefined"
      ? myGameInstance
      : null;
  },
  $sendMessage: function (method, message) {
    const instance = getInstance();
    if (instance) {
      instance.SendMessage(
        "[devtodev_AsyncOperationDispatcher]",
        method,
        message
      );
    } else if (typeof SendMessage !== "undefined") {
      SendMessage("[devtodev_AsyncOperationDispatcher]", method, message);
    } else {
      console.log(
        "[DevToDev] Error: Unable to find any of unityInstance. Modify your WebGL template to create unityInstance variable."
      );
    }
  },
  $identifierCallback: function (id) {
    sendMessage("OnIdentifierReceived", id.toString());
  },
  $loggerCallback: function (logLevel, message) {
    const logMessage = logLevel + "|" + logLevel.toUpperCase() + " " + message;
    sendMessage("OnLogReceived", logMessage);
  },

  setIdentifierCallback: function () {
    window.devtodev.setIdentifiersListener(identifierCallback);
  },
  setLoggerCallback: function () {
    window.devtodev.onDebugMessage(loggerCallback);
  },
  setIdentifierCallback__deps: [
    "$instance",
    "$getInstance",
    "$identifierCallback",
    "$sendMessage",
  ],
  setLoggerCallback__deps: [
    "$instance",
    "$getInstance",
    "$loggerCallback",
    "$sendMessage",
  ],
});
