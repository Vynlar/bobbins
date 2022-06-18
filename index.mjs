import express from 'express'
import zip from 'express-zip'
import path from 'path'
import fs from 'fs/promises'
import PQueue from 'p-queue'
import util from 'util';
import child_process from 'child_process'

const port = process.env.PORT || 3000
const app = express()

const exec = util.promisify(child_process.exec);

const queue = new PQueue({ concurrency: 2 })

const cache = {}

async function buildModel(code) {
  // Write param file
  if(cache[code]) {
    console.log(`Returning cache for ${code}`)
    return cache[code]
  }

  const params = {
    "fileFormatVersion" : "1",
    "parameterSets" : {
      [code]: {
        "$fa" : "1",
        "$fs" : "0.4",
        "circle" : "7",
        "depth" : "1.5",
        "height" : "38",
        "width" : "27",
        "code" : code
      }
    },
  }
  const paramPath = `params/${code}.params.json`
  const outputPath = `out/${code}.stl`
  await fs.writeFile(paramPath, JSON.stringify(params, null, 2))

  console.log(`Wrote params for code ${code}`)

  // exec openscad
  const {error, stdout, stderr} = await exec(`openscad -o ${outputPath} -p ${paramPath} -P ${code} bobbin.scad`)
  console.log(`Ran openscad for ${code}`)

  if (error) {
    console.error(error)
    throw new Error("Failed to build model")
  }
  console.log(`stdout: ${stdout}`);

  const result =  { path: outputPath, name: `${code}.stl` }
  cache[code] = result
  return result
}

app.get('/build', async (req, res) => {
  let codes = req.query.codes.split(',')
  codes = codes.map(code => code.replace(/[a-z][0-9]/, ''))
  if(codes.length > 100) {
    res.send("Too many codes. Max 100 codes allowed.")
    return
  }
  for(let code of codes) {
    if(code.length > 10) {
      res.send(`Code too long: ${code}. Max 10 characters.`)
      return
    }
  }
  const results = await Promise.all(codes.map(code =>
    queue.add(() => buildModel(code))
  ))
  console.log(results)
  res.zip(results, 'bobbins.zip')
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
