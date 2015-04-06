// async version of settimeout, cannot be aborted
export default (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};