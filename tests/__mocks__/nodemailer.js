module.exports = {
  createTransport() {     // mock createTransport function only
      return {            // must return an object with sendMail property
          sendMail() {    // sendMail is empty function, uses shorthand

          }
      }
  }
}