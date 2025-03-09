import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';

import { WordViewerIdInterceptor } from './word-viewer-id.interceptor';

export const USE_WORD_VIEWER_ID_INTERCEPTOR = Symbol(
	'USE_WORD_VIEWER_ID_INTERCEPTOR',
);

export const UseWordViewerIdInterceptor = () => {
	return applyDecorators(
		SetMetadata(USE_WORD_VIEWER_ID_INTERCEPTOR, true),
		UseInterceptors(WordViewerIdInterceptor),
	);
};
