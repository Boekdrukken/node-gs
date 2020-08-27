let gs = require('./index');

(async () => {

  let result = await gs()
    .batch()
    .nopause()
    .page(5)
    .textAlphaBits(4)
    .graphicsAlphaBits(4)
    .interpolate()
    .device('png16m')
    .output('output.png')
    .input('input.pdf')
    .exec();

  console.log(result);

})().then(() => {}, err => console.log(err));
