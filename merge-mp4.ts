/**
 * Merge mp4 using ffmpeg from URL
 * @example
 * ```sh
 * merge-mp4 
 * @module
 */

import { parseArgs } from '@std/cli/parse-args'
import { Spinner } from '@std/cli/spinner'
import { $ } from '@david/dax'

const parsed = parseArgs(Deno.args, {
  alias: {
    o: 'output',
    O: 'output'
  },
  default: {
    output: 'output.mp4'
  }
})

const downloadLoading = new Spinner({
  message: 'Downloading file...'
})
downloadLoading.message = `Downloading file... (0 / ${parsed._.length})`
downloadLoading.start()
const filePaths: string[] = []
for (const url of parsed._) {
  if (typeof url !== 'string' || !URL.canParse(url)) {
    throw new Error(`${url} can't be parsed.`)
  }

  const filePath = await Deno.makeTempFile({ suffix: '.mp4' })
  /*
  const { body } = await fetch(url)
  if (!body) {
    continue
  }
  using file = await Deno.open(filePath)
  body.pipeTo(file.writable)*/
  const buff = await fetch(url).then(res => res.arrayBuffer())
  await Deno.writeFile(filePath, new Uint8Array(buff))

  filePaths.push(filePath)

  downloadLoading.message = `Downloading file... (${filePaths.length} / ${parsed._.length})`
}
downloadLoading.stop()

const list = await Deno.makeTempFile()
await Deno.writeTextFile(list, filePaths.map(p => `file '${p}'`).join('\n'))

await $`ffmpeg -f concat -safe 0 -i ${list} -c copy ${parsed.output}`
