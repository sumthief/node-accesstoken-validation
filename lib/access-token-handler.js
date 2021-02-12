"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const authentication_options_1 = __importDefault(require("./authentication-options"));
const invalid_token_error_1 = __importDefault(require("./errors/invalid-token-error"));
const oauth2_introspection_handler_1 = __importDefault(require("./introspection/oauth2-introspection-handler"));
const oauth2_introspection_options_1 = __importDefault(require("./introspection/oauth2-introspection-options"));
const token_types_1 = __importDefault(require("./introspection/token-types"));
const jwt_bearer_options_1 = __importDefault(require("./jwt-token/jwt-bearer-options"));
const jwt_token_handler_1 = __importDefault(require("./jwt-token/jwt-token-handler"));
const supported_tokens_model_1 = require("./models/supported-tokens.model");
const token_retriever_1 = __importDefault(require("./token.retriever"));
const myCache = new node_cache_1.default({ useClones: false });
class AccessTokenHandler {
    constructor({ authority, apiName = "", apiSecret = "", requireHttpsMetadata = true, supportedTokens = supported_tokens_model_1.SupportedTokens.Both, tokenTypeHint = token_types_1.default.AccessToken, enableCache = true, cacheDuration = 300, checkAudience = true, tolerance = 0 }) {
        this.options = new authentication_options_1.default(authority, apiName, apiSecret, supportedTokens, tokenTypeHint, enableCache, cacheDuration);
        this.jwtTokenHandler = new jwt_token_handler_1.default(new jwt_bearer_options_1.default(authority, requireHttpsMetadata, apiName, checkAudience, tolerance));
        if (apiSecret === "") {
            this.options.supportedTokens = supported_tokens_model_1.SupportedTokens.Jwt;
            return;
        }
        if (apiName === "")
            throw new Error('apiName must be configured if ApiSecret is set.');
        this.tokenIntrospectionOptions = new oauth2_introspection_options_1.default(authority, apiName, apiSecret, requireHttpsMetadata, tokenTypeHint, enableCache, cacheDuration);
        this.introspectionHandler = new oauth2_introspection_handler_1.default(this.tokenIntrospectionOptions);
    }
    /**
     * Method to handle bearer token. If success, return the payload.
     */
    Handle(authorization, scheme = "bearer") {
        return __awaiter(this, void 0, void 0, function* () {
            const token = token_retriever_1.default.Retrieve(authorization, scheme);
            if (token == null) {
                throw new invalid_token_error_1.default(this.options.authority, "Token not found", token);
            }
            const tokenType = token_retriever_1.default.FindType(token);
            if (!this.supportThisToken(tokenType))
                throw new invalid_token_error_1.default(this.options.authority, "Not supported token type", token);
            if (this.options.enableCache) {
                var responseCached = myCache.get(token);
                if (responseCached != undefined)
                    return responseCached;
            }
            if (tokenType == supported_tokens_model_1.SupportedTokens.Reference) {
                return this.checkReferenceToken(token);
            }
            if (tokenType == supported_tokens_model_1.SupportedTokens.Jwt) {
                return this.checkJwtToken(token);
            }
        });
    }
    checkReferenceToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield this.introspectionHandler.Introspect(token);
            this.saveCache(token, response);
            return response;
        });
    }
    checkJwtToken(token) {
        var response = this.jwtTokenHandler.Handle(token);
        this.saveCache(token, response);
        return response;
    }
    saveCache(token, response) {
        if (this.options.enableCache)
            myCache.set(token, response, this.options.cacheDuration);
    }
    supportThisToken(tokenType) {
        if (this.options.supportedTokens == supported_tokens_model_1.SupportedTokens.Both)
            return true;
        return tokenType == this.options.supportedTokens;
    }
}
exports.default = AccessTokenHandler;
//# sourceMappingURL=access-token-handler.js.map