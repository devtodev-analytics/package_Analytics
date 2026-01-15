mergeInto(LibraryManager.library, {
  // Universal SendMessage wrapper
  // Works with all Unity WebGL versions

  $dtd_getUnityInstance: function () {
    // Unity 2020+ uses unityInstance
    if (typeof unityInstance !== "undefined" && unityInstance !== null) {
      return unityInstance;
    }

    // Unity 2018-2019 uses gameInstance
    if (typeof gameInstance !== "undefined" && gameInstance !== null) {
      return gameInstance;
    }

    // Some custom templates use myGameInstance
    if (typeof myGameInstance !== "undefined" && myGameInstance !== null) {
      return myGameInstance;
    }

    return null;
  },
  dtd_SyncToIDB: function () {
    if (!Module._d2dSyncState)
      Module._d2dSyncState = { syncing: false, pending: false };

    const st = Module._d2dSyncState;
    if (st.syncing) {
      st.pending = true;
      return;
    } // already syncing but needs another sync after this

    st.syncing = true;
    FS.syncfs(false, function (err) {
      st.syncing = false;
      if (err) {
        console.error("IDBFS flush failed", err);
        st.pending = false; // reset to avoid infinite loop
        return;
      }
      if (st.pending) {
        // new records appeared while flushing — repeat
        st.pending = false;
        _dtd_SyncToIDB(); // start another flush
      } else {
        console.log("IDBFS flushed");
      }
    });
  },

  dtd_PopulateFromIDB: function () {
    FS.syncfs(true, function (err) {
      if (err) console.error("IDBFS populate failed", err);
      else console.log("IDBFS populated");
    });
  },
  $dtd_sendMessage: function (methodName, message) {
    const instance = dtd_getUnityInstance();

    // Try instance.SendMessage first (Unity 2020+, 2018-2019 with gameInstance)
    if (instance && instance.SendMessage) {
      try {
        if (typeof message !== "undefined") {
          // Call with 3 parameters
          instance.SendMessage(
            "[devtodev_AsyncOperationDispatcher]",
            methodName,
            message
          );
        } else {
          // Call with 2 parameters (no message)
          instance.SendMessage(
            "[devtodev_AsyncOperationDispatcher]",
            methodName
          );
        }
        return;
      } catch (e) {
        console.error("[DevToDev] SendMessage Error:", e);
        return;
      }
    }

    // Fallback to global SendMessage (older Unity versions)
    if (typeof SendMessage !== "undefined") {
      try {
        if (typeof message !== "undefined") {
          // Call with 3 parameters
          SendMessage(
            "[devtodev_AsyncOperationDispatcher]",
            methodName,
            message
          );
        } else {
          // Call with 2 parameters (no message)
          SendMessage("[devtodev_AsyncOperationDispatcher]", methodName);
        }
        return;
      } catch (e) {
        console.error("[DevToDev] SendMessage Error:", e);
        return;
      }
    }

    // If nothing works, log error
    console.error(
      "[DevToDev] Error: Unable to find Unity instance or SendMessage. " +
        "GameObject:",
      "[devtodev_AsyncOperationDispatcher]",
      "Method:",
      methodName
    );
  },
});
