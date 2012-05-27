// to run all exercises:
//   $ node node_runner.js
//
// to run single file:
//   $ node node_runner.js exercises/my_file_name.js

var assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  vm = require('vm');


var numPasses = 0,
  failures = [];

var context = {
  assert: function(condition, message){
    message = message ? (' - ' + message) : '';
    if (condition){
      console.log('PASS' + message);
      numPasses++;
    } else {
      message = 'FAIL' + message;
      console.error(message);
      failures.push(['', message]); // TODO find the filename?
    }
  },
  console: console,
  deepEqual: function(obj1, obj2){
    try {
      assert.deepEqual(obj1, obj2);
      return true;
    } catch (e){
      return false;
    }
  },
  setTimeout: setTimeout
};

function runExercise(filename){
  fs.readFile(filename, function(err, code){
    if (err) throw new Error(err);

    console.log(path.basename(filename) + '\n------------------');

    try {
      vm.runInNewContext(code, context);
    } catch (e){
      failures.push([filename, 'ERROR - ' + e.message]);
    }

    console.log('');
  });
}


var singleFile = process.argv[2];
if (singleFile){
  runExercise(singleFile);
} else {
  var dir = 'exercises/',
    files = fs.readdirSync(dir);

  files.forEach(function(file){
    runExercise(dir + file);
  });
}

process.on('exit', function(){
  var numFailures = failures.length;
  if (numFailures){
    console.log('\n\nFAILURES\n------------------');
    var failure;
    for (var i = 0; i < numFailures; i++){
      failure = failures[i];
      console.log(failure[0] + ': ' + failure[1]);
    }
  }

  console.log('\nPassed: ' + numPasses + '  Failed: ' + numFailures);
});
