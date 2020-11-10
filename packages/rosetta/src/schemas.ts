import Joi from "@hapi/joi";

export const metadata = Joi.object().optional().unknown(true);

export const network_identifier = Joi.object({
	blockchain: Joi.string().required(),
	network: Joi.string().required(),
}).required();

export const block_identifier = Joi.object({
	index: Joi.number(),
	hash: Joi.string(),
}).required();

export const block_identifier_required = Joi.object({
	index: Joi.number().required(),
	hash: Joi.string().required(),
}).required();

export const transaction_identifier = Joi.object({
	hash: Joi.string().required(),
}).required();

export const account_identifier = Joi.object({
	address: Joi.string().required(),
}).required();
