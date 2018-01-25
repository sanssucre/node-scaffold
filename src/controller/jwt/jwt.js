const assert = require('assert');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid').v4;
const { AuthError } = require('../../errors');

const keyFncs = Symbol('key functions instance');


/**
 *
 * @param keyId
 * @param expiration
 * @param issuer https://...
 * @param algorithm
 */
const KeyFunctions = ({ keyId, expiration = '1h', issuer, algorithm = 'RS256' }) => {
  const keyCache = {};
  return {

    getPublicKeyData(kid) {
      const keyFileName = `${kid}.key.pub`;
      return keyCache[keyFileName] || this.loadKeyData(keyFileName);
    },

    loadKeyData(keyFile) {
      const resolvedKeyFile = path.resolve(__dirname, keyFile);
      const keyData = fs.readFileSync(resolvedKeyFile);
      keyCache[keyFile] = keyData;
      return keyData;
    },

    buildOptions(uuid) {
      assert(uuid, 'uuid is required');
      return {
        header: {
          kid: keyId,
        },
        algorithm,
        expiresIn: expiration,
        issuer,
        subject: uuid,
        jwtid: uuidV4(),
      };
    },

    getToken(req) {
      const tokenValue = req.header('authorization');
      if (!tokenValue) return null;
      if (tokenValue.toLowerCase().indexOf('bearer') !== 0) return null;
      return tokenValue.split(' ')[1];
    },
  };
};

/**
 * Wrapper class for the generation of spec compliant auth jw token
 * and their verification
 */
class JWAuthToken {
  /**
   * @param options { keyId, expiration = '48h', issuer, algorithm = 'RS256' }
   */
  constructor(options = {}) {
    assert(options.keyId && options.issuer, 'keyId and issuer are required paramerters');
    this.kid = options.keyId;
    this[keyFncs] = KeyFunctions(options);
    this.private = this[keyFncs].loadKeyData(`${this.kid}.key`);
  }

  /**
   *
   * @param uuid of the agent
   * @param roles of the agent
   * @param name of the agent
   * @param partnerId id of the partner to which the agent belongs
   * @returns {*} Jwtoken
   */
  createToken({ uuid, roles, name, partnerId } = {}) {
    assert(uuid && roles && name, partnerId, 'uuid, roles, partnerId and name are required');
    const scopes = roles;
    const options = this[keyFncs].buildOptions(uuid, name);
    const keyData = {
      azp: uuid,
      given_name: name,
      partnerId,
      scopes,
    };
    return jwt.sign(keyData, this.private, options);
  }


  /**
   * @param req to verify
   * @return {{participantUUID, conversationUUID, sessionId}}
   */
  verify(req) {
    const jwToken = this[keyFncs].getToken(req);
    if (!jwToken) throw new AuthError('no key provided', 'MissingKey');
    const decoded = jwt.decode(jwToken, { complete: true });
    if (!decoded || !decoded.header.kid) throw new AuthError('invalid jwt value', 'InvalidKeyFormat');
    const kid = decoded.header.kid;
    const secretKeyData = this[keyFncs].getPublicKeyData(kid);
    try {
      const { scopes, azp } = jwt.verify(jwToken, secretKeyData);
      req.agent = {
        roles: scopes,
        uuid: azp,
      };
    } catch (e) {
      if (e.toString() === 'TokenExpiredError: jwt expired') throw new AuthError('expired jw token', 'ExpiredToken');
      throw e;
    }
  }
}

module.exports = {
  JWAuthToken,
};

