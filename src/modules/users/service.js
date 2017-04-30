import sendEmail from '../../services/email';
import * as userRepository from './repository';

// ctx.state.user -> usuário que fez a req fica no contexto

//   para mandar email ->
//   let email = 'lucas.anjos@fcamara.com.br';
//   let subject = 'Notificação';
//   let name = 'Lucas Anjos';
//   await sendEmail.sendBasicEmail(email, subject, name);

export async function createUser(ctx) {

  const user = await userRepository.createUser(ctx.request.body.user);

  if (!user || user.error)
    ctx.throw(400, user)

  const token = user.generateToken()
  const response = user.toJSON()

  delete response.password

  ctx.body = {
    user: response,
    token
  }
}

export async function getUsers(ctx) {

  const users = await userRepository.getUsers();

  if (!users || users.error)
    ctx.throw(400, user);

  ctx.body = {
    users
  }

}

export async function getUser(ctx, next) {

  const param = ctx.params.id;

  const user = await userRepository.getUser(param);

  if (!user || user.error)
    ctx.throw(400, user);

  ctx.body = {
    user
  }

  if (next) {
    return next()
  }

}

export async function updateUser(ctx) {

  let user = ctx.body.user; // usuario completo

  Object.assign(user, ctx.request.body.user) // aqui ele compara o user com o obj e só altera o que mudou

  user = await userRepository.updateUser(user);

  if (!user || user.error)
    ctx.throw(400, user);

  ctx.body = {
    user
  }

}

export async function deleteUser(ctx) {

  let user = ctx.body.user

  user = userRepository.deleteUser(user);

  if (!user || user.error)
    ctx.throw(400, user);

  ctx.status = 200
  ctx.body = {
    success: true
  }

}
