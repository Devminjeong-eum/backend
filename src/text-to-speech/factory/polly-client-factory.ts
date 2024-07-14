import { PollyClient } from "@aws-sdk/client-polly";

const REGION = "ap-northeast-2";

export const createAwsPollyClientFactory = () => {
    const pollyClient = new PollyClient({ region: REGION });
    return pollyClient;
}