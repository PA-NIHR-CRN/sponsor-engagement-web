import type { Entry, EntryCollection, EntryLink, EntrySkeletonType, UnresolvedLink } from 'contentful'
import type { Document } from '@contentful/rich-text-types'


export function mapDynamicManagedContent(managedContent: Entry[] ) : Map<string, string | Document > | null{

var contentMap = new Map()
if (managedContent){
  managedContent.forEach((x)=>{ 
    var keys = Object.keys(x.fields)
    contentMap.set(x.fields[keys[0]], x.fields[keys[1]])
  })
}
return contentMap
}