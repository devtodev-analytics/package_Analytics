var UserCard = {
    userName: function(value) {
        window.devtodev.user.setName(UTF8ToString(value));
    },
    getUserName: function() {
        var result = window.devtodev.user.getName();
        if (result == null) result = '';
        var buffer = _malloc(lengthBytesUTF8(result) + 1);
        var bufferSize = lengthBytesUTF8(result) + 1;
        stringToUTF8(result, buffer, bufferSize);
        return buffer;
    },
    userAge: function(jsonValue) {
        var value = JSON.parse(UTF8ToString(jsonValue));
        window.devtodev.user.setAge(value);
    },
    getUserAge: function() {
        return window.devtodev.user.getAge();
    },
    userCheater: function(value) {
        window.devtodev.user.setCheater(!!value);
    },
    userTester: function(value) {
        window.devtodev.user.setTester(!!value);
    },
    userGender: function(value) {
        window.devtodev.user.setGender(value);
    },
    getUserGender: function() {
        return window.devtodev.user.getGender();
    },
    userEmail: function(value) {
        window.devtodev.user.setEmail(UTF8ToString(value));
    },
    getUserEmail: function() {
        var result = window.devtodev.user.getEmail();
        if (result == null) result = '';
        var buffer = _malloc(lengthBytesUTF8(result) + 1);
        var bufferSize = lengthBytesUTF8(result) + 1;
        stringToUTF8(result, buffer, bufferSize);
        return buffer;
    },
    userPhone: function(value) {
        window.devtodev.user.setPhone(UTF8ToString(value));
    },
    getUserPhone: function() {
        var result = window.devtodev.user.getPhone();
        if (result == null) result = '';
        var buffer = _malloc(lengthBytesUTF8(result) + 1);
        var bufferSize = lengthBytesUTF8(result) + 1;
        stringToUTF8(result, buffer, bufferSize);
        return buffer;
    },
    userPhoto: function(value) {
        window.devtodev.user.setPhoto(UTF8ToString(value));
    },
    getUserPhoto: function() {
        var result = window.devtodev.user.getPhoto();
        if (result == null) result = '';
        var buffer = _malloc(lengthBytesUTF8(result) + 1);
        var bufferSize = lengthBytesUTF8(result) + 1;
        stringToUTF8(result, buffer, bufferSize);
        return buffer;
    },
    userUnset: function(jsonKeys) {
        if (jsonKeys == null || UTF8ToString(jsonKeys).length == 0) {
            window.devtodev.user.unset(null);
            return;
        }

        var keys = JSON.parse(UTF8ToString(jsonKeys));
        window.devtodev.user.unset(keys);
    },
    userDelete: function() {
        window.devtodev.user.clearUser();
    },
    userSet: function(key, jsonValue) {
        if (jsonValue == null || UTF8ToString(jsonValue).length == 0) {
            window.devtodev.user.set(UTF8ToString(key), null);
            return;
        }
        var data = JSON.parse(UTF8ToString(jsonValue));
        window.devtodev.user.set(UTF8ToString(key), data);
    },
    userSetOnce: function(json) {
        var data = JSON.parse(UTF8ToString(json));
        var key = data.key;
        var value = data.value;
        window.devtodev.user.setOnce(key, value);
    },
    userGet: function(key) {
        var value = window.devtodev.user.getValue(UTF8ToString(key));
        if (value == null) return null;
        var json = JSON.stringify(value);
        var buffer = _malloc(lengthBytesUTF8(json) + 1);
        var bufferSize = lengthBytesUTF8(json) + 1;
        stringToUTF8(json, buffer, bufferSize);
        return buffer;
    },
};

mergeInto(LibraryManager.library, UserCard);