
// make dummy document for rome
if (typeof global.document === 'undefined') {
  global.document =  {
    createEvent() {}
  };
}

export * from 'rome';