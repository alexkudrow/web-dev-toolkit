# Web Dev Toolkit

Web Dev Toolkit is a simple and quite flexible project template for web-development. It is designed to solve the routine tasks that web-developers are constantly confronted with.

## Install

For using you need to install [Node.js](https://nodejs.org).

Next, you need to install gulp globally:

```
npm install -g gulp
```

With Node.js and gulp installed, run:

```
cd path/to/project
git clone https://github.com/alexkudrow/web-dev-toolkit.git
npm install
```

For deploying results by FTP fill out `ftp_config.example.json` by correct FTP-account data and rename it to `ftp_config.json`.

## Basic commands

`gulp` or `gulp build` — build project.

`gulp dev` — build project and start watching changes with livereload.

`gulp build` and `gulp dev` commands support a few parameters:

* Environment modes:
    * `--production` — generate ready for release project with resource optimization.
    * `--demonstration` — same as `--production`, but it is useful if there is no need to include a code such as statistics scripts. Also add a `<meta name="robots" content="noindex, nofollow">` tag to each page.
    * `--development` — an optional parameter used by default.
* `--no-root-urls` — convert root-relative URLs to relative to its current directories. Useful to run the project without web-server.
* `--base-href=/path/` — add a `<base href="/path/">` tag to each page and also convert URLs like `--no-root-urls` parameter. This will help with deploying to virtual host subdirectories on web-servers.

`gulp zip` — archive project to zip file.

`gulp build-zip` — build project and then archive it to zip file.

`gulp deploy` — deploy project by FTP using data from `ftp_config.json`.