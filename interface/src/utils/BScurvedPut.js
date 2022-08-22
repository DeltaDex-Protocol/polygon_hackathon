import cdfNormal from './some-math.js';



export const BScurvedPut = (opts) => {
  var x0 = opts.x0;
  var S = opts.S;
  var K = opts.K;
  var T = opts.T;
  var r = opts.r;
  var sigma = opts.sigma; 

  var TV0 = 2*x0;

  var z1 = -(Math.log(S/K) + (r - 0.5 * sigma**2) * T) / Math.sqrt(T) / sigma;

  var fp = (Math.exp(-r*T) * TV0) * cdfNormal(z1);
  var _r = r / 2;
  var _sigma = sigma / 2;
  var z2 = z1 - _sigma * Math.sqrt(T);

  var sp = (Math.exp(-r*T) * TV0*Math.sqrt(S/K)) * (Math.exp(-0.5 * _sigma**2 * T)*Math.exp(_r*T)) * cdfNormal(z2)

  return fp - sp;
}



export const deltaBScurvedPut = (opts) => {
  var x0 = opts.x0;
  var S = opts.S;
  var K = opts.K;
  var T = opts.T;
  var r = opts.r;
  var sigma = opts.sigma; 
  
  var z1 = -(Math.log(S/K) + (r - 0.5 * sigma**2) * T) / Math.sqrt(T) / sigma;
  var _r = r / 2;
  var _sigma = sigma / 2;
  var z2 = z1 - _sigma * Math.sqrt(T);

  var firstPart = (Math.exp(-r * T) * x0 / Math.sqrt(K * S));
  var secondPart = (Math.exp(-0.5 * _sigma**2 * T) * Math.exp(_r * T)) * cdfNormal(z2);
  
  return -firstPart * secondPart;


}


export default {BScurvedPut, deltaBScurvedPut};


