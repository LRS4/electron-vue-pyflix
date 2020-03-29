module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          appId: 'pyflix',
          linux: {
            target: [
              "AppImage",
              "deb"
            ]
          }
        }
      }
    }
  }