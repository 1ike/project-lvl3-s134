# page loader
!!! **no more than a learning project** !!!

[![Maintainability](https://api.codeclimate.com/v1/badges/11369a6982008fc1906e/maintainability)](https://codeclimate.com/github/1ike/project-lvl3-s134/maintainability)
[![Build Status](https://travis-ci.org/1ike/project-lvl3-s134.svg?branch=master)](https://travis-ci.org/1ike/project-lvl3-s134)
[![Test Coverage](https://api.codeclimate.com/v1/badges/11369a6982008fc1906e/test_coverage)](https://codeclimate.com/github/1ike/project-lvl3-s134/test_coverage)

Save web page for offline using (like "Save as" in browsers).

## Installing

Using GIT:

```bash
$ git clone https://github.com/1ike/project-lvl3-s134.git
$ cd ~/projects/my-page-loader  # go into the package directory
$ make build                    # just do it
$ npm i                         # install dependencies
$ npm link                      # creates global link
$ cd ~/projects/my-other-app    # go into some other package directory.
$ npm link page-loader          # link-install the package
```
[see more info](https://docs.npmjs.com/cli/link)

## Use

##### page-loader(url[, path])
 - url  :string
 - path :string (current working directory by default)
 - return promise

```js
var savePage = require('page-loader');

savePage('https://github.com', 'some/my/dir');
```

## License

ICS
