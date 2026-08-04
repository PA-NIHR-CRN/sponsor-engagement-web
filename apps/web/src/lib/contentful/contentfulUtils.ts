import type { Document } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'


export function mapDynamicPageContent(pageContent: Entry[] | null ) : Map<string, string | Document > | null{

const contentMap = new Map()

if (pageContent){
  pageContent.forEach((x)=>{ 
    const keys = Object.keys(x.fields)
    contentMap.set(x.fields[keys[0]], x.fields[keys[1]])
  })
}
return contentMap
}