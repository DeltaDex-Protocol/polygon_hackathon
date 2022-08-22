import cdfNormal from './some-math.js';





export const BSvanillaPut = (opts) => {
  var S = opts.S;
  var K = opts.K;
  var T = opts.T;
  var r = opts.r;
  var sigma = opts.sigma; 
  

  var d1 = (Math.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * Math.sqrt(T));
  var d2 = d1 - sigma * Math.sqrt(T);

  var d1Normal = cdfNormal(-d1);
  var d2Normal = cdfNormal(-d2);

  var putPrice = K * d2Normal * (Math.exp(-r *T)) - S * d1Normal;

  return putPrice;
}


export const deltaBSvanillaPut = (opts) => {
  var S = opts.S;
  var K = opts.K;
  var T = opts.T;
  var r = opts.r;
  var sigma = opts.sigma; 
  

  var d1 = (Math.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * Math.sqrt(T));

  var d1Normal = cdfNormal(d1);

  var putDelta = d1Normal - 1;

  return putDelta;
}


export default {BSvanillaPut, deltaBSvanillaPut};


