import path from 'path'

export default function generateEditFilePath({
  item,
  resource,
  filePath,
  projectId,
  cardResourceId,
}) {
  if (cardResourceId === 'twl') {
    return resource?.project?.path?.replace('./', '')
  }

  const resourcePath = resource?.project?.path ? resource?.project?.path?.replace('./', '') : null
  return item?.filePath || (projectId && filePath ? path.join(projectId, filePath) : resourcePath)
}
