import AccessTokenHandler from './access-token-handler';
import DiscoveryError from './discovery/discovery.error';
import InvalidTokenError from './errors/invalid-token-error';
import IntrospectionError from './introspection/introspection.error';

export = {
    AccessTokenHandler: AccessTokenHandler,
    InvalidTokenError: InvalidTokenError,
    DiscoveryError: DiscoveryError,
    IntrospectionError: IntrospectionError,
}