'use strict';
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('config');
var logger = require('../helpers/logger');
var path = require('path');

// init cusumer to export to queues
var consumer = {};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpTransport(config.get('mailer')));

// verify connection configuration
transporter.verify(function(error, success) {
   if (error) {
        logger.error("verify mail server error: "+error);
   } else {
        logger.info('Mail Server is ready to take our messages');
   }
});


// Using templates
var EmailTemplate = require('email-templates').EmailTemplate;

// Create consumer for queues
consumer.name = 'email';
consumer.task = function(job, done){
    var data = job.data;
    logger.debug("data :" + data)
    var templateDir = path.join(__dirname, '../templates/', data.template);
    // create template renderer
    var letter = new EmailTemplate(templateDir);
    letter.render(data.emailContent, function(err, results) {
      if (err) { return logger.error(err)}
      // logger.debug(results);
      transporter.sendMail({
          from: config.get('mailer.from'),
          to: data.to,
          subject: data.title,
          html: results.html
      },(err,res) =>{
        if (err) {return logger.err(err)};
      });

    });
    done();
};

module.exports = consumer;
