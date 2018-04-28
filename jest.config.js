
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

module.exports = {
  roots: ["<rootDir>/src"],
  testRegex: "\\.spec\\.ts$",
  transform: { "\\.ts$": "ts-jest" },
  moduleFileExtensions: ["ts", "js"],
  globals: {
    "ts-jest": { enableTsDiagnostics: true }
  }
};
