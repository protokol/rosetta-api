import Joi from "joi";

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

export const public_key = Joi.object({
	hex_bytes: Joi.string().required(),
	curve_type: Joi.string().required(),
}).required();

export const operations = Joi.array()
	.items(
		Joi.object({
			operation_identifier: Joi.object({ index: Joi.number().required() }).required(),
			related_operations: Joi.array().items(Joi.object({ index: Joi.number().required() })),
			type: Joi.string().required(),
			status: Joi.string().allow(""),
			amount: Joi.object({ value: Joi.string().required() }).unknown(true).required(),
			account: account_identifier,
			metadata,
		}).unknown(true),
	)
	.required();

export const options = Joi.object({ sender: Joi.string().required() }).required().unknown(true);

export const public_keys = Joi.array().items(public_key).required().min(1);

export const signatures = Joi.array()
	.items(Joi.object({ hex_bytes: Joi.string().required() }).unknown(true))
	.required()
	.min(1);
