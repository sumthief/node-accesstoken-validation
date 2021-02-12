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
const jose_1 = require("jose");
const url_1 = __importDefault(require("url"));
const client_discovery_1 = __importDefault(require("../discovery/client-discovery"));
const discovery_document_response_1 = __importDefault(require("../discovery/discovery-document-response"));
const invalid_token_error_1 = __importDefault(require("../errors/invalid-token-error"));
const token_validation_model_1 = __importDefault(require("../models/token-validation.model"));
class JwtTokenHandler {
    constructor(options) {
        this.options = options;
        if (!this.isSecureScheme(this.options.authority)) {
            throw new invalid_token_error_1.default(options.authority, "HTTPS required", null);
        }
    }
    /**
     * Validate JWT (In fact JWS)
     */
    Handle(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isSecureScheme(token))
                yield client_discovery_1.default.loadJsonWebKeySet(this.options.authority);
            var discoveryDocument = discovery_document_response_1.default.getInstance();
            var claims = jose_1.JWT.verify(token, discoveryDocument.KeySet, { clockTolerance: `${this.options.tolerance} secs` });
            if (!this.options.checkAudience)
                return claims;
            if (token_validation_model_1.default.hasClaims(claims, "aud", this.options.audience))
                return claims;
            throw new invalid_token_error_1.default(this.options.authority, `Failed to validate the token. Audience validation failed: ${this.options.audience}`, token);
        });
    }
    /// <summary>
    /// Determines whether uses a secure scheme according to the policy.
    /// </summary>
    isSecureScheme(url) {
        if (this.options.requireHttpsMetadata) {
            var parsedUrl = url_1.default.parse(url);
            return parsedUrl.protocol === "https:";
        }
        return true;
    }
}
exports.default = JwtTokenHandler;
//# sourceMappingURL=jwt-token-handler.js.map