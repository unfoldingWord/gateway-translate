module.exports = {
  env: {
    NPM_PACKAGE_VERSION: process.env.npm_package_version,
    HELP_DESK_EMAIL: process.env.HELP_DESK_EMAIL,
    HELP_DESK_TOKEN: process.env.HELP_DESK_TOKEN,
    BUILD_NUMBER: require('child_process')
      .execSync('git rev-parse --short HEAD')
      .toString().trim(),
  }
}
