import rimraf from 'rimraf';


const rmrf = f => new Promise((resolve, reject) => {
  rimraf(f, (e) => {
    if (e) reject(e);
    resolve();
  });
});

export default rmrf;
