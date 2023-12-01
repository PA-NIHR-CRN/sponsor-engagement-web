import path from 'node:path'
import fs from 'node:fs'
import handlebars from 'handlebars'

const templateDirs = ['sponsor-engagement/email']

templateDirs.forEach((templateDir) => {
  const templatesPath = path.join(process.cwd(), templateDir)

  const lines = ['var handlebars = require("handlebars/runtime"); var templates = {}']

  fs.readdirSync(templatesPath)
    .filter((fileName) => fileName.endsWith('.hbs'))
    .forEach((fileName) => {
      const filePath = path.join(templatesPath, fileName)
      const templateContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
      const compiled = handlebars.precompile(templateContent) as string
      lines.push(`templates['${fileName}'] = handlebars.template(${compiled})`)
    })

  lines.push('module.exports = templates')

  const outputPath = path.resolve(templatesPath, 'index.js')

  fs.writeFileSync(outputPath, lines.join('\n'))
})
