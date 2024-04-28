import ky, { Options } from 'ky';

const API = ky.create({ credentials: 'include' });

/**
 * GET 요청을 처리하는 API 유틸 함수 getAsync
 * @param T 요청 결과로 받을 데이터의 타입
 *
 * @param url 요청을 전송할 URL
 * @param config Ky 요청 관련 config (Options)
 * @returns 요청 성공 시 T 객체, 요청 실패 시 에러 throw
 */
export async function getAsync<T = undefined>(
    url: string,
    config?: Options,
): Promise<T> {
    const response = await API.get(url, { ...config });
    return response.json<T>();
}

/**
 * POST HTTP 요청을 처리하는 API 유틸 함수 postAsync
 * @param T 요청 결과로 받을 데이터의 타입
 *
 * @param url 요청을 전송할 URL
 * @param data body 에 넣어 보낼 데이터
 * @param config Ky 요청 관련 config (Options)
 * @returns 요청 성공 시 T 객체, 요청 실패 시 에러 throw
 */
export async function postAsync<T = undefined, D = unknown>(
    url: string,
    data: D,
    config?: Options,
): Promise<T> {
    const response = await API.post(url, { json: data, ...config });
    return response.json<T>();
}

/**
 * DELETE HTTP 요청을 처리하는 API 유틸 함수 deleteAsync
 * @param T 요청 결과로 받을 데이터의 타입
 *
 * @param url 요청을 전송할 URL
 * @param config Ky 요청 관련 config (Options)
 * @returns 요청 성공 시 T 객체, 요청 실패 시 에러 throw
 */
export async function deleteAsync<T = undefined>(
    url: string,
    config?: Options,
): Promise<T> {
    const response = await API.delete(url, config);
    return response.json<T>();
}

/**
 * PATCH HTTP 요청을 처리하는 API 유틸 함수 postAsync
 * @param T 요청 결과로 받을 데이터의 타입
 *
 * @param url 요청을 전송할 URL
 * @param data body 에 넣어 보낼 데이터
 * @param config Ky 요청 관련 config (Options)
 * @returns 요청 성공 시 T 객체, 요청 실패 시 에러 throw
 */
export async function patchAsync<T = undefined>(
    url: string,
    data: unknown,
    config?: Options,
): Promise<T> {
    const response = await API.patch(url, {
        json: data,
        ...config,
    });
    return response.json<T>();
}

/**
 * PUT HTTP 요청을 처리하는 API 유틸 함수 putAsync
 * @param T 요청 결과로 받을 데이터의 타입
 *
 * @param url 요청을 전송할 URL
 * @param data body 에 넣어 보낼 데이터
 * @param config Ky 요청 관련 config (Options)
 * @returns 요청 성공 시 T 객체, 요청 실패 시 에러 throw
 */
export async function putAsync<T = undefined>(
    url: string,
    data: unknown,
    config?: Options,
): Promise<T> {
    const response = await API.put(url, {
        json: data,
        ...config,
    });
    return response.json<T>();
}