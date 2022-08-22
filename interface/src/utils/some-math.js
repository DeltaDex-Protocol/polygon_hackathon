const mathjs = require('mathjs');


function cdfNormal (x, mean=0, standardDeviation=1) {
  return (1 - mathjs.erf((mean - x ) / (Math.sqrt(2) * standardDeviation))) / 2
}

export default cdfNormal;
