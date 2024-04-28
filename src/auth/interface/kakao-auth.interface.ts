export interface KakaoAuthUser {
	id: string;
	nickname: string;
	profileImage: string;
}

export interface KakaoOauthResponse {
	access_token: string
}

export interface KakaoProfileResponse {
	id: string;
    properties: {
		nickname: string;
		profile_image: string;
    };
}