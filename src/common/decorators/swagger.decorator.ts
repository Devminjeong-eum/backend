import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiHeader,
	ApiHeaderOptions,
	ApiOperation,
	ApiParam,
	ApiParamOptions,
	ApiQuery,
	ApiQueryOptions,
	ApiResponse,
	getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '../dto/apiResponse.dto';
import { PaginationDto } from '../dto/pagination.dto';

interface ApiDocsParams {
	summary: string;
	headers?: ApiHeaderOptions[] | ApiHeaderOptions;
	params?: ApiParamOptions[] | ApiParamOptions;
	query?: ApiQueryOptions[] | ApiQueryOptions;
	response?: {
		statusCode: HttpStatus;
		schema: Type<any>;
		isPaginated?: boolean;
	};
}

export const ApiDocs = (apiDocs: ApiDocsParams) => {
	const appliedDecorators = [
		ApiOperation({
			summary: apiDocs.summary,
		}),
	];

	if (apiDocs.headers) {
		Array.isArray(apiDocs.headers)
			? apiDocs.headers.map((headerOption) =>
					appliedDecorators.push(ApiHeader(headerOption)),
				)
			: appliedDecorators.push(ApiHeader(apiDocs.headers));
	}

	if (apiDocs.params) {
		Array.isArray(apiDocs.params)
			? apiDocs.params.map((paramOption) =>
					appliedDecorators.push(ApiParam(paramOption)),
				)
			: appliedDecorators.push(ApiParam(apiDocs.params));
	}

	if (apiDocs.query) {
		Array.isArray(apiDocs.query)
			? apiDocs.query.map((queryOption) =>
					appliedDecorators.push(ApiQuery(queryOption)),
				)
			: appliedDecorators.push(ApiQuery(apiDocs.query));
	}

	if (apiDocs.response) {
		const { response } = apiDocs;
		appliedDecorators.push(
			ApiExtraModels(ApiResponseDto, PaginationDto, response.schema),
		);
		appliedDecorators.push(
			ApiResponse({
				status: response.statusCode,
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: getSchemaPath(ApiResponseDto) },
								{
									properties: {
										data: response.isPaginated
											? {
													allOf: [
														{
															$ref: getSchemaPath(
																PaginationDto,
															),
														},
														{
															properties: {
																data: {
																	type: 'array',
																	items: {
																		$ref: getSchemaPath(
																			response.schema,
																		),
																	},
																},
															},
														},
													],
												}
											: {
													$ref: getSchemaPath(
														response.schema,
													),
												},
									},
								},
							],
						},
					},
				},
			}),
		);
	}

	return applyDecorators(...appliedDecorators);
};
