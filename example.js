let gs = require('./index');

(async () => {

  let result = await gs()
    .batch()
    .nopause()
    .alphaBits(4)
    .interpolate()
    .resolution(300)
    .page(1)
    .device('png16m')
    .output('output.png')
    .input('input.pdf')
    .exec();

  console.log(result);

})().then(() => {}, err => console.log(err));
