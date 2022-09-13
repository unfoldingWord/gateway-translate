module.exports = {
  env: {
    NPM_PACKAGE_VERSION: process.env.npm_package_version,
    BUILD_NUMBER: require('child_process')
      .execSync('git rev-parse --short HEAD')
      .toString().trim(),
  }
}
