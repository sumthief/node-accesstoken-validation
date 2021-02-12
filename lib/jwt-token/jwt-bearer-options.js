"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JwtBearerOptions {
    constructor(
    /// <summary>
    /// Gets or sets the Authority to use when making OpenIdConnect calls.
    /// </summary>
    authority, 
    /// <summary>
    /// Gets or sets if HTTPS is required for the metadata address or authority.
    /// The default is true. This should be disabled only in development environments.
    /// </summary>
    requireHttpsMetadata = true, 
    /// <summary>
    /// Gets or sets the audience for any received OpenIdConnect token.
    /// </summary>
    /// <value>
    /// The expected audience for any received OpenIdConnect token.
    /// </value>
    audience = "", checkAudience = true, tolerance = 0) {
        this.authority = authority;
        this.requireHttpsMetadata = requireHttpsMetadata;
        this.audience = audience;
        this.checkAudience = checkAudience;
        this.tolerance = tolerance;
    }
}
exports.default = JwtBearerOptions;
//# sourceMappingURL=jwt-bearer-options.js.map