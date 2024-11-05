import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string({}, [
      rules.maxLength(100),
    ]),
    last_name: schema.string({}, [
      rules.maxLength(100),
    ]),
    nickname: schema.string({}, [
      rules.maxLength(150),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
      rules.confirmed('passwordConfirmation'),
    ]),
  });
  public messages: CustomMessages = {
    'first_name.required': 'First name is required',
    'last_name.required': 'Last name is required',
    'nickname.required': 'Nickname is required',
    'email.required': 'Email is required',
    'email.email': 'Enter a valid email address',
    'email.unique': 'This email is already registered',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 8 characters',
    'password.confirmed': 'Passwords do not match'
  }
}

