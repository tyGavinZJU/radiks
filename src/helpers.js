import * as blockstack from 'blockstack';

const valueToString = (value, clazz) => {
  if (clazz === Boolean) {
    return value ? 'true' : 'false';
  } if (clazz === Number) {
    return String(value);
  }
  return value;
};

const stringToValue = (value, clazz) => {
  if (clazz === Boolean) {
    return value === 'true';
  }
  if (clazz === Number) {
    return parseFloat(value);
  }
  return value;
};

export const decryptObject = (encrypted, Model) => {
  const decrypted = Object.assign({}, encrypted);
  const { schema } = Model;
  Object.keys(encrypted).forEach((key) => {
    const value = encrypted[key];
    const clazz = schema[key];
    if (clazz && !clazz.decrypted) {
      try {
        decrypted[key] = stringToValue(blockstack.decryptContent(value), clazz.type || clazz);
      } catch (error) {
        decrypted[key] = value;
      }
    }
  });
  return decrypted;
};

export const encryptObject = (model) => {
  const object = model.attrs;
  const encrypted = Object.assign({}, object, { id: model.id });
  Object.keys(model.schema).forEach((key) => {
    const clazz = model.schema[key];
    const { decrypted } = clazz;
    const value = object[key];
    if (typeof (value) !== 'undefined') {
      encrypted[key] = decrypted ? value : blockstack.encryptContent(valueToString(value, clazz.type || clazz));
    }
  });
  return encrypted;
};
