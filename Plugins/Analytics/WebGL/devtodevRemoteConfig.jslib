mergeInto(LibraryManager.library, {
  dtd_setDefaults: function (jsonString) {
    try {
      var defaults = JSON.parse(UTF8ToString(jsonString));
      window.devtodev.remoteConfig.defaults = defaults;
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the setDefaults method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the setDefaults method was canceled!");
    }
  },
  dtd_getDefaults: function () {
    try {
      var result = window.devtodev.remoteConfig.defaults;
      if (typeof result === "undefined") return null;
      var json = JSON.stringify(result);
      var buffer = _malloc(lengthBytesUTF8(json) + 1);
      var bufferSize = lengthBytesUTF8(json) + 1;
      stringToUTF8(json, buffer, bufferSize);
      return buffer;
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the getDefaults method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the getDefaults method was canceled!");
    }
  },
  dtd_applyConfig: function () {
    try {
      window.devtodev.remoteConfig.applyConfig();
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the applyConfig method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the applyConfig method was canceled!");
    }
  },
  dtd_resetConfig: function () {
    try {
      window.devtodev.remoteConfig.resetConfig();
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the resetConfig method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the resetConfig method was canceled!");
    }
  },
  dtd_getGroupWaiting: function () {
    try {
      var json = JSON.stringify(
        window.devtodev.remoteConfig.groupDefinitionWaiting
      );
      var buffer = _malloc(lengthBytesUTF8(json) + 1);
      var bufferSize = lengthBytesUTF8(json) + 1;
      stringToUTF8(json, buffer, bufferSize);
      return buffer;
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the getGroupWaitingTime method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the getGroupWaitingTime method was canceled!");
    }
  },
  dtd_setGroupWaiting: function (time) {
    try {
      window.devtodev.remoteConfig.groupDefinitionWaiting = time;
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the setGroupWaitingTime method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the setGroupWaitingTime method was canceled!");
    }
  },
  dtd_cacheTestExperiment: function () {
    try {
      window.devtodev.remoteConfig.cacheTestExperiment();
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the cacheTestExperiment method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the cacheTestExperiment method was canceled!");
    }
  },
  dtd_remoteConfigGetConfig: function () {
    try {
      var result = window.devtodev.remoteConfig.config;
      if (typeof result === "undefined") return null;
      var json = JSON.stringify(result);
      var buffer = _malloc(lengthBytesUTF8(json) + 1);
      var bufferSize = lengthBytesUTF8(json) + 1;
      stringToUTF8(json, buffer, bufferSize);
      return buffer;
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the remoteConfigGetConfig method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the remoteConfigGetConfig method was canceled!");
      return null;
    }
  },
  dtd_invalidateActiveConfig: function () {
    try {
      window.devtodev.remoteConfig.invalidateActiveConfig();
    } catch (e) {
      window.devtodev
        .getLoggerInstance()
        .error("In the invalidateConfig method error has occurred: " + e);
      window.devtodev
        .getLoggerInstance()
        .error("Execution of the invalidateConfig method was canceled!");
    }
  },
});
