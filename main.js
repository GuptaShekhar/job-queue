var kue = require('kue');
var jobs = kue.createQueue();

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
    console.log('Job', job.id, 'is done');
    done && done();
})

setInterval(function (){
    newJob('Send_Email')
}, 3000);