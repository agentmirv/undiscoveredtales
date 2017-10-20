//=========================================================
function MyClass() {
    ///
}

MyClass.prototype.method = function () {
    ///
}

//=========================================================
function MySubClass() {
    MyClass.call(this);
}

MySubClass.prototype = Object.create(MyClass.prototype);
MySubClass.prototype.constructor = MySubClass;

MySubClass.prototype.method = function () {
    MyClass.prototype.method.call(this);
}

