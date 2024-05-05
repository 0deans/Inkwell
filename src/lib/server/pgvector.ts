import { sql, type AnyColumn, type SQLWrapper } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';

export const vector = customType<{
	data: number[];
	driverData: string;
	config: { dimensions: number };
}>({
	dataType(config) {
		if (!config) {
			return 'vector';
		}
		return `vector${config.dimensions})`;
	},
	toDriver(value) {
		return toSql(value);
	},
	fromDriver(value) {
		return fromSql(value);
	}
});

function fromSql(value: string) {
	return value
		.substring(1, value.length - 1)
		.split(',')
		.map((v) => parseFloat(v));
}

function toSql(value: number[]) {
	return JSON.stringify(value);
}

export function l2Distance(column: SQLWrapper | AnyColumn, value: number[]) {
	return sql`${column} <-> ${toSql(value)}`;
}

export function maxInnerProduct(column: SQLWrapper | AnyColumn, value: number[]) {
	return sql`${column} <#> ${toSql(value)}`;
}

export function cosineDistance(column: SQLWrapper | AnyColumn, value: number[]) {
	return sql`${column} <=> ${toSql(value)}`;
}
