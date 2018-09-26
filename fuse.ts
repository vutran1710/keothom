import { FuseBox, WebIndexPlugin, CopyPlugin } from 'fuse-box'
import { src, task, watch } from 'fuse-box/sparky'
import { FrontendConfig } from './config/fe_config'
import { ServerConfig } from './config/be_config'

const baseConfig = {
  homeDir: '.',
  output: 'build/$name.js',
  useTypescriptCompiler: true,
  allowSyntheticDefaultImports: true,
  alias: {
    '@base': '~/client/component/base',
    '@container': '~/client/component/container',
    '@fe-service': '~/client/service/frontend',
    '@be-service': '~/client/service/backend',
    '@style': '~/client/style',
    '@constant': '~/client/manage/constant.js'
  }
}

/* Define tasks and functions and flow-through fuse instance */
const servingStatic = () => {
  const fuse = FuseBox.init({
    homeDir: '.',
    output: 'build/$name.js',
    target: "browser",
    plugins: [
      WebIndexPlugin({
        template: "client/index.html",
        author: "W-Team",
        charset: "utf-8",
        description: "an awesome project",
        keywords: "vutr, w-team"
      }),
      CopyPlugin({
        files: 'jpg.png.svg'.split('.').map(ext => `client/asset/*.${ext}`),
        dest: "build/asset"
      })]
  })
  fuse.run()
}

const backendServe = (port = 3000, isProduction = false) => () => {
  const serverConfig = ServerConfig(isProduction)
  const fuseConfig = { ...baseConfig, ...serverConfig }
  const fuse = FuseBox.init(fuseConfig)
  fuse.dev({ port, httpServer: false });
  fuse.bundle('server/bundle')
    .watch('server/**')
    .instructions('> [server/index.tsx]')
    .completed(proc => proc.start())
  fuse.run()
}

const frontendServe = (shouldRunDev = false, isProduction = false) => {
  return async function() {
    const frontendConfig = FrontendConfig(isProduction)
    const fuseConfig = { ...baseConfig, ...frontendConfig }
    const fuse = FuseBox.init(fuseConfig)
    shouldRunDev && fuse.dev();
    fuse.bundle('client/bundle')
      .watch('client/**')
      .hmr()
      .instructions('> client/App.tsx')
    return await fuse.run()
  }
}

task('clean_all', () => src('build').clean('build').exec())
task('clean_fe', () => src('build').clean('build/client').exec())
task('clean_be', () => src('build').clean('build/server').exec())
task('fe_serve', ['clean_fe', 'static'], frontendServe())
task('be_serve', ['clean_be', 'static'], backendServe())
task('static', servingStatic)

/* Default task: use fuse to run both server and client in dev mode */
task('default', ['clean_all', 'static'], () => {
  const bundleFrontend = frontendServe();
  const bundleBackend = backendServe();
  bundleFrontend().then(bundleBackend);
})