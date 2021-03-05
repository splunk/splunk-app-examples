function promisify(fn) {
  console.log("promisify: Don't use this in production! Use a proper promisify library instead.")

  // return a new promisified function
  return (...args) => {
    return new Promise((resolve, reject) => {
      // create a callback that resolves and rejects
      function callback(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback)

      // pass the callback into the function
      fn.call(this, ...args);
    })
  }
}

export {
  promisify,
}
