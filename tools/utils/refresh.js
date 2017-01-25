module.exports = function(pipe, bs) {
  if (!bs.active) {
    return pipe;
  }

  return pipe.pipe(bs.stream());
}
