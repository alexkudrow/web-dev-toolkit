# Web Dev Toolkit

## Install

For using you need to install [Node.js](https://nodejs.org)

With Node.js installed, run

```
cd path/to/project
git clone https://github.com/alexkudrow/web-dev-toolkit.git
npm install
```

For auto deploing results by FTP fill out `ftp_config.example.json` by correct FTP-account data and rename it to `ftp_config.json`.

## Usage

Run command `gulp dev` for developing mode.

Run command `gulp` or `gulp build` for building development template.

Run command `gulp --production` or `gulp build --production` for building production template.

Run command `gulp deploy` for auto deploy by FTP.
