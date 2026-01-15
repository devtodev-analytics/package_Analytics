mergeInto(LibraryManager.library, {
  dtd_setIdentifierCallback__deps: [
    "$identifierCallback",
    "$dtd_sendMessage",
    "$dtd_getUnityInstance",
  ],
  dtd_setInitializationCompleteCallback__deps: [
    "$initializationCompleteCallback",
    "$dtd_sendMessage",
    "$dtd_getUnityInstance",
  ],
  dtd_setLoggerCallback__deps: [
    "$loggerCallback",
    "$dtd_sendMessage",
    "$dtd_getUnityInstance",
  ],
  dtd_setCountingTypeListener__deps: [
    "$countingTypeListener",
    "$dtd_sendMessage",
    "$dtd_getUnityInstance",
  ],
  dtd_setCountingTypeListener: function () {
    window.devtodev.setCountingTypeListener(countingTypeListener);
  },
  $countingTypeListener: function (countingType) {
    dtd_sendMessage("OnCountingTypeChanged", countingType.toString());
  },
  $identifierCallback: function (id) {
    dtd_sendMessage("OnIdentifierReceived", id.toString());
  },
  $loggerCallback: function (logLevel, message) {
    const logMessage = logLevel + "|" + logLevel.toUpperCase() + " " + message;
    dtd_sendMessage("OnLogReceived", logMessage);
  },
  dtd_setLoggerCallback: function () {
    window.devtodev.onDebugMessage(loggerCallback);
  },
  dtd_setIdentifierCallback: function () {
    window.devtodev.setIdentifiersListener(identifierCallback);
  },
  $initializationCompleteCallback: function () {
    dtd_sendMessage("OnInitializationCompleteReceived");
  },
  dtd_setInitializationCompleteCallback: function () {
    window.devtodev.setInitializationCompleteCallback(
      initializationCompleteCallback
    );
  },
});
