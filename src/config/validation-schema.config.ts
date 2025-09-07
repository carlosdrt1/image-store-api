import * as Joi from 'joi';

export const validationConfigSchema = Joi.object({
  PORT: Joi.number().integer().positive().default(3000),
  DYNAMO_USERS_TABLE: Joi.string().required(),
  DYNAMO_IMAGES_TABLE: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_SESSION_TOKEN: Joi.string().optional(),
  AWS_REGION: Joi.string().required().default('us-east-2'),
  AWS_BUCKET_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
