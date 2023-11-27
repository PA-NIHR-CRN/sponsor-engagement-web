import path from 'path'
import fs from 'fs'
import handlebars from 'handlebars'

const templatesPath = path.resolve(process.cwd(), 'src/templates/email')

const lines = ['var handlebars = require("handlebars/runtime"); var templates = {}']

fs.readdirSync(templatesPath).forEach((fileName) => {
  const filePath = path.resolve(templatesPath, fileName)
  const templateContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const compiled = handlebars.precompile(templateContent) as string
  lines.push(`templates['${fileName}'] = handlebars.template(${compiled})`)
})

lines.push('module.exports = templates')

const outputPath = path.resolve(templatesPath, 'index.js')

fs.writeFileSync(outputPath, lines.join('\n'))
