import config from '../../config/env/common';
import sendgrid from 'sendgrid';
import handlebars from 'handlebars';
import fs from 'fs';

const SENDGRID_KEY = config.sendGridKey;
const Sendgrid = sendgrid(SENDGRID_KEY);
const Helper = sendgrid.mail;
const from_email = new Helper.Email('contato@fcsolutions.com.br', 'FC-Solutions');

class EmailService {

  async sendBasicEmail(email, subject, name) {

    let to_email = new Helper.Email(email);
    let template = fs.readFileSync('src/emailsTemplate/basic.html', 'utf-8');

    template = await this.buildEmailTemplate(template, name);

    let content = new Helper.Content("text/html", template);
    let mail = new Helper.Mail(from_email, subject, to_email, content);
    let request = Sendgrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    Sendgrid.API(request, function (err, res) {
      if (err)
        return console.log('Erro ao enviar email!');
      return console.log('Email enviado!');
    });
  }

  async buildEmailTemplate(template, name) {
    let data = {
      name: name
    };
    let precompile = handlebars.compile(template);
    let html = precompile(data);
    return html;
  }

}

module.exports = new EmailService();
