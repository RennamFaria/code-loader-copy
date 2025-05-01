import anchorme from 'anchorme';

const protocolRegex = /^((file:\/\/\/)|(https?:|ftps?:)\/\/|(mailto:))/i;

const hasProtocol = (input) => protocolRegex.test(input);

export const getProtocol = (input) => {
  if (hasProtocol(input)) return '';

  return anchorme.validate.email(input) ? 'mailto:' : 'http://';
};

export const truncateText = (input, maxLength) => {
  if (process.env.NODE_ENV !== 'production') {
    if (maxLength <= 0) {
      throw new Error('⚓️ maxLength should be positive number');
    }
  }

  return input.length > maxLength ? `${input.substring(0, maxLength)}…` : input;
};
