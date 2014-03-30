'use strict';

describe('jsave', function(){
  var assert = require('assert');
  var jsave = require('../lib/jsave');
  var fs = require('fs');
  var path = require('path');

  it('is a function', function(){
    jsave.should.be.type('function');
  });

  it('accepts arrays', function(){
    jsave([]);
  });

  it('accepts objects', function(){
    jsave({});
  });

  it('does not accept literals', function(){
    [5,'asdf',null].forEach(function(literal){
      assert.throws(function(){
        jsave(literal);
      }, null, 'literal was: '+literal);
    });
  });

  describe('with a valid type', function(){
    var obj;
    var sut;
    var file;

    beforeEach(function(done){
      setTimeout(function(){
        file = '/tmp/some/'+Date.now()+'/path/'+Date.now();
        obj = {a:5};
        sut = jsave(obj);
        done();
      }, 5);
    });

    it('returns a to method', function(){
      sut.to.should.be.type('function');
    });

    describe('#to', function(){
      it('expects a string', function(){
        assert.throws(function(){
          sut.to(5);
        }, /^TypeError:\spath\smust\sbe\sa\sstring/);
      });

      it('throws an error if the file is not a file', function(){
        assert.throws(function(){
          sut.to('/tmp');
        }, /^Error:\sExpected\s\/tmp to be a file./);
      });

      it('creates files that do not exist', function(){
        sut.to(file);
        assert(exists(file), 'file created');
        assert(fs.statSync(file).isFile(), 'file is file');
        assert.equal(read(file), '', 'file contents are empty');
      });

      describe('once called', function(){
        beforeEach(function(){
          sut.to(file);
        });

        it('assigns a non enumberable save method to obj', function(){
          assert(!obj.propertyIsEnumerable('save'), 'save is not enumerable');
          obj.save.should.be.type('function');
        });

        describe('#save', function(){
          it('saves data to the file', function(){
            read(file).should.equal('');
            obj.save();
            read(file).should.equal('{"a":5}');
          });
          it('allows new data to be saved as well', function(){
            obj.jimmie = 'some person';
            obj.save();
            JSON.parse(read(file)).jimmie.should.equal('some person');
          });
        });
      });
    });

    describe('#load', function(){
      it('is a method', function(){
        jsave.load.should.be.type('function');
      });

      it('expects a string', function(){
        assert.throws(function(){
          jsave.load(null);
        }, /TypeError:\spath\smust/);
      });

      it('creates non existing files', function(){
        assert(!exists(file), 'file does not exist');
        jsave.load(file);
        assert(exists(file), 'file was created');
      });

      it('sets the default value to an object leteral for non objects', function(){
        sut.to(file);
        write(file, null);
        assert.throws(function(){
          jsave.load(file);
        });
      });

      it('accepts arrays', function(){
        sut.to(file);
        write(file, []);
        jsave.load(file).length.should.equal(0);
      });

      it('returns the saved data', function(){
        sut.to(file);
        write(file, {can:{you:{say:'hello!'}}});
        jsave.load(file).can.you.say.should.equal('hello!');
      });

      describe('return data', function(){
        var obj;
        beforeEach(function(){
          sut.to(file);
          write(file, {wow:'you'});
          obj = jsave.load(file);
        });

        it('has a #save method', function(){
          obj.save.should.be.type('function');
        });

        describe('#save', function(){
          it('saves data', function(){
            obj.wow = 'me';
            obj.save();
            JSON.parse(read(file)).wow.should.equal('me');
          });
        });
      });
    });
  });

  function exists(file){
    return fs.existsSync(file);
  }

  function read(file){
    return ''+fs.readFileSync(file);
  }

  function write(file, data){
    fs.writeFileSync(file, JSON.stringify(data));
  }
});
