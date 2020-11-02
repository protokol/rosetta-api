import { Enums, Identities, Interfaces } from "@arkecosystem/crypto";

import { currency } from "./constants";
import { Operation, OperationType, OpStatus, Transaction } from "./interfaces";

export const buildTransactionInfo = (
	transaction: Interfaces.ITransactionData,
	forger: string | undefined,
	isGenesisSender: boolean,
): Transaction => {
	const sender = Identities.Address.fromPublicKey(transaction.senderPublicKey!);

	const transactionInfo: Transaction = {
		transaction_identifier: {
			hash: transaction.id!,
		},
		operations: [],
	};

	const operationIndex = { value: 0 };
	// add fee operations
	const fee = transaction.fee.toFixed();
	transactionInfo.operations.push(...constructOperations(operationIndex, OperationType.FEE, fee, sender, forger));

	switch (transaction.type) {
		case Enums.TransactionType.Transfer:
			transactionInfo.operations.push(
				...constructOperations(
					operationIndex,
					OperationType.TRANSFER,
					transaction.amount.toFixed(),
					isGenesisSender ? undefined : sender,
					transaction.recipientId,
				),
			);
			break;
		case Enums.TransactionType.MultiPayment:
			for (const payment of transaction.asset!.payments!) {
				transactionInfo.operations.push(
					...constructOperations(
						operationIndex,
						OperationType.MULTI_PAYMENT,
						payment.amount.toFixed(),
						sender,
						payment.recipientId,
					),
				);
			}
			break;
	}

	return transactionInfo;
};

export const constructOperations = (
	index: { value: number },
	type: OperationType,
	value: string,
	sender: string | undefined,
	recipient: string | undefined,
): Operation[] => {
	const operations: Operation[] = [];
	if (sender) {
		operations.push({
			operation_identifier: { index: index.value++ },
			type,
			status: OpStatus.SUCCESS,
			amount: {
				value: `-${value}`,
				currency,
			},
			account: {
				address: sender,
			},
		});
	}

	if (recipient) {
		const operation: Operation = {
			operation_identifier: { index: index.value++ },
			type,
			status: OpStatus.SUCCESS,
			amount: {
				value,
				currency,
			},
			account: {
				address: recipient,
			},
		};
		if (sender) {
			operation.related_operations = [{ index: index.value - 2 }];
		}
		operations.push(operation);
	}

	return operations;
};
