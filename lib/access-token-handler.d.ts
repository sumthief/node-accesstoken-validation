export default class AccessTokenHandler {
    private tokenIntrospectionOptions;
    private introspectionHandler;
    private jwtTokenHandler;
    private options;
    constructor({ authority, apiName, apiSecret, requireHttpsMetadata, supportedTokens, tokenTypeHint, enableCache, cacheDuration, checkAudience, tolerance }: any);
    /**
     * Method to handle bearer token. If success, return the payload.
     */
    Handle(authorization: string, scheme?: string): Promise<any>;
    checkReferenceToken(token: string): Promise<any>;
    checkJwtToken(token: string): Promise<object>;
    private saveCache;
    private supportThisToken;
}
