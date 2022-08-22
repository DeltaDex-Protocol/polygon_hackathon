import cdfNormal from './some-math.js';





export const BSvanillaCall = (opts) => {
  var S = opts.S;
  var K = opts.K;
  var T = opts.T;
  var r = opts.r;
  var sigma = opts.sigma; 
  

  var d1 = (Math.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * Math.sqrt(T));
  var d2 = d1 - sigma * Math.sqrt(T);

  var d1Normal = cdfNormal(d1);
  var d2Normal = cdfNormal(d2);

  var callPrice = S * d1Normal - K * d2Normal * (Math.exp(-r *T));

  return callPrice;
}


export const deltaBSvanillaCall = (opts) => {
  var S = opts.S;
  var K = opts.K;
  var T = opts.T;
  var r = opts.r;
  var sigma = opts.sigma; 
  

  var d1 = (Math.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * Math.sqrt(T));

  var d1Normal = cdfNormal(d1);

  var callDelta = d1Normal;

  return callDelta;
}





export default {BSvanillaCall, deltaBSvanillaCall};

