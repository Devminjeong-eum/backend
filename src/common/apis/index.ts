import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

/**
 * API 요청에서 범용적으로 사용할 Axios Instance 생성
 * baseURL, responseType 같은 공용 속성을 일괄적으로 적용
 */
const API = axios.create({
	withCredentials: true,
});

/**
 * GET 요청을 처리하는 유틸 API 함수 getAsync
 * @param T 요청 결과로 받을 데이터의 타입
 *
 * @param url API 요청을 보낼 url (string)
 * @param config API 요청과 관련된 config (AxiosRequestConfig)
 * @returns API 요청 성공 시 받을 객체 (T)
 */
export async function getAsync<T>(url: string, config?: AxiosRequestConfig) {
	const response = await API.get<T, AxiosResponse<T, unknown>, unknown>(url, {
		...config,
	});
	return response.data;
}

/**
 * POST 요청을 처리하는 유틸 API 함수 postAsync
 * @param T 요청 결과로 받을 데이터의 타입
 * @param D API 요청 시 서버에 전송할 데이터의 타입
 *
 * @param url API 요청을 보낼 url (string)
 * @param data API 요청과 함께 동봉할 data
 * @param config API 요청과 관련된 config (AxiosRequestConfig)
 * @returnsAPI 요청 성공 시 받을 객체 (T)
 */
export async function postAsync<T, D = unknown>(
	url: string,
	data: D,
	config?: AxiosRequestConfig,
) {
	const response = await API.post<T, AxiosResponse<T, D>, D>(url, data, {
		...config,
	});
	return response.data;
}

/**
 * PATCH 요청을 처리하는 유틸 API 함수 patchAsync
 * @param T 요청 결과로 받을 데이터의 타입
 * @param D API 요청 시 서버에 전송할 데이터의 타입
 *
 * @param url API 요청을 보낼 url (string)
 * @param data API 요청과 함께 동봉할 data
 * @param config API 요청과 관련된 config (AxiosRequestConfig)
 * @returns API 요청 성공 시 받을 객체 (T)
 */
export async function patchAsync<T, D>(
	url: string,
	data: D,
	config?: AxiosRequestConfig,
) {
	const response = await API.patch<T, AxiosResponse<T, D>, D>(url, data, {
		...config,
	});

	return response.data;
}

/**
 * PUT 요청을 처리하는 유틸 API 함수 putAsync
 * @param T 요청 결과로 받을 데이터의 타입
 * @param D API 요청 시 서버에 전송할 데이터의 타입
 *
 * @param url API 요청을 보낼 url (string)
 * @param data API 요청과 함께 동봉할 data
 * @param config API 요청과 관련된 config (AxiosRequestConfig)
 * @returns API 요청 성공 시 받을 객체 (T)
 */
export async function putAsync<T, D>(
	url: string,
	data: D,
	config?: AxiosRequestConfig,
) {
	const response = await API.patch<T, AxiosResponse<T, D>, D>(url, data, {
		...config,
	});

	return response.data;
}

/**
 * DELETE 요청을 처리하는 유틸 Api 함수 deleteAsync
 * @param T 요청 결과로 받을 데이터의 타입
 * @param D Api 요청 시 서버에 전송할 데이터의 타입
 *
 * @param url Api 요청을 보낼 url (string)
 * @param config Api 요청과 관련된 config (AxiosRequestConfig)
 * @returns API 요청 성공 시 받을 객체 (T)
 */
export async function deleteAsync<T, D>(
	url: string,
	data?: D,
	config?: AxiosRequestConfig,
) {
	const response = await API.delete<T, AxiosResponse<T, unknown>, unknown>(
		url,
		{
			...config,
			data,
		},
	);

	return response.data;
}
