[![Build Status](https://travis-ci.org/jsdevel/node-jsave.png)](https://travis-ci.org/jsdevel/node-jsave)

# jsave

Save and load JSON to and from disk.

`jsave` adds a non enumerable `save` method to objects and arrays.  Once you call
`jsave({})`, the object then has a `save` method.  This means you can treat your
data like you normally would, and when you're ready to save your changes to
disk, just call `save()`.  It's really that simple.

You can also load data from an existing file by calling `jsave.load(filePath);`.

Both `save` and `load` are unobtrusive.  The file path you provide will
be created in the event it doesn't exist.  Attempting to `save` or `load` to a directory
will throw an error.

Because `jsave` adds a save method to your data, only objects and Arrays are allowed.
Allowing primitives doesn't make much sense, but if you can find a way to make it so,
please issue a pull request!

##Example

###Saving data

Here you can see that jsave _does not_ change the way you interact with your data.
`jsave` adds a non enumerable `#save` method to objects and arrays.

````javascript
var jsave = require('jsave');
var file = '/tmp/some-file';//some-file doesn't exist yet
var myData = {};

jsave(myData).to(file);//now some-file exists and is empty

myData.sushi = 'rolled';
myData.save();//some-file now contains '{"sushi":"rolled"}';
````

###Loading data

Here we'll load some existing JSON that's already on disk.

````javascript
var jsave = require('jsave');
var myData = jsave.load('/tmp/some-other-file');
myData.boo = 'ahhhh';
myData.save();//as you would expect, /tmp/some-other-file now has boo ahhhh :)
````

##LICENSE
``````
The MIT License (MIT)

Copyright (c) 2014 Joseph Spencer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
``````
