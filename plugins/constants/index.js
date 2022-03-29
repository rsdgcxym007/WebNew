import * as data from './data';

export default (ctx, inject) => {
  inject('constants', {
    ...data,
  });
};
