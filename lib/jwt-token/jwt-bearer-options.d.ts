export default class JwtBearerOptions {
    authority: string;
    requireHttpsMetadata: boolean;
    audience: string;
    checkAudience: boolean;
    tolerance: number;
    constructor(authority: string, requireHttpsMetadata?: boolean, audience?: string, checkAudience?: boolean, tolerance?: number);
}
