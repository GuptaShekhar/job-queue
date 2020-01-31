var kue = require('kue');
var jobs = kue.createQueue();


// Job queue
function newJob (name){
    name = name || 'Shekhar Gupta'
    var job = jobs.create('new_job', {
        name: name
    });
    job
    .on('complete', function (){
        console.log('Job', job.id, 'with name', job.data.name, 'is done');
    })
    .on('failed', function(){
        console.log('Job', job.id, 'with name', job.data.name, 'failed');
    });
    job.save();
}

jobs.process('new_job', function (job, done){
    // console.log('Job', job.id, 'is done');
    done && done();
})

setInterval(function (){
    newJob('Send_Email')
}, 3000);



//parent child queue
function parentJob (done){
    var job = jobs.create('parent', {
      type: 'PARENT'
    });
    job
      .on('complete', function (){
        console.log('Job', job.id, 'of type', job.data.type, 'is done');
        done();
      })
      .on('failed', function (){
        console.log('Job', job.id, 'of type', job.data.type, 'has failed');
        done();
      })
    job.save();
  }
  
  function childJob (done){
    var job = jobs.create('child', {
      type: 'CHILD'
    });
    job
      .on('complete', function (){
        console.log('Job', job.id, 'of type', job.data.type, 'is done');
        done();
      })
      .on('failed', function (){
        console.log('Job', job.id, 'of type', job.data.type, 'has failed');
        done();
      })
    job.save();
  }
  
  jobs.process('parent', function (job, done){
    /* carry out all the parent job functions here */
    childJob(done);
  })
  
  jobs.process('child', function (job, done){
    /* carry out all the child job functions here */
    done();
  })
  
  setInterval(function (){
      parentJob(function () {})
  },3000);