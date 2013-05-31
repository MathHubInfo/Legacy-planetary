require 'shelljs/global'
config.fatal = true

fs     = require 'fs'
path   = require 'path'
os     = require 'os'

# Gain access through PATH to all binaries added by `npm install`
# Rewrite when https://github.com/arturadib/shelljs/issues/32 is fixed
npm_bin  = path.resolve(path.join('node_modules', '.bin'))
path_sep = if os.platform() == 'win32' then ";" else ":"
process.env.PATH = "#{npm_bin}#{path_sep}#{process.env.PATH}"

task 'build', 'Build the .js files', ->
	exec "coffee --compile --bare --output editor_tools src/"
	exec "r.js -o build.js optimize=none"

task 'min', 'Build the minified version', ->
	exec "r.js -o build.js"
